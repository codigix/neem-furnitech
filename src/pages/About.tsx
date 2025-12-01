import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Leaf, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-4 py-1 bg-primary-gold/20 backdrop-blur-sm border border-primary-gold/30 rounded-full mb-4">
            <p className="text-xs font-medium text-primary-gold">Established 2006</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary-gold to-primary bg-clip-text text-transparent">
              About Neem Furnitech
            </span>
          </h1>
          <p className="text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Leading manufacturer of premium office furniture since 2006. We specialize in Executive Chairs, 
            Office Chairs, Conference Chairs, Waiting Chairs, and provide professional chair repairing services.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <div className="px-4 py-2 bg-primary-gold/10 rounded-lg border border-primary-gold/20">
              <p className="text-xs text-muted-foreground">Annual Turnover</p>
              <p className="text-sm font-bold text-primary-gold">₹1.5 - 5 Cr</p>
            </div>
            <div className="px-4 py-2 bg-primary-gold/10 rounded-lg border border-primary-gold/20">
              <p className="text-xs text-muted-foreground">Years in Business</p>
              <p className="text-sm font-bold text-primary-gold">18+ Years</p>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="bg-gradient-to-br from-primary-gold/5 via-background to-primary-gold/5 rounded-2xl p-6 md:p-10 mb-12 shadow-lg border-2 border-primary-gold/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-gold to-primary-gold/60 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Company Overview</h2>
              </div>
              <div className="space-y-2 text-sm">
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">Nature of Business:</span>
                    <span className="text-primary-gold font-bold">Manufacturer</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">Established:</span>
                    <span className="text-primary-gold font-bold">2006</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">GST Registration:</span>
                    <span className="text-primary-gold font-bold">01-07-2017</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">Legal Status:</span>
                    <span className="text-primary-gold font-bold">Proprietorship</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">Annual Turnover:</span>
                    <span className="text-primary-gold font-bold">₹1.5 - 5 Cr</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">GST No.:</span>
                    <span className="text-primary-gold font-bold text-xs">27BCXPP0126J1Z6</span>
                  </CardContent>
                </Card>
                <Card className="border border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex justify-between p-4">
                    <span className="font-semibold">IEC:</span>
                    <span className="text-primary-gold font-bold">BCXPP0126J</span>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-gold to-primary-gold/60 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
              </div>
              <Card className="border-2 border-primary-gold/30 bg-gradient-to-br from-card to-primary-gold/5 p-5 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We <span className="text-primary-gold font-bold">"Neem Furnitech"</span> are the leading manufacturer of a wide range of Executive Chair, 
                  Office Chair, Conference Chair, Waiting Chair, and more. Our commitment is to provide 
                  high-quality office furniture that meets global standards.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We also provide <span className="text-primary-gold font-semibold">Office Chair Repairing Service</span>, ensuring your furniture investments last longer. 
                  Our connection with renowned vendors helps us maintain the highest quality standards in every product.
                </p>
                <div className="bg-primary-gold/10 border-2 border-primary-gold/30 rounded-xl p-4 mt-3">
                  <p className="text-sm font-semibold text-center">
                    Under the visionary leadership of <span className="text-primary-gold text-base">"Mrs. Nisha Parmar"</span> and <span className="text-primary-gold text-base">"Mr. Mahendra Parmar"</span>, we have attained a dynamic position in this sector.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Our Strengths Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Experience excellence backed by quality, expertise, and dedication
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-lg hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="p-4 space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-base font-bold">Quality Products</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connected with renowned vendors ensuring products meet global standards for durability and design.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-lg hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="p-4 space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-base font-bold">Expert Leadership</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Under the visionary leadership of Mrs. Nisha Parmar and Mr. Mahendra Parmar, achieving excellence in the furniture sector.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-lg hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="p-4 space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-base font-bold">Wide Range</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Comprehensive product line including executive, office, conference, and waiting chairs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-card to-primary-gold/5 border-2 border-primary-gold/20 hover:shadow-lg hover:border-primary-gold/40 transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="p-4 space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-gold to-primary-gold/60 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-base font-bold">Repair Services</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Professional office chair repairing service to extend the life of your furniture investments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Categories Section */}
        <div className="bg-gradient-to-br from-primary-gold/10 via-primary-gold/5 to-background rounded-2xl p-8 md:p-10 mb-12 shadow-lg border-2 border-primary-gold/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">
                Our Product Range
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Comprehensive furniture solutions for every commercial space
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-gold via-primary-gold/80 to-primary-gold/60 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-base font-bold mb-2">Executive & Office Chairs</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Premium executive chairs with high back support, SS legs, and ergonomic designs for maximum comfort and productivity.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-gold via-primary-gold/80 to-primary-gold/60 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-base font-bold mb-2">Conference & Waiting Chairs</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stylish conference seating and comfortable waiting chairs in various configurations to suit any space.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-gold via-primary-gold/80 to-primary-gold/60 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-base font-bold mb-2">Specialized Furniture</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bar stools, restaurant chairs, folding tables, and revolving chairs for diverse commercial applications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="text-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">
              Leadership
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Under the visionary leadership of Mrs. Nisha Parmar and Mr. Mahendra Parmar, Neem Furnitech 
              has achieved a dynamic position in the furniture manufacturing sector, consistently delivering 
              quality products that meet global standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
            <Card className="bg-gradient-to-br from-primary-gold/5 via-card to-primary-gold/5 border-2 border-primary-gold/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-gold to-primary-gold/60 flex items-center justify-center shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nisha Parmar</h3>
                <div className="inline-block px-4 py-1 bg-primary-gold/20 backdrop-blur-sm border border-primary-gold/30 rounded-full mb-3">
                  <p className="text-xs text-primary-gold font-bold">Director</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mrs. Nisha Parmar is one of the visionary directors of Neem Furnitech. With her leadership 
                  and dedication, she has been instrumental in shaping the company's growth and establishing 
                  strong relationships with clients across India.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary-gold/5 via-card to-primary-gold/5 border-2 border-primary-gold/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary-gold to-primary-gold/60 flex items-center justify-center shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mahendra Parmar</h3>
                <div className="inline-block px-4 py-1 bg-primary-gold/20 backdrop-blur-sm border border-primary-gold/30 rounded-full mb-3">
                  <p className="text-xs text-primary-gold font-bold">Director</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mr. Mahendra Parmar, Director of Neem Furnitech, started the company in 2006 from the ground up. 
                  His vision and expertise have positioned the company as a trusted name in office furniture 
                  manufacturing and supply across India.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary-gold/10 to-primary/5 rounded-2xl border-2 border-primary-gold/30 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-gold bg-clip-text text-transparent">Contact Us</h3>
            <div className="space-y-3 text-left">
              <Card className="border-2 border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <p className="text-sm">
                    <span className="font-semibold text-primary-gold">Address:</span>
                    <span className="ml-2 text-muted-foreground">Plot No. Pap/j-4, Indrayani Nagar, Pune - 411026, Maharashtra, India</span>
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary-gold/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-primary-gold text-sm">Phone:</span>
                    <a href="tel:+918047643560" className="ml-2 text-base font-bold text-primary hover:text-primary-gold transition-colors">
                      +91-8047643560
                    </a>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Call Response Rate</p>
                    <p className="text-base font-bold text-primary-gold">85%</p>
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