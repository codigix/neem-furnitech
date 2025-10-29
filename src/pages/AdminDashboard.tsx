import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
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
import {
  Package,
  Users,
  ShoppingBag,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  LogOut,
  BarChart3,
  Grid3X3,
  Images,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminDashboard as AdminDashboardComponent } from "@/components/admin/AdminDashboard";
import { ProductsManager as ProductsManagerComponent } from "@/components/admin/ProductsManager";
import { CategoriesManager as CategoriesManagerComponent } from "@/components/admin/CategoriesManager";
import { GalleryManager as GalleryManagerComponent } from "@/components/admin/GalleryManager";

interface Product {
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

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  order_items: any;
  user_id: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  subcategories?: Category[];
}

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Form states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "chair",
    image_url: "",
    stock: "",
    is_featured: false,
    colors: "",
    color_variants: [] as { color: string; images: string[] }[],
  });
  const [productUploadMethod, setProductUploadMethod] = useState<
    "url" | "file"
  >("url");
  const [productUploadingFile, setProductUploadingFile] = useState(false);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    parent_id: "",
    subcategories: [] as { name: string; description: string }[],
  });

  const [showAddGallery, setShowAddGallery] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(
    null
  );
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    is_featured: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
      return;
    }

    // Check if user has admin role
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!data) {
      navigate("/admin");
      return;
    }

    setUser(session.user);
    fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchCategories(),
      fetchProducts(),
      fetchGallery(),
      fetchContacts(),
    ]);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    // TODO: Implement when orders table is created
    setOrders([]);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Dashboard Overview Component - now using the new component
  const DashboardOverview = () => <AdminDashboardComponent />;

  // Category Management Functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description,
        parent_id: categoryForm.parent_id || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast({ title: "Category updated successfully" });
      } else {
        // Insert main category first
        const { data: mainCategory, error: mainError } = await supabase
          .from("categories")
          .insert(categoryData)
          .select()
          .single();

        if (mainError) throw mainError;

        // If there are subcategories and this is a main category, insert them
        if (categoryForm.subcategories.length > 0 && !categoryForm.parent_id) {
          const subcategoriesData = categoryForm.subcategories.map(sub => ({
            name: sub.name,
            description: sub.description,
            parent_id: mainCategory.id,
          }));

          const { error: subError } = await supabase
            .from("categories")
            .insert(subcategoriesData);

          if (subError) throw subError;
          toast({ 
            title: "Category and subcategories added successfully",
            description: `Created 1 main category and ${categoryForm.subcategories.length} subcategory(ies)`
          });
        } else {
          toast({ title: "Category added successfully" });
        }
      }

      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      parent_id: "",
      subcategories: [],
    });
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  const editCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      parent_id: category.parent_id || "",
      subcategories: [],
    });
    setEditingCategory(category);
    setShowAddCategory(true);
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
      toast({ title: "Category deleted successfully" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleAddSubcategory = (parentId: string) => {
    // Find the parent category to set its name in form
    const parentCategory = categories.find(cat => cat.id === parentId);
    
    // Reset form and set parent_id
    setCategoryForm({
      name: "",
      description: "",
      parent_id: parentId,
      subcategories: [],
    });
    
    // Show the form
    setShowAddCategory(true);
    setEditingCategory(null);
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Gallery Management Functions
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");

  const handleFileUpload = async (file: File) => {
    if (!file) return null;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("gallery-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(fileName);

      return publicData.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = galleryForm.image_url;
      let uploadedFilePath = null;

      // Handle file upload if file method is selected
      if (uploadMethod === "file") {
        const fileInput = document.getElementById(
          "gallery-file-input"
        ) as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          const uploadedUrl = await handleFileUpload(fileInput.files[0]);
          if (!uploadedUrl) return;
          imageUrl = uploadedUrl;
          uploadedFilePath = fileInput.files[0].name;
        }
      }

      const galleryData = {
        title: galleryForm.title,
        description: galleryForm.description,
        image_url: imageUrl,
        category: galleryForm.category || null,
        is_featured: galleryForm.is_featured,
      };

      if (editingGallery) {
        const { error } = await supabase
          .from("gallery")
          .update(galleryData)
          .eq("id", editingGallery.id);

        if (error) throw error;
        toast({ title: "Gallery image updated successfully" });
      } else {
        const { error } = await supabase.from("gallery").insert(galleryData);

        if (error) throw error;
        toast({ title: "Gallery image added successfully" });
      }

      resetGalleryForm();
      fetchGallery();
    } catch (error) {
      console.error("Error saving gallery image:", error);
      toast({
        title: "Error",
        description: "Failed to save gallery image",
        variant: "destructive",
      });
    }
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      title: "",
      description: "",
      image_url: "",
      category: "",
      is_featured: false,
    });
    setShowAddGallery(false);
    setEditingGallery(null);
    setUploadMethod("url");
    // Reset file input
    const fileInput = document.getElementById(
      "gallery-file-input"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const editGallery = (gallery: GalleryImage) => {
    setGalleryForm({
      title: gallery.title,
      description: gallery.description || "",
      image_url: gallery.image_url,
      category: gallery.category || "",
      is_featured: gallery.is_featured,
    });
    setEditingGallery(gallery);
    setShowAddGallery(true);
    setUploadMethod("url"); // Default to URL when editing
  };

  const deleteGallery = async (galleryId: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;

    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", galleryId);

      if (error) throw error;
      toast({ title: "Gallery image deleted successfully" });
      fetchGallery();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      toast({
        title: "Error",
        description: "Failed to delete gallery image",
        variant: "destructive",
      });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setProductUploadingFile(true);

      // Process color variants and upload files if needed
      const processedVariants = await Promise.all(
        productForm.color_variants.map(async (variant) => {
          const processedImages = await Promise.all(
            variant.images.map(async (img, imgIndex) => {
              // Check if this is a file to upload
              const fileInput = document.getElementById(
                `variant-image-${productForm.color_variants.indexOf(variant)}-${imgIndex}`
              ) as HTMLInputElement;
              
              if (fileInput?.files?.[0]) {
                const file = fileInput.files[0];
                const fileExt = file.name.split(".").pop();
                const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                  .from("product-images")
                  .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: publicData } = supabase.storage
                  .from("product-images")
                  .getPublicUrl(fileName);

                return publicData.publicUrl;
              }
              
              // Return the URL as is if it's not a file upload
              return img;
            })
          );

          return {
            color: variant.color,
            images: processedImages.filter(img => img && !img.startsWith('uploading:'))
          };
        })
      );

      // Get first image from first color variant as main image
      const firstVariantImage = processedVariants[0]?.images[0] || '';

      const productData = {
        name: productForm.name,
        base_price: parseFloat(productForm.price),
        description: productForm.description,
        category_id: productForm.category,
        image_url: firstVariantImage,
        is_featured: productForm.is_featured,
        color_variants: processedVariants.filter(v => v.color && v.images.length > 0),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData as any)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast({ title: "Product updated successfully" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData as any);

        if (error) throw error;
        toast({ title: "Product added successfully" });
      }

      resetProductForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setProductUploadingFile(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: "",
      description: "",
      category: "",
      image_url: "",
      stock: "",
      is_featured: false,
      colors: "",
      color_variants: [],
    });
    setShowAddProduct(false);
    setEditingProduct(null);
    setProductUploadMethod("url");
    // Reset file input
    const fileInput = document.getElementById(
      "product-file-input"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const editProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.base_price.toString(),
      description: product.description || "",
      category: product.category_id || "",
      image_url: product.image_url || "",
      stock: "0",
      is_featured: product.is_featured,
      colors: "",
      color_variants: product.color_variants || [],
    });
    setEditingProduct(product);
    setShowAddProduct(true);
    setProductUploadMethod("url");
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      toast({ title: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      toast({ title: `Order ${status} successfully` });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Product Management moved to separate component for stability and focus retention
  // Categories Management moved to separate component for stability and focus retention  
  // Gallery Management moved to separate component for stability and focus retention

  // Orders Management Component
  function OrdersManager() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">Orders Management</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Customer:{" "}
                      {order.profiles?.full_name || order.profiles?.email}
                    </p>
                    <p className="text-sm text-foreground/70">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{order.total}</p>
                    <Badge
                      className={
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  {Array.isArray(order.order_items) &&
                    order.order_items.map((item: any, index: number) => (
                      <div key={index} className="text-sm text-foreground/70">
                        {item.name} × {item.quantity} = ₹
                        {(
                          (item.base_price || item.price || 0) * item.quantity
                        ).toFixed(2)}
                      </div>
                    ))}
                </div>

                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(order.id, "processing")
                        }
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {order.status === "processing" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "delivered")}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Users Management Component
  function UsersManager() {
    const getUserOrderCount = (userId: string) => {
      return orders.filter((order) => order.user_id === userId).length;
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Users Management</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {users.length} Total Users
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Registered Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No users found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/30">
                    <tr>
                      <th className="text-left p-4 font-semibold">User ID</th>
                      <th className="text-left p-4 font-semibold">Email</th>
                      <th className="text-left p-4 font-semibold">Full Name</th>
                      <th className="text-left p-4 font-semibold">Phone</th>
                      <th className="text-left p-4 font-semibold">Role</th>
                      <th className="text-left p-4 font-semibold">Orders</th>
                      <th className="text-left p-4 font-semibold">Joined</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {user.id.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              title="Active User"
                            ></div>
                            <span className="font-medium">{user.email}</span>
                          </div>
                        </td>
                        <td className="p-4">{user.full_name || "-"}</td>
                        <td className="p-4">-</td>
                        <td className="p-4">
                          <Badge variant="secondary">
                            User
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-blue-50">
                            {getUserOrderCount(user.id)} orders
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              title="View Profile"
                            >
                              <Users className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              title="Make Admin"
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Customers
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((user) => getUserOrderCount(user.id) > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">Users with orders</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Contacts Management Component
  function ContactsManager() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Contact Leads</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {contacts.length} Total Leads
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No contacts submitted yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Phone</th>
                      <th className="text-left p-4">Message</th>
                      <th className="text-left p-4">Source</th>
                      <th className="text-left p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b last:border-b-0">
                        <td className="p-4 font-medium">{contact.name}</td>
                        <td className="p-4">
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-primary hover:underline"
                          >
                            {contact.email}
                          </a>
                        </td>
                        <td className="p-4">
                          {contact.phone ? (
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-primary hover:underline"
                            >
                              {contact.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {contact.message ? (
                            <div
                              className="max-w-xs truncate"
                              title={contact.message}
                            >
                              {contact.message}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{contact.source}</Badge>
                        </td>
                        <td className="p-4">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Settings Management Component
  function SettingsManager() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <Input value="Neem Furnitech" disabled />
            </div>
            <div>
              <Label>Admin Email</Label>
              <Input value={user?.email} disabled />
            </div>
            <div>
              <Label>Store Status</Label>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-elegant">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          {/* Admin Header */}
          <header className="bg-card border-b shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-bold text-primary">
                    Neem Furnitech Admin
                  </h1>
                  <p className="text-sm text-foreground/70">
                    Welcome back, {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route
                path="products"
                element={
                  <ProductsManagerComponent
                    showAddProduct={showAddProduct}
                    setShowAddProduct={setShowAddProduct}
                    editingProduct={editingProduct}
                    productForm={productForm}
                    setProductForm={setProductForm}
                    productUploadMethod={productUploadMethod}
                    setProductUploadMethod={setProductUploadMethod}
                    productUploadingFile={productUploadingFile}
                    categories={categories}
                    products={products}
                    handleProductSubmit={handleProductSubmit}
                    resetProductForm={resetProductForm}
                    editProduct={editProduct}
                    deleteProduct={deleteProduct}
                  />
                }
              />
              <Route path="categories" element={
                <CategoriesManagerComponent
                  showAddCategory={showAddCategory}
                  setShowAddCategory={setShowAddCategory}
                  editingCategory={editingCategory}
                  categoryForm={categoryForm}
                  setCategoryForm={setCategoryForm}
                  categories={categories}
                  handleCategorySubmit={handleCategorySubmit}
                  resetCategoryForm={resetCategoryForm}
                  editCategory={editCategory}
                  deleteCategory={deleteCategory}
                  onAddSubcategory={handleAddSubcategory}
                />
              } />
              <Route path="gallery" element={
                <GalleryManagerComponent
                  showAddGallery={showAddGallery}
                  setShowAddGallery={setShowAddGallery}
                  editingGallery={editingGallery}
                  galleryForm={galleryForm}
                  setGalleryForm={setGalleryForm}
                  uploadMethod={uploadMethod}
                  setUploadMethod={setUploadMethod}
                  uploadingFile={uploadingFile}
                  galleryImages={galleryImages}
                  handleGallerySubmit={handleGallerySubmit}
                  resetGalleryForm={resetGalleryForm}
                  editGallery={editGallery}
                  deleteGallery={deleteGallery}
                />
              } />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="contacts" element={<ContactsManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
