import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string | null;
  is_featured: boolean;
}

export interface GalleryCategory {
  id: string;
  name: string;
  created_at: string;
}

type UploadMethod = "url" | "file";

interface GalleryManagerProps {
  showAddGallery: boolean;
  setShowAddGallery: (v: boolean) => void;
  editingGallery: GalleryItem | null;
  galleryForm: {
    title: string;
    description: string;
    image_url: string;
    category: string;
    is_featured: boolean;
  };
  setGalleryForm: React.Dispatch<React.SetStateAction<GalleryManagerProps["galleryForm"]>>;
  uploadMethod: UploadMethod;
  setUploadMethod: (m: UploadMethod) => void;
  uploadingFile: boolean;
  galleryImages: GalleryItem[];
  handleGallerySubmit: (e: React.FormEvent) => void;
  resetGalleryForm: () => void;
  editGallery: (g: GalleryItem) => void;
  deleteGallery: (id: string) => void;
}

export function GalleryManager({
  showAddGallery,
  setShowAddGallery,
  editingGallery,
  galleryForm,
  setGalleryForm,
  uploadMethod,
  setUploadMethod,
  uploadingFile,
  galleryImages,
  handleGallerySubmit,
  resetGalleryForm,
  editGallery,
  deleteGallery,
}: GalleryManagerProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    setCategories(data || []);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const { error } = await supabase
      .from("gallery_categories")
      .insert({ name: newCategoryName.trim() });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category added successfully",
    });

    setNewCategoryName("");
    setShowAddCategory(false);
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Images in this category will not be deleted.`)) return;

    const { error } = await supabase
      .from("gallery_categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category deleted successfully",
    });

    fetchCategories();
    if (selectedCategory === name) {
      setSelectedCategory("all");
    }
  };

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gallery Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddCategory(true)} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
          <Button onClick={() => setShowAddGallery(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      {showAddCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Weddings, Birthdays"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Category</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName("");
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showAddGallery && (
        <Card>
          <CardHeader>
            <CardTitle>{editingGallery ? "Edit Gallery Image" : "Add New Gallery Image"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gallery-title">Title</Label>
                  <Input
                    id="gallery-title"
                    value={galleryForm.title}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="gallery-featured"
                    checked={galleryForm.is_featured}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({
                        ...prev,
                        is_featured: e.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor="gallery-featured">Featured Image</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="gallery-category">Category</Label>
                <Select
                  value={galleryForm.category}
                  onValueChange={(value) =>
                    setGalleryForm((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Upload Method</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="url"
                      checked={uploadMethod === "url"}
                      onChange={(e) => setUploadMethod(e.target.value as UploadMethod)}
                    />
                    <span>Image URL</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="file"
                      checked={uploadMethod === "file"}
                      onChange={(e) => setUploadMethod(e.target.value as UploadMethod)}
                    />
                    <span>Upload File</span>
                  </label>
                </div>
              </div>

              {uploadMethod === "url" ? (
                <div>
                  <Label htmlFor="gallery-image">Image URL</Label>
                  <Input
                    id="gallery-image"
                    value={galleryForm.image_url}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({
                        ...prev,
                        image_url: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="gallery-file-input">Upload Image</Label>
                  <Input
                    id="gallery-file-input"
                    type="file"
                    accept="image/*"
                    required={!editingGallery}
                    className="cursor-pointer"
                  />
                  {uploadingFile && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={uploadingFile}>
                  {uploadingFile ? "Uploading..." : editingGallery ? "Update Image" : "Add Image"}
                </Button>
                <Button type="button" variant="outline" onClick={resetGalleryForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All ({galleryImages.length})</TabsTrigger>
          {categories.map((cat) => {
            const count = galleryImages.filter(img => img.category === cat.name).length;
            return (
              <div key={cat.id} className="relative inline-flex items-center">
                <TabsTrigger value={cat.name}>
                  {cat.name} ({count})
                </TabsTrigger>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 ml-1 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat.id, cat.name);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative group">
                    <img 
                      src={image.image_url} 
                      alt={image.title} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <h3 className="font-semibold text-white text-center text-sm">{image.title}</h3>
                      {image.category && (
                        <Badge variant="secondary" className="text-xs">{image.category}</Badge>
                      )}
                      {image.is_featured && <Badge className="text-xs">Featured</Badge>}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="secondary" onClick={() => editGallery(image)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteGallery(image.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/70">
                No images in this category. Add some celebration photos!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
