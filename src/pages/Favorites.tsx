import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FavoriteItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    base_price: number;
    image_url: string;
    description: string;
    is_active: boolean;
  };
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    fetchFavorites(session.user.id);
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (
            id,
            name,
            base_price,
            image_url,
            description,
            is_active
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Map the data to ensure correct typing
      const mappedFavorites: FavoriteItem[] = (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        products: {
          id: (item.products as any).id,
          name: (item.products as any).name,
          base_price: (item.products as any).base_price,
          image_url: (item.products as any).image_url,
          description: (item.products as any).description,
          is_active: (item.products as any).is_active
        }
      }));
      
      setFavorites(mappedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      
      setFavorites(items => items.filter(item => item.id !== favoriteId));
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) return;
    
    try {
      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1
          });

        if (error) throw error;
      }

      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading favorites...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">My Favorites</h1>
          <p className="text-foreground/70">{favorites.length} items in your favorites</p>
        </div>

        {favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-4">No favorites yet</h2>
              <p className="text-foreground/70 mb-6">Start adding your favorite furniture pieces!</p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.products.image_url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
                      onClick={() => navigate(`/product/${item.products.id}`)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFavorite(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-lg mb-2 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/product/${item.products.id}`)}
                    >
                      {item.products.name}
                    </h3>
                    <p className="text-foreground/70 mb-3 line-clamp-2">
                      {item.products.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-xl">
                        ₹{item.products.base_price}
                      </span>
                      <Button
                        onClick={() => addToCart(item.products.id)}
                        disabled={!item.products.is_active}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {!item.products.is_active ? 'Unavailable' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;