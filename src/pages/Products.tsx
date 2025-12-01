import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  images?: string[];
  category_id: string | null;
  is_featured: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  subcategories?: Category[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchFavorites(user.id);
      }
    });

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, selectedSubcategory, sortBy]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setSubcategories([]);
      setSelectedSubcategory("all");
    } else {
      const category = categories.find(cat => cat.name === selectedCategory);
      if (category) {
        const subs = categories.filter(cat => cat.parent_id === category.id);
        setSubcategories(subs);
        setSelectedSubcategory("all");
      }
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        base_price: (product as any).base_price,
        image_url: product.image_url,
        images: (product as any).images || [],
        category_id: (product as any).category_id,
        is_featured: product.is_featured,
        created_at: product.created_at
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);

      if (error) throw error;
      setFavorites(data?.map(fav => fav.product_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      const category = categories.find(cat => cat.name === selectedCategory);
      if (category) {
        if (selectedSubcategory === "all") {
          // Show all products from this parent category and its subcategories
          const subcategoryIds = categories
            .filter(cat => cat.parent_id === category.id)
            .map(cat => cat.id);
          
          filtered = filtered.filter(product => 
            product.category_id === category.id || 
            subcategoryIds.includes(product.category_id || '')
          );
        } else {
          // Show only products from the selected subcategory
          const subcategory = categories.find(cat => cat.name === selectedSubcategory);
          if (subcategory) {
            filtered = filtered.filter(product => product.category_id === subcategory.id);
          }
        }
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.base_price - b.base_price;
        case "price-high":
          return b.base_price - a.base_price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleFavoriteChange = () => {
    if (user) {
      fetchFavorites(user.id);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedSubcategory !== "all" || sortBy !== "newest";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Products...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Our Collection</h1>
          <p className="text-sm text-muted-foreground">
            Explore our carefully curated selection of premium furniture.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories
                    .filter(cat => !cat.parent_id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Subcategory Filter */}
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === "all" || subcategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.name}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                userId={user?.id}
                isFavorite={favorites.includes(product.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-base font-semibold mb-2">No products found</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Try adjusting your search or filters.
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;