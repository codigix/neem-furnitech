import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Check, Award, Zap, Shield, Truck, Users, Clock, Leaf, Hammer, Handshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-chair.jpg";
import banner1 from "@/assets/banner1.jpeg";
import banner2 from "@/assets/banner2.jpeg";
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

interface User {
  id: string;
  email?: string;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email });
        fetchFavorites(authUser.id);
      }
    });

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
      
      const mappedProducts: Product[] = (data || []).map((product: Product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        image_url: product.image_url,
        images: product.images || [],
        category_id: product.category_id,
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

  const plugin = [
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
    }),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner Carousel */}
      <Carousel
        opts={{
          align: "center",
          loop: false,
        }}
        plugins={plugin as any}
        className="w-full"
        
      >
        <CarouselContent className="m-0">
          {/* Slide 1 - Premium Quality Furniture */}
          <CarouselItem className="pl-0">
            <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              
              <div className="relative z-10 text-center text-white space-y-6 px-4 max-w-4xl">
                <div className="inline-block px-5 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full">
                  <p className="text-sm font-semibold text-white">✨ Premium Office Furniture</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Excellence in Every Detail
                </h1>
                <p className="text-sm md:text-base text-white/95 max-w-2xl mx-auto">
                  Crafted for comfort. Designed for success. Built to last.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <Button size="lg" asChild className="bg-primary-gold hover:bg-primary-gold/90 text-white  hover:shadow-xl transition-all px-8 py-6 text-base font-semibold rounded-lg">
                    <Link to="/products" className="flex items-center gap-2">
                      Explore Collection
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-white/15 border border-white text-white hover:bg-white hover:text-primary transition-all px-8 py-6 text-base font-semibold backdrop-blur-sm rounded-lg">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Slide 2 - Certified & Trusted */}
          <CarouselItem className="pl-0">
            <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner1})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              
              <div className="relative z-10 text-center text-white space-y-6 px-4 max-w-4xl">
                <div className="inline-block px-5 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full">
                  <p className="text-sm font-semibold text-white">🏆 Industry Certified</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  18+ Years of Trust
                </h1>
                <p className="text-sm md:text-base text-white/95 max-w-2xl mx-auto">
                  GST Registered • IEC Certified • International Standards
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <Button size="lg" asChild className="bg-primary-gold hover:bg-primary-gold/90 text-white  hover:shadow-xl transition-all px-8 py-6 text-base font-semibold rounded-lg">
                    <Link to="/products" className="flex items-center gap-2">
                      View Products
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-white/15 border border-white text-white hover:bg-white hover:text-primary transition-all px-8 py-6 text-base font-semibold backdrop-blur-sm rounded-lg">
                    <a href="tel:+918047643560">📞 Call Now</a>
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Slide 3 - Quick Response */}
          <CarouselItem className="pl-0">
            <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner2})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              
              <div className="relative z-10 text-center text-white space-y-6 px-4 max-w-4xl">
                <div className="inline-block px-5 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full">
                  <p className="text-sm font-semibold text-white">⚡ Instant Support</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Quotes in Minutes
                </h1>
                <p className="text-sm md:text-base text-white/95 max-w-2xl mx-auto">
                  85% Call Response Rate • Expert Guidance • Tailored Solutions
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <Button size="lg" asChild className="bg-white text-primary-gold hover:bg-white/90  hover:shadow-xl transition-all px-8 py-6 text-base font-semibold rounded-lg">
                    <a href="tel:+918047643560" className="flex items-center gap-2">
                      📞 +91-8047643560
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-white/15 border border-white text-white hover:bg-white hover:text-primary-gold transition-all px-8 py-6 text-base font-semibold backdrop-blur-sm rounded-lg">
                    <Link to="/products">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex bg-white/20 hover:bg-white/40 border-white/40 text-white rounded-full" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex bg-white/20 hover:bg-white/40 border-white/40 text-white rounded-full" />
      </Carousel>

      {/* Why Choose Neem Furnitech - Professional Section */}
      <section className="py-24 bg-gradient-to-b from-white via-primary/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(107,63,160,0.05),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(110,200,77,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
              Why Choose Neem Furnitech?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We combine decades of manufacturing expertise with commitment to quality, ensuring every piece meets the highest standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: "18+ Years Experience",
                description: "Established in 2006, we've built a legacy of trust and excellence in furniture manufacturing.",
                color: "from-primary to-primary/60"
              },
              {
                icon: Shield,
                title: "Certified Quality",
                description: "GST registered, IEC certified, and compliant with international quality standards.",
                color: "from-primary-gold to-primary-gold/60"
              },
              {
                icon: Zap,
                title: "Instant Quotes",
                description: "Get competitive pricing instantly with 85% call response rate. Quick turnaround guaranteed.",
                color: "from-primary to-primary/60"
              },
              {
                icon: Truck,
                title: "Wide Selection",
                description: "Executive, office, conference, and waiting chairs for every requirement and budget.",
                color: "from-primary-gold to-primary-gold/60"
              },
              {
                icon: Hammer,
                title: "Expert Repair Service",
                description: "Professional maintenance and repair services to extend furniture lifespan and performance.",
                color: "from-primary to-primary/60"
              },
              {
                icon: Handshake,
                title: "Customer Focused",
                description: "Personalized service under Mr. Mahendra Parmar's supervision ensuring quality at every level.",
                color: "from-primary-gold to-primary-gold/60"
              }
            ].map((item, idx) => (
              <Card key={idx} className="border border-primary/10 bg-gradient-to-br from-white to-primary/5 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-5 space-y-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center `}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${heroImage})`, backgroundAttachment: 'fixed' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8  mx-auto">
            {[
              { label: "Years of Service", value: "18+" },
              { label: "Business Type", value: "Manufacturer" },
              { label: "Turnover", value: "₹1.5-5Cr" },
              { label: "Response Rate", value: "85%" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                <p className="text-white/90 text-xs md:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
              Our Product Range
            </h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive solutions for modern office environments with focus on comfort, durability, and professional design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {[
              { title: "Executive Chairs", desc: "Premium comfort chairs designed for leadership spaces" },
              { title: "Office Chairs", desc: "Ergonomic seating for enhanced productivity" },
              { title: "Conference Chairs", desc: "Professional seating for meeting rooms" }
            ].map((prod, idx) => (
              <Card key={idx} className="border border-primary/10 bg-gradient-to-br from-primary/5 to-white hover:shadow-elegant transition-all">
                <CardContent className="p-5 text-center space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold">{prod.title}</h3>
                  <p className="text-xs text-muted-foreground">{prod.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base font-semibold rounded-lg  hover:shadow-xl transition-all">
              <Link to="/products" className="flex items-center gap-2">
                View Complete Catalog
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                Featured Products
              </h2>
              <p className="text-sm text-muted-foreground">
                Our most popular selections, chosen by customers for their exceptional quality and design.
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
              <Button size="lg" variant="outline" asChild className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-base font-semibold rounded-lg transition-all">
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
      <section className="py-24 bg-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${heroImage})`, backgroundAttachment: 'fixed' }}></div>
        </div>
        <div className="container mx-auto max-w-3xl text-center space-y-8 px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Ready to Transform Your Office?
          </h2>
          <p className="text-sm md:text-base text-white/95 leading-relaxed">
            Contact our team today for personalized consultations, competitive quotes, and professional furniture solutions tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90  hover:shadow-xl transition-all px-8 py-6 text-base font-semibold rounded-lg">
              <a href="tel:+918047643560" className="flex items-center gap-2">
                📞 Call: +91-8047643560
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className=" border-white bg-primary text-white hover:bg-white hover:text-primary transition-all px-8 py-6 text-base font-semibold rounded-lg">
              <Link to="/products" className="flex items-center gap-2">
                Shop Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 pt-4">
            Response Rate: <span className="font-bold text-primary-gold">85%</span> • Available during business hours
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
