import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
}

interface GalleryCategory {
  id: string;
  name: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [galleryResult, categoriesResult] = await Promise.all([
        supabase
          .from('gallery')
          .select('id, title, image_url, category')
          .order('created_at', { ascending: false }),
        supabase
          .from('gallery_categories')
          .select('id, name')
          .order('created_at', { ascending: true })
      ]);

      if (galleryResult.error) throw galleryResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setImages(galleryResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Gallery</h1>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto">
            Explore our collection of celebration moments and furniture inspirations
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start mb-8 flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.name}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-foreground/70">No images found in this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;