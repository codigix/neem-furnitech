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
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block px-6 py-2 bg-primary-gold/20 backdrop-blur-sm border border-primary-gold/30 rounded-full mb-6">
            <p className="text-sm font-medium text-primary-gold">Established 2006</p>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-primary via-primary-gold to-primary bg-clip-text text-transparent">
              About Neem Furnitech
            </span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Leading manufacturer of premium office furniture since 2006. We specialize in Executive Chairs, 
            Office Chairs, Conference Chairs, Waiting Chairs, and provide professional chair repairing services.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="px-6 py-3 bg-primary-gold/10 rounded-lg border border-primary-gold/20">
              <p className="text-sm text-muted-foreground">Annual Turnover</p>
              <p className="text-xl font-bold text-primary-gold">₹1.5 - 5 Cr</p>
            </div>
            <div className="px-6 py-3 bg-primary-gold/10 rounded-lg border border-primary-gold/20">
              <p className="text-sm text-muted-foreground">Years in Business</p>
              <p className="text-xl font-bold text-primary-gold">18+ Years</p>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="bg-gradient-to-br from-primary-gold/5 via-background to-primary-gold/5 rounded-3xl p-10 md:p-16 mb-20 shadow-2xl border-2 border-primary-gold/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-primary-gold/60 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-primary">Company Overview</h2>
              </div>
              <div className="space-y-4 text-lg">
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">Nature of Business:</span>
                    <span className="text-primary-gold font-bold">Manufacturer</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">Established:</span>
                    <span className="text-primary-gold font-bold">2006</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">GST Registration:</span>
                    <span className="text-primary-gold font-bold">01-07-2017</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">Legal Status:</span>
                    <span className="text-primary-gold font-bold">Proprietorship</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">Annual Turnover:</span>
                    <span className="text-primary-gold font-bold">₹1.5 - 5 Cr</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">GST No.:</span>
                    <span className="text-primary-gold font-bold text-sm">27BCXPP0126J1Z6</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-6">
                    <span className="font-semibold">IEC:</span>
                    <span className="text-primary-gold font-bold">BCXPP0126J</span>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-primary-gold/60 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-primary">Our Mission</h2>
              </div>
              <Card className="border-2 border-primary-gold/30 bg-gradient-to-br from-card to-primary-gold/5 p-8 space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We <span className="text-primary-gold font-bold">"Neem Furnitech"</span> are the leading manufacturer of a wide range of Executive Chair, 
                  Office Chair, Conference Chair, Waiting Chair, and more. Our commitment is to provide 
                  high-quality office furniture that meets global standards.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We also provide <span className="text-primary-gold font-semibold">Office Chair Repairing Service</span>, ensuring your furniture investments last longer. 
                  Our connection with renowned vendors helps us maintain the highest quality standards in every product.
                </p>
                <div className="bg-primary-gold/10 border-2 border-primary-gold/30 rounded-xl p-6 mt-6">
                  <p className="text-lg font-semibold text-center">
                    Under the supervision of <span className="text-primary-gold text-xl">"Mr. Mahendra Parmar"</span>, we have attained a dynamic position in this sector.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Our Strengths Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience excellence backed by quality, expertise, and dedication
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-2xl hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-3 group">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Quality Products</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connected with renowned vendors ensuring products meet global standards for durability and design.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-2xl hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-3 group">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Expert Leadership</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Under the supervision of Mr. Mahendra Parmar, achieving excellence in the furniture sector.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-2xl hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-3 group">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Wide Range</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive product line including executive, office, conference, and waiting chairs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-2xl hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-3 group">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Repair Services</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Professional office chair repairing service to extend the life of your furniture investments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Categories Section */}
        <div className="bg-gradient-to-br from-primary-gold/10 via-primary-gold/5 to-background rounded-3xl p-12 md:p-16 mb-20 shadow-2xl border-2 border-primary-gold/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">
                Our Product Range
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive furniture solutions for every commercial space
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-gold via-primary-gold/80 to-primary-gold/60 rounded-3xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">Executive & Office Chairs</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Premium executive chairs with high back support, SS legs, and ergonomic designs for maximum comfort and productivity.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-gold via-primary-gold/80 to-primary-gold/60 rounded-3xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">Conference & Waiting Chairs</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Stylish conference seating and comfortable waiting chairs in various configurations to suit any space.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-gold via-primary-gold/80 to-primary-gold/60 rounded-3xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">Specialized Furniture</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Bar stools, restaurant chairs, folding tables, and revolving chairs for diverse commercial applications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="text-center">
          <div className="mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">
              Leadership
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Under the expert supervision of Mr. Mahendra Parmar, Neem Furnitech has achieved a dynamic 
              position in the furniture manufacturing sector, consistently delivering quality products 
              that meet global standards.
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-primary-gold/5 via-card to-primary-gold/5 border-2 border-primary-gold/30 max-w-2xl mx-auto shadow-2xl hover:shadow-glow transition-all duration-300">
            <CardContent className="p-12 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-primary-gold to-primary-gold/60 flex items-center justify-center shadow-2xl">
                <Users className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-3">Mahendra Parmar</h3>
              <div className="inline-block px-6 py-2 bg-primary-gold/20 backdrop-blur-sm border border-primary-gold/30 rounded-full mb-6">
                <p className="text-primary-gold font-bold">Proprietor</p>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Leading Neem Furnitech since its establishment in 2006, Mr. Parmar's vision and expertise 
                have positioned the company as a trusted name in office furniture manufacturing across India.
              </p>
            </CardContent>
          </Card>

          <div className="mt-16 p-10 bg-gradient-to-br from-primary-gold/10 to-primary/5 rounded-3xl border-2 border-primary-gold/30 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">Contact Us</h3>
            <div className="space-y-6 text-left">
              <Card className="border-2 border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-lg">
                    <span className="font-semibold text-primary-gold">Address:</span>
                    <span className="ml-3 text-muted-foreground">Plot No. Pap/j-4, Indrayani Nagar, Pune - 411026, Maharashtra, India</span>
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-primary-gold text-lg">Phone:</span>
                    <a href="tel:+918047643560" className="ml-3 text-2xl font-bold text-primary hover:text-primary-gold transition-colors">
                      +91-8047643560
                    </a>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Call Response Rate</p>
                    <p className="text-2xl font-bold text-primary-gold">85%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;