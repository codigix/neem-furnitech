import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Truck, Users, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-chair.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  images?: string[];
  category_id: string | null;
  is_featured: boolean;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Get user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchFavorites(user.id);
      }
    });

    // Fetch featured products
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(6);

      if (error) throw error;
      
      const mappedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        base_price: (product as any).base_price,
        image_url: product.image_url,
        images: (product as any).images || [],
        category_id: (product as any).category_id,
        is_featured: product.is_featured
      }));
      
      setFeaturedProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
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

  const handleFavoriteChange = () => {
    if (user) {
      fetchFavorites(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-card">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white space-y-6 px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Comfort Meets Style
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto">
            Discover our curated collection of premium furniture designed to transform your living spaces into havens of elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-primary-gold hover:bg-primary-gold/90 text-white">
              <Link to="/products" className="flex items-center gap-2">
                Shop Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Premium Quality */}
            <Card className="border border-border bg-card hover:shadow-card transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-gold/10">
                  <Award className="h-6 w-6 text-primary-gold" />
                </div>
                <h3 className="text-lg font-semibold">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Handcrafted with the finest materials and meticulous attention to detail.
                </p>
              </CardContent>
            </Card>

            {/* Free Shipping */}
            <Card className="border border-border bg-card hover:shadow-card transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-gold/10">
                  <Truck className="h-6 w-6 text-primary-gold" />
                </div>
                <h3 className="text-lg font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  On all orders over ₹5000. Fast and reliable delivery to your doorstep.
                </p>
              </CardContent>
            </Card>

            {/* Expert Support */}
            <Card className="border border-border bg-card hover:shadow-card transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-gold/10">
                  <Users className="h-6 w-6 text-primary-gold" />
                </div>
                <h3 className="text-lg font-semibold">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our dedicated team is here to help with any questions or concerns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-card">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our most popular pieces, carefully selected for their exceptional design and comfort.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userId={user?.id}
                  isFavorite={favorites.includes(product.id)}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link to="/products" className="flex items-center gap-2">
                  View All Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-4xl font-bold">Experience Comfort</h2>
          <p className="text-lg text-muted-foreground">
            Every piece in our collection is designed with your comfort and satisfaction in mind. 
            We're committed to delivering furniture that brings joy to your everyday life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/products">Browse Collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;