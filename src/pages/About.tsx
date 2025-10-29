import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Leaf, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            For over three decades, ChairCraft has been at the forefront of furniture design, 
            creating pieces that seamlessly blend comfort, functionality, and timeless elegance.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Founded on Passion</h2>
            <p className="text-lg text-muted-foreground mb-4">
              ChairCraft began in 1985 when master craftsman Robert Chen opened a small workshop 
              with a simple vision: to create furniture that would be treasured for generations. 
              What started as a one-man operation has grown into a respected brand known worldwide 
              for exceptional quality and innovative design.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Every piece we create reflects our commitment to excellence. From the initial sketch 
              to the final finish, our artisans pour their expertise and passion into each chair, 
              ensuring that every customer receives not just furniture, but a work of art.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we continue to honor traditional craftsmanship while embracing modern techniques 
              and sustainable practices, creating furniture that's as responsible as it is beautiful.
            </p>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Craftsman working on furniture"
              className="w-full h-96 object-cover rounded-lg shadow-elegant"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-primary-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every piece meets our rigorous standards for durability and design.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We support local artisans and sustainable practices, fostering a community of skilled craftspeople.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <Leaf className="h-12 w-12 text-primary-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-muted-foreground">
                  Responsibly sourced materials and eco-friendly processes are at the heart of our production.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-primary-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Passion</h3>
                <p className="text-muted-foreground">
                  Every chair is crafted with love and attention to detail that you can feel in every curve and joint.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-gradient-card rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Craft Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Design & Planning</h3>
              <p className="text-muted-foreground">
                Our designers create detailed blueprints, considering both aesthetics and ergonomics to ensure perfect balance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Material Selection</h3>
              <p className="text-muted-foreground">
                We carefully select premium hardwoods and sustainable materials, ensuring each piece will last for generations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Handcrafting</h3>
              <p className="text-muted-foreground">
                Master craftspeople shape, join, and finish each piece by hand, adding the human touch that makes each chair unique.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Our team of dedicated artisans, designers, and customer service professionals work together 
            to bring you furniture that exceeds expectations. From our workshop to your home, 
            every ChairCraft piece carries the mark of true craftsmanship.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <img
                  src="/placeholder.svg"
                  alt="Robert Chen"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Robert Chen</h3>
                <p className="text-primary-gold font-medium mb-2">Founder & Master Craftsman</p>
                <p className="text-muted-foreground text-sm">
                  With over 40 years of experience, Robert continues to oversee every aspect of our production.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <img
                  src="/placeholder.svg"
                  alt="Sarah Mitchell"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Sarah Mitchell</h3>
                <p className="text-primary-gold font-medium mb-2">Head of Design</p>
                <p className="text-muted-foreground text-sm">
                  Sarah leads our design team, creating innovative pieces that balance form and function perfectly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <img
                  src="/placeholder.svg"
                  alt="Michael Torres"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Michael Torres</h3>
                <p className="text-primary-gold font-medium mb-2">Quality Assurance Director</p>
                <p className="text-muted-foreground text-sm">
                  Michael ensures every piece meets our exacting standards before reaching our customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;