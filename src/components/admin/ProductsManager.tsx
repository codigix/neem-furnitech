import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Edit, Trash2 } from "lucide-react";

// Keep types local to avoid cross-file coupling
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

interface ProductsManagerProps {
  showAddProduct: boolean;
  setShowAddProduct: (v: boolean) => void;
  editingProduct: ProductItem | null;
  productForm: {
    name: string;
    price: string;
    description: string;
    category: string;
    image_url: string;
    stock: string;
    is_featured: boolean;
    colors: string;
    color_variants: ColorVariant[];
  };
  setProductForm: React.Dispatch<React.SetStateAction<ProductsManagerProps["productForm"]>>;
  productUploadMethod: UploadMethod;
  setProductUploadMethod: (m: UploadMethod) => void;
  productUploadingFile: boolean;
  categories: CategoryItem[];
  products: ProductItem[];
  handleProductSubmit: (e: React.FormEvent) => void;
  resetProductForm: () => void;
  editProduct: (p: ProductItem) => void;
  deleteProduct: (id: string) => void;
}

export function ProductsManager({
  showAddProduct,
  setShowAddProduct,
  editingProduct,
  productForm,
  setProductForm,
  productUploadMethod,
  setProductUploadMethod,
  productUploadingFile,
  categories,
  products,
  handleProductSubmit,
  resetProductForm,
  editProduct,
  deleteProduct,
}: ProductsManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Products Management</h1>
        <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {showAddProduct && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProductSubmit} className="space-y-4">
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
                    onValueChange={(value) => setProductForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter(cat => !cat.parent_id)
                        .map((parent) => (
                          <div key={parent.id}>
                            <SelectItem value={parent.id}>
                              {parent.name}
                            </SelectItem>
                            {categories
                              .filter(sub => sub.parent_id === parent.id)
                              .map((sub) => (
                                <SelectItem key={sub.id} value={sub.id} className="pl-6">
                                  └─ {sub.name}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      {/* Orphan categories without parent */}
                      {categories
                        .filter(cat => cat.parent_id && !categories.find(p => p.id === cat.parent_id))
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
                            setProductForm((prev) => ({ ...prev, color_variants: newVariants }));
                          }}
                          placeholder="Color name (e.g., Black)"
                          className="flex-1 mr-2"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newVariants = productForm.color_variants.filter((_, i) => i !== index);
                            setProductForm((prev) => ({ ...prev, color_variants: newVariants }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Images for {variant.color || "this color"}</Label>
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
                                      const newVariants = [...productForm.color_variants];
                                      newVariants[index].images[imgIndex] = e.target.value;
                                      setProductForm((prev) => ({ ...prev, color_variants: newVariants }));
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
                                        const newVariants = [...productForm.color_variants];
                                        newVariants[index].images[imgIndex] = `uploading:${file.name}`;
                                        setProductForm((prev) => ({ ...prev, color_variants: newVariants }));
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      document.getElementById(`variant-image-${index}-${imgIndex}`)?.click();
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
                                  const newVariants = [...productForm.color_variants];
                                  newVariants[index].images = newVariants[index].images.filter((_, i) => i !== imgIndex);
                                  setProductForm((prev) => ({ ...prev, color_variants: newVariants }));
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
                            setProductForm((prev) => ({ ...prev, color_variants: newVariants }));
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
                        color_variants: [...prev.color_variants, { color: "", images: [""] }]
                      }));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Color Variant
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Add color variants with images. You can use URLs or upload files from your local folder.
                </p>
              </div>


              <div className="flex gap-2">
                <Button type="submit" disabled={productUploadingFile}>
                  {productUploadingFile ? "Uploading..." : editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={resetProductForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-32 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-primary font-bold">₹{product.base_price || 0}</p>
                  {product.is_featured && <Badge className="mt-1">Featured</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => editProduct(product)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
