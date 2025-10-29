import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string | null;
  is_featured: boolean;
}

const GALLERY_CATEGORIES = [
  "Weddings",
  "Birthdays",
  "Anniversaries",
  "Corporate Events",
  "Religious Ceremonies",
  "Other"
];

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gallery Management</h1>
        <Button onClick={() => setShowAddGallery(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

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
                    {GALLERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
          {GALLERY_CATEGORIES.map((cat) => {
            const count = galleryImages.filter(img => img.category === cat).length;
            return (
              <TabsTrigger key={cat} value={cat}>
                {cat} ({count})
              </TabsTrigger>
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
