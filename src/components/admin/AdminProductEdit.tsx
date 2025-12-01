import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ColorVariant {
  color: string;
  images: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  base_price: number;
  description: string;
  category_id: string | null;
  image_url: string;
  is_featured: boolean;
  color_variants?: any;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  images?: string[];
}

export interface CategoryItem {
  id: string;
  name: string;
  parent_id: string | null;
  subcategories?: CategoryItem[];
}

type UploadMethod = "url" | "file";

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("url");

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image_url: "",
    stock: "",
    is_featured: false,
    colors: "",
    color_variants: [] as ColorVariant[],
    specifications: {
      product_type: "",
      arm_type: "",
      brand: "",
      model: "",
      height_adjustable: "",
      seat_material: "",
      frame_material: "",
      usage: "",
      colour: "",
      warranty: "",
    },
    customSpecs: [] as { label: string; value: string }[],
    features: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [categoriesRes, productRes] = await Promise.all([
        supabase.from("categories").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*").eq("id", id).single(),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (productRes.error) throw productRes.error;

      setCategories(categoriesRes.data || []);

      if (productRes.data) {
        setProduct(productRes.data);
        const specs = (productRes.data as any).specifications || {};
        const standardKeys = [
          "product_type",
          "arm_type",
          "brand",
          "model",
          "height_adjustable",
          "seat_material",
          "frame_material",
          "usage",
          "colour",
          "warranty",
        ];

        setProductForm({
          name: productRes.data.name,
          price: productRes.data.base_price.toString(),
          description: productRes.data.description || "",
          category: productRes.data.category_id || "",
          image_url: productRes.data.image_url || "",
          stock: "0",
          is_featured: productRes.data.is_featured,
          colors: "",
          color_variants: productRes.data.color_variants || [],
          specifications: {
            product_type: specs.product_type || "",
            arm_type: specs.arm_type || "",
            brand: specs.brand || "",
            model: specs.model || "",
            height_adjustable: specs.height_adjustable || "",
            seat_material: specs.seat_material || "",
            frame_material: specs.frame_material || "",
            usage: specs.usage || "",
            colour: specs.colour || "",
            warranty: specs.warranty || "",
          },
          customSpecs: Object.keys(specs)
            .filter((key) => !standardKeys.includes(key))
            .map((key) => ({
              label: key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              value: specs[key],
            })),
          features: (productRes.data as any).features || [],
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load product or categories",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setUploading(true);

      const processedVariants = await Promise.all(
        productForm.color_variants.map(async (variant) => {
          const processedImages = await Promise.all(
            variant.images.map(async (img, imgIndex) => {
              const fileInput = document.getElementById(
                `variant-image-${productForm.color_variants.indexOf(variant)}-${imgIndex}`
              ) as HTMLInputElement;

              if (fileInput?.files?.[0]) {
                const file = fileInput.files[0];
                const fileExt = file.name.split(".").pop();
                const fileName = `products/${Date.now()}-${Math.random()
                  .toString(36)
                  .substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                  .from("product-images")
                  .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: publicData } = supabase.storage
                  .from("product-images")
                  .getPublicUrl(fileName);

                return publicData.publicUrl;
              }

              return img;
            })
          );

          return {
            color: variant.color,
            images: processedImages.filter(
              (img) => img && !img.startsWith("uploading:")
            ),
          };
        })
      );

      const firstVariantImage = processedVariants[0]?.images[0] || "";

      const productData = {
        name: productForm.name,
        base_price: parseFloat(productForm.price),
        description: productForm.description,
        category_id: productForm.category,
        image_url: firstVariantImage,
        is_featured: productForm.is_featured,
        color_variants: processedVariants.filter(
          (v) => v.color && v.images.length > 0
        ),
        specifications: {
          ...productForm.specifications,
          ...productForm.customSpecs.reduce((acc, spec) => {
            if (spec.label && spec.value) {
              acc[spec.label.toLowerCase().replace(/\s+/g, "_")] = spec.value;
            }
            return acc;
          }, {} as Record<string, string>),
        },
        features: productForm.features.filter((f) => f.trim() !== ""),
      };

      const { error } = await supabase
        .from("products")
        .update(productData as any)
        .eq("id", product.id);

      if (error) throw error;

      toast({ title: "Product updated successfully" });
      navigate("/admin/dashboard/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Product not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/dashboard/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productForm.name || ""}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price || ""}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={productForm.description || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setProductForm((prev) => ({
                    ...prev,
                    description: value,
                  }));
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) =>
                    setProductForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => !cat.parent_id)
                      .map((parent) => (
                        <div key={parent.id}>
                          <SelectItem value={parent.id}>
                            {parent.name}
                          </SelectItem>
                          {categories
                            .filter((sub) => sub.parent_id === parent.id)
                            .map((sub) => (
                              <SelectItem
                                key={sub.id}
                                value={sub.id}
                                className="pl-6"
                              >
                                └─ {sub.name}
                              </SelectItem>
                            ))}
                        </div>
                      ))}
                      {categories
                        .filter(
                          (cat) =>
                            cat.parent_id &&
                            !categories.find((p) => p.id === cat.parent_id)
                        )
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock || ""}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={productForm.is_featured}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      is_featured: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="is_featured">Featured Product</Label>
              </div>
            </div>

            <div>
              <Label>Basic Product Specifications</Label>
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={productForm.specifications.brand}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          brand: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Neem Furnitech"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={productForm.specifications.model}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          model: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., NF 1102"
                  />
                </div>
                <div>
                  <Label htmlFor="product_type">Product Type</Label>
                  <Input
                    id="product_type"
                    value={productForm.specifications.product_type}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          product_type: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Executive Boss Chair"
                  />
                </div>
                <div>
                  <Label htmlFor="arm_type">Arm Type</Label>
                  <Input
                    id="arm_type"
                    value={productForm.specifications.arm_type}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          arm_type: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Adjustable Arm"
                  />
                </div>
                <div>
                  <Label htmlFor="height_adjustable">Height Adjustable</Label>
                  <Input
                    id="height_adjustable"
                    value={productForm.specifications.height_adjustable}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          height_adjustable: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Yes"
                  />
                </div>
                <div>
                  <Label htmlFor="seat_material">Seat Material</Label>
                  <Input
                    id="seat_material"
                    value={productForm.specifications.seat_material}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          seat_material: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Premium cushioned fabric"
                  />
                </div>
                <div>
                  <Label htmlFor="frame_material">Frame Material</Label>
                  <Input
                    id="frame_material"
                    value={productForm.specifications.frame_material}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          frame_material: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Chrome plating Base"
                  />
                </div>
                <div>
                  <Label htmlFor="usage">Usage</Label>
                  <Input
                    id="usage"
                    value={productForm.specifications.usage}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          usage: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Office"
                  />
                </div>
                <div>
                  <Label htmlFor="colour">Colour</Label>
                  <Input
                    id="colour"
                    value={productForm.specifications.colour}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          colour: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., All colour Available"
                  />
                </div>
                <div>
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input
                    id="warranty"
                    value={productForm.specifications.warranty}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        specifications: {
                          ...prev.specifications,
                          warranty: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., 1 Year"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Additional Specifications (Product Specific)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProductForm((prev) => ({
                      ...prev,
                      customSpecs: [...prev.customSpecs, { label: "", value: "" }],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Specification
                </Button>
              </div>
              {productForm.customSpecs.length > 0 && (
                <div className="space-y-3 p-4 border rounded-lg">
                  {productForm.customSpecs.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label htmlFor={`custom-label-${index}`}>
                          Specification Name
                        </Label>
                        <Input
                          id={`custom-label-${index}`}
                          value={spec.label}
                          onChange={(e) => {
                            const newSpecs = [...productForm.customSpecs];
                            newSpecs[index].label = e.target.value;
                            setProductForm((prev) => ({
                              ...prev,
                              customSpecs: newSpecs,
                            }));
                          }}
                          placeholder="e.g., Weight Capacity, Dimensions"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`custom-value-${index}`}>Value</Label>
                        <Input
                          id={`custom-value-${index}`}
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...productForm.customSpecs];
                            newSpecs[index].value = e.target.value;
                            setProductForm((prev) => ({
                              ...prev,
                              customSpecs: newSpecs,
                            }));
                          }}
                          placeholder="e.g., 150 kg, 120x80x75 cm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newSpecs = productForm.customSpecs.filter(
                            (_, i) => i !== index
                          );
                          setProductForm((prev) => ({
                            ...prev,
                            customSpecs: newSpecs,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Add product-specific specifications like Weight Capacity,
                Dimensions, Load Bearing, etc.
              </p>
            </div>

            <div>
              <Label>Product Features</Label>
              <div className="space-y-2 p-4 border rounded-lg">
                {productForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...productForm.features];
                        newFeatures[index] = e.target.value;
                        setProductForm((prev) => ({
                          ...prev,
                          features: newFeatures,
                        }));
                      }}
                      placeholder="Enter feature description"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFeatures = productForm.features.filter(
                          (_, i) => i !== index
                        );
                        setProductForm((prev) => ({
                          ...prev,
                          features: newFeatures,
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProductForm((prev) => ({
                      ...prev,
                      features: [...prev.features, ""],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
            </div>

            <div>
              <Label>Color Variants</Label>
              <div className="space-y-3 p-4 border rounded-lg">
                {productForm.color_variants.map((variant, index) => (
                  <div key={index} className="space-y-2 p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between">
                      <Input
                        value={variant.color}
                        onChange={(e) => {
                          const newVariants = [...productForm.color_variants];
                          newVariants[index].color = e.target.value;
                          setProductForm((prev) => ({
                            ...prev,
                            color_variants: newVariants,
                          }));
                        }}
                        placeholder="Color name (e.g., Black)"
                        className="flex-1 mr-2"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newVariants = productForm.color_variants.filter(
                            (_, i) => i !== index
                          );
                          setProductForm((prev) => ({
                            ...prev,
                            color_variants: newVariants,
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">
                        Images for {variant.color || "this color"}
                      </Label>
                      {variant.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`upload-method-${index}-${imgIndex}`}
                                    checked={true}
                                    onChange={() => {}}
                                  />
                                  <span className="text-sm">URL</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`upload-method-${index}-${imgIndex}`}
                                    onChange={() => {}}
                                  />
                                  <span className="text-sm">Upload</span>
                                </label>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={img}
                                  onChange={(e) => {
                                    const newVariants = [
                                      ...productForm.color_variants,
                                    ];
                                    newVariants[index].images[imgIndex] =
                                      e.target.value;
                                    setProductForm((prev) => ({
                                      ...prev,
                                      color_variants: newVariants,
                                    }));
                                  }}
                                  placeholder="Image URL or upload file"
                                  className="flex-1"
                                />
                                <Input
                                  type="file"
                                  accept="image/*"
                                  id={`variant-image-${index}-${imgIndex}`}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const newVariants = [
                                        ...productForm.color_variants,
                                      ];
                                      newVariants[index].images[imgIndex] =
                                        `uploading:${file.name}`;
                                      setProductForm((prev) => ({
                                        ...prev,
                                        color_variants: newVariants,
                                      }));
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    document
                                      .getElementById(
                                        `variant-image-${index}-${imgIndex}`
                                      )
                                      ?.click();
                                  }}
                                >
                                  Browse
                                </Button>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newVariants = [
                                  ...productForm.color_variants,
                                ];
                                newVariants[index].images = newVariants[
                                  index
                                ].images.filter((_, i) => i !== imgIndex);
                                setProductForm((prev) => ({
                                  ...prev,
                                  color_variants: newVariants,
                                }));
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newVariants = [...productForm.color_variants];
                          newVariants[index].images.push("");
                          setProductForm((prev) => ({
                            ...prev,
                            color_variants: newVariants,
                          }));
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Image
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProductForm((prev) => ({
                      ...prev,
                      color_variants: [
                        ...prev.color_variants,
                        { color: "", images: [""] },
                      ],
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Color Variant
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Add color variants with images. You can use URLs or upload
                files from your local folder.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>
                {uploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/dashboard/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
