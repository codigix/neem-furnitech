import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ChevronRight, X } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  subcategories?: CategoryItem[];
}

interface CategoriesManagerProps {
  showAddCategory: boolean;
  setShowAddCategory: (v: boolean) => void;
  editingCategory: CategoryItem | null;
  categoryForm: {
    name: string;
    description: string;
    parent_id: string;
    subcategories: { name: string; description: string }[];
  };
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoriesManagerProps["categoryForm"]>>;
  categories: CategoryItem[];
  handleCategorySubmit: (e: React.FormEvent) => void;
  resetCategoryForm: () => void;
  editCategory: (c: CategoryItem) => void;
  deleteCategory: (id: string) => void;
  onAddSubcategory?: (parentId: string) => void;
}

// Helper function to organize categories into parent-child structure
const organizeCategoriesHierarchy = (categories: CategoryItem[]): CategoryItem[] => {
  const categoryMap = new Map<string, CategoryItem>();
  const rootCategories: CategoryItem[] = [];

  // First pass: create a map of all categories
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, subcategories: [] });
  });

  // Second pass: organize into hierarchy
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parent_id) {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.subcategories = parent.subcategories || [];
        parent.subcategories.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
};

// Component to render a category and its subcategories
interface CategoryCardProps {
  category: CategoryItem;
  level?: number;
  editCategory: (c: CategoryItem) => void;
  deleteCategory: (id: string) => void;
  onAddSubcategory?: (parentId: string) => void;
}

const CategoryCard = ({ 
  category, 
  level = 0, 
  editCategory, 
  deleteCategory,
  onAddSubcategory
}: CategoryCardProps) => {
  return (
    <div className={`${level > 0 ? 'ml-8 mt-2' : ''}`}>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {level > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  {level === 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Main Category
                    </span>
                  )}
                  {level > 0 && (
                    <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                      Subcategory
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                )}
                {category.subcategories && category.subcategories.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {category.subcategories.length} subcategory(ies)
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {level === 0 && onAddSubcategory && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => onAddSubcategory(category.id)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Sub
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => editCategory(category)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteCategory(category.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Render subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="space-y-2 mt-2">
          {category.subcategories.map(subcat => (
            <CategoryCard
              key={subcat.id}
              category={subcat}
              level={level + 1}
              editCategory={editCategory}
              deleteCategory={deleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function CategoriesManager({
  showAddCategory,
  setShowAddCategory,
  editingCategory,
  categoryForm,
  setCategoryForm,
  categories,
  handleCategorySubmit,
  resetCategoryForm,
  editCategory,
  deleteCategory,
  onAddSubcategory,
}: CategoriesManagerProps) {
  const hierarchicalCategories = organizeCategoriesHierarchy(categories);
  
  // Get only parent categories (no parent_id) for the dropdown
  const parentCategories = categories.filter(cat => !cat.parent_id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Categories Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your products with categories and subcategories
          </p>
        </div>
        <Button onClick={() => setShowAddCategory(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {showAddCategory && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </CardTitle>
            {categoryForm.parent_id && (
              <p className="text-sm text-muted-foreground mt-2">
                Adding subcategory to: <strong>{categories.find(c => c.id === categoryForm.parent_id)?.name || "Unknown"}</strong>
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name *</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Furniture, Electronics"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  name="description"
                  value={categoryForm.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategoryForm((prev) => ({
                      ...prev,
                      description: value,
                    }));
                  }}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="parent-category">Parent Category (Optional)</Label>
                    <Select
                      value={categoryForm.parent_id}
                      onValueChange={(value) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          parent_id: value === "none" ? "" : value,
                          subcategories: value === "none" ? [] : prev.subcategories,
                        }))
                      }
                    >
                      <SelectTrigger id="parent-category">
                        <SelectValue placeholder="Select a parent category or leave as main category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Main Category)</SelectItem>
                        {parentCategories
                          .filter(cat => editingCategory ? cat.id !== editingCategory.id : true)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to create a main category, or select a parent to create a subcategory
                    </p>
                  </div>
                </div>
              </div>

              {/* Subcategories section - show when creating a main category OR when editing main category */}
              {!categoryForm.parent_id && (editingCategory?.parent_id === null || !editingCategory) && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <Label>Subcategories (Optional)</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          subcategories: [
                            ...prev.subcategories,
                            { name: "", description: "" },
                          ],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subcategory
                    </Button>
                  </div>
                  
                  {categoryForm.subcategories.length > 0 && (
                    <div className="space-y-3">
                      {categoryForm.subcategories.map((sub, index) => (
                        <Card key={index} className="bg-muted/50">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <Label className="text-sm">Subcategory {index + 1}</Label>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setCategoryForm((prev) => ({
                                    ...prev,
                                    subcategories: prev.subcategories.filter(
                                      (_, i) => i !== index
                                    ),
                                  }))
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div>
                              <Input
                                placeholder="Subcategory name"
                                value={sub.name}
                                onChange={(e) =>
                                  setCategoryForm((prev) => ({
                                    ...prev,
                                    subcategories: prev.subcategories.map((s, i) =>
                                      i === index ? { ...s, name: e.target.value } : s
                                    ),
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Textarea
                                placeholder="Subcategory description"
                                value={sub.description}
                                rows={2}
                                onChange={(e) =>
                                  setCategoryForm((prev) => ({
                                    ...prev,
                                    subcategories: prev.subcategories.map((s, i) =>
                                      i === index
                                        ? { ...s, description: e.target.value }
                                        : s
                                    ),
                                  }))
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
                <Button type="button" variant="outline" onClick={resetCategoryForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {hierarchicalCategories.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No categories yet. Create your first category to get started!</p>
            </CardContent>
          </Card>
        ) : (
          hierarchicalCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              editCategory={editCategory}
              deleteCategory={deleteCategory}
              onAddSubcategory={onAddSubcategory}
            />
          ))
        )}
      </div>
    </div>
  );
}
