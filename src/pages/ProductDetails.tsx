import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, ShoppingCart, Star, ArrowLeft, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ColorVariant {
  color: string;
  images: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  images?: string[];
  category_id: string | null;
  stock: number;
  is_featured: boolean;
  colors?: string[];
  color_variants?: ColorVariant[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user && id) {
        checkIfFavorite(user.id, id);
      }
    };
    getUser();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      // Map the data to our expected interface
      const productData: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        base_price: (data as any).base_price,
        image_url: data.image_url,
        images: (data as any).images || [],
        category_id: (data as any).category_id,
        stock: 0,
        is_featured: data.is_featured,
        colors: (data as any).colors || [],
        color_variants: (data as any).color_variants || []
      };

      setProduct(productData);
      // Set default color to first available color variant
      if (productData.color_variants && productData.color_variants.length > 0) {
        setSelectedColor(productData.color_variants[0].color);
      } else if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (userId: string, productId: string) => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
      setIsFavorite(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    if (!selectedColor) {
      toast({
        title: "Please select a color",
        description: "Choose a color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      // Check if item with same color already in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('selected_color', selectedColor)
        .single();

      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
      } else {
        // Add new item
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: quantity,
            selected_color: selectedColor
          });
      }

      toast({
        title: "Added to cart!",
        description: `${quantity} x ${product.name} (${selectedColor}) has been added to your cart.`,
      });
      
      // Reset quantity after adding to cart
      setQuantity(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to save favorites",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id
          });
        setIsFavorite(true);
      }

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${product.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Carousel */}
          <div className="relative">
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                {(() => {
                  // Get images for selected color variant
                  let displayImages: string[] = [];
                  
                  if (product.color_variants && product.color_variants.length > 0) {
                    const selectedVariant = product.color_variants.find(v => v.color === selectedColor);
                    if (selectedVariant && selectedVariant.images.length > 0) {
                      displayImages = selectedVariant.images.filter(img => img);
                    }
                  }
                  
                  // Fallback to general images if no color variant images
                  if (displayImages.length === 0) {
                    displayImages = [
                      ...(product.images && product.images.length > 0 ? product.images : []),
                      ...(product.image_url ? [product.image_url] : [])
                    ].filter((img, index, arr) => img && arr.indexOf(img) === index);
                  }

                  return displayImages.length > 1 ? (
                    <Carousel className="w-full h-full">
                      <CarouselContent>
                        {displayImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${product.name} - ${selectedColor} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
                      
                      {/* Image indicator dots */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {displayImages.map((_, index) => (
                          <div 
                            key={index} 
                            className="w-2 h-2 bg-white/50 rounded-full"
                          />
                        ))}
                      </div>
                    </Carousel>
                  ) : (
                    <img
                      src={displayImages[0] || "/placeholder.svg"}
                      alt={`${product.name} - ${selectedColor}`}
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
                
                {/* Featured Badge */}
                {product.is_featured && (
                  <Badge className="absolute top-4 left-4 bg-gradient-gold text-primary-gold-foreground z-10">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                
                {/* Stock Badge */}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="absolute bottom-4 left-4 z-10">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <Badge variant="secondary" className="capitalize">
                Category
              </Badge>
            </div>

            <div className="text-4xl font-bold text-primary">
              ₹{product.base_price.toFixed(2)}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Stock Available</h3>
              <p className="text-muted-foreground">
                {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
              </p>
            </div>

            {/* Color Selector */}
            {product.color_variants && product.color_variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.color_variants.map((variant) => (
                    <button
                      key={variant.color}
                      onClick={() => setSelectedColor(variant.color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === variant.color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;