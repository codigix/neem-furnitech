import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  is_featured: boolean;
  color_variants?: ColorVariant[];
}

interface ProductCardProps {
  product: Product;
  userId?: string;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

const ProductCard = ({ product, userId, isFavorite = false, onFavoriteChange }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { toast } = useToast();

  useState(() => {
    if (product.color_variants && product.color_variants.length > 0) {
      setSelectedColor(product.color_variants[0].color);
    }
  });

  const getDisplayImages = () => {
    if (product.color_variants && product.color_variants.length > 0) {
      const selectedVariant = product.color_variants.find(v => v.color === selectedColor) || product.color_variants[0];
      return selectedVariant.images.filter(img => img);
    }
    return [
      ...(product.images && product.images.length > 0 ? product.images : []),
      ...(product.image_url ? [product.image_url] : [])
    ].filter((img, index, arr) => img && arr.indexOf(img) === index);
  };

  const allImages = getDisplayImages();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const colorToAdd = selectedColor || (product.color_variants?.[0]?.color || '');
      
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .eq('selected_color', colorToAdd)
        .single();

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: product.id,
            quantity: 1,
            selected_color: colorToAdd
          });
      }

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to save favorites",
        variant: "destructive",
      });
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', product.id);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            product_id: product.id
          });
      }

      if (onFavoriteChange) {
        onFavoriteChange();
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

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden border border-border hover:border-primary-gold/50 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {allImages.length > 1 ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {allImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </Carousel>
          ) : (
            <img
              src={allImages[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
            />
          </Button>
          
          {/* Featured Badge */}
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary-gold text-primary-gold-foreground">
              Featured
            </Badge>
          )}
        </div>
        
        <CardContent className="p-3 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {product.color_variants && product.color_variants.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {product.color_variants.map((variant) => (
                <button
                  key={variant.color}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(variant.color);
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    selectedColor === variant.color
                      ? 'border-primary-gold bg-primary-gold/10 text-primary-gold'
                      : 'border-border text-muted-foreground hover:border-primary-gold/50'
                  }`}
                  title={variant.color}
                >
                  {variant.color}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-primary-gold">
              ₹{product.base_price.toFixed(2)}
            </span>
            
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              size="sm"
              className="gap-1.5"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;