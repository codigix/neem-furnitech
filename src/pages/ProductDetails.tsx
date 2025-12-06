import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Heart, ShoppingCart, Star, ArrowLeft, Plus, Minus, X, ZoomIn, ZoomOut } from "lucide-react";
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
  is_featured: boolean;
  colors?: string[];
  color_variants?: ColorVariant[];
  specifications?: Record<string, string>;
  features?: string[];
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

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

  useEffect(() => {
    if (product && product.color_variants && product.color_variants.length > 0 && selectedColor === "") {
      const firstColor = product.color_variants[0].color;
      setSelectedColor(firstColor);
    }
  }, [product, selectedColor]);

  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.on("select", () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  useEffect(() => {
    if (product) {
      let images: string[] = [];
      
      const isValidImageUrl = (img: any): boolean => {
        return typeof img === 'string' && img.trim().length > 0;
      };
      
      if (product.color_variants && product.color_variants.length > 0) {
        const selectedVariant = product.color_variants.find(v => v.color === selectedColor);
        if (selectedVariant && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0) {
          images = selectedVariant.images.filter(isValidImageUrl);
        }
      }
      
      if (images.length === 0) {
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          images.push(...product.images.filter(isValidImageUrl));
        }
        
        if (images.length === 0 && isValidImageUrl(product.image_url)) {
          images.push(product.image_url);
        }
      }
      
      const uniqueImages = images.filter((img, index, arr) => isValidImageUrl(img) && arr.indexOf(img) === index);
      setDisplayImages(uniqueImages);
      console.log(`Product: ${product.name} | Total Images: ${uniqueImages.length}`);
      if (uniqueImages.length > 0) {
        console.log('Display Images:', uniqueImages);
      }
    }
  }, [product, selectedColor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setLightboxImageIndex((prev) => (prev + 1) % displayImages.length);
          setZoomLevel(1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setLightboxImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
          setZoomLevel(1);
          break;
        case 'Escape':
          setIsLightboxOpen(false);
          setZoomLevel(1);
          break;
        default:
          break;
      }
    };

    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLightboxOpen, displayImages.length]);

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

      console.log('Raw product data from DB:', data);
      
      // Map the data to our expected interface
      const productData: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        base_price: (data as any).base_price,
        image_url: data.image_url,
        images: (data as any).images || [],
        category_id: (data as any).category_id,
        is_featured: data.is_featured,
        colors: (data as any).colors || [],
        color_variants: (data as any).color_variants || [],
        specifications: (data as any).specifications || {},
        features: (data as any).features || []
      };

      console.log('Mapped product data:', productData);
      setProduct(productData);
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

    setIsAddingToCart(true);
    try {
      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
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
            selected_color: null
          });
      }

      toast({
        title: "Added to cart!",
        description: `${quantity} x ${product.name} has been added to your cart.`,
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
    setQuantity(quantity + 1);
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
          {/* Product Images with Thumbnails */}
          <div className="space-y-4">
            {/* Main Image Carousel */}
            <Card className="overflow-hidden bg-slate-50 relative group">
              <div 
                className="cursor-zoom-in relative"
                onClick={() => {
                  setIsLightboxOpen(true);
                  setLightboxImageIndex(selectedImageIndex);
                }}
              >
                <Carousel setApi={setCarouselApi} className="w-full">
                  <CarouselContent>
                    {displayImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square relative bg-white">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {product.is_featured && index === 0 && (
                            <Badge className="absolute top-4 left-4 bg-amber-500 text-white z-10">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {displayImages.length > 0 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
                
                {displayImages.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <ZoomIn className="h-4 w-4" />
                    Click to zoom
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {displayImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      carouselApi?.scrollTo(index);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-3 transition-all duration-300 hover:shadow-md transform hover:scale-105 ${
                      selectedImageIndex === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Specifications */}
          <div className="space-y-5">
            <div>
              {product.specifications?.brand && (
                <Badge variant="secondary" className="capitalize">
                  {product.specifications.brand}
                </Badge>
              )}
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                ₹{product.base_price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">/ Piece</span>
            </div>

            {/* Specifications Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      value && (
                        <div key={key} className="grid grid-cols-2 gap-2 p-2">
                          <div className="font-medium text-xs text-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-muted-foreground">{value}</div>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  toast({
                    title: "Quote Request",
                    description: "Please contact us via WhatsApp or email for a quote.",
                  });
                }}
              >
                Get Best Quote
              </Button>
              
              <Button
                size="lg"
                className="w-full bg-destructive hover:bg-destructive/90"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Please login",
                      description: "You need to be logged in to express interest",
                      variant: "destructive",
                    });
                    return;
                  }
                  toast({
                    title: "Interest Noted!",
                    description: "We'll contact you shortly about this product.",
                  });
                }}
              >
                <span className="mr-2">✉</span>
                Yes! I am interested
              </Button>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1"
                  variant="secondary"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                
                <Button
                  variant="outline"
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

        {/* Lightbox Modal */}
        {isLightboxOpen && displayImages.length > 0 && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsLightboxOpen(false);
              setZoomLevel(1);
            }}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
                setZoomLevel(1);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Main Image Container */}
            <div 
              className="relative max-w-4xl max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-auto">
                <img
                  src={displayImages[lightboxImageIndex] || "/placeholder.svg"}
                  alt={`${product.name} - Full view ${lightboxImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/50 px-4 py-2 rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(Math.max(1, zoomLevel - 0.2));
                  }}
                  className="text-white hover:text-gray-300 transition-colors"
                  title="Zoom Out (or use scroll)"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-white text-sm min-w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(Math.min(3, zoomLevel + 0.2));
                  }}
                  className="text-white hover:text-gray-300 transition-colors"
                  title="Zoom In (or use scroll)"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              {displayImages.length > 0 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
                      setZoomLevel(1);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                    title="Previous (or use arrow keys)"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImageIndex((prev) => (prev + 1) % displayImages.length);
                      setZoomLevel(1);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                    title="Next (or use arrow keys)"
                  >
                    <ArrowLeft className="h-6 w-6 rotate-180" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-lg text-sm">
                {lightboxImageIndex + 1} / {displayImages.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImageIndex(index);
                      setZoomLevel(1);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === lightboxImageIndex
                        ? 'border-white shadow-lg'
                        : 'border-gray-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Hints */}
            <div className="absolute bottom-4 right-4 text-white/60 text-xs space-y-1">
              <p>Arrow Keys: Navigate</p>
              <p>Esc: Close</p>
              <p>Scroll: Zoom</p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;