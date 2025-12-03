import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto py-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/neemfurnitech.png" alt="Neem Furnitech" className="w-[100px] h-auto" />
            </Link> 
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium furniture crafted with attention to detail, designed to elevate your living spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Get in Touch</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary-gold flex-shrink-0" />
                <a href="mailto:neemfurnitech@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  neemfurnitech@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary-gold flex-shrink-0" />
                <a href="tel:+919922754689" className="text-muted-foreground hover:text-foreground transition-colors">
                  +91-99227 54689
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-gold flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Plot No. Pap/j-4, Indrayani Nagar<br />
                  Pune - 411026, Maharashtra, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6"></div>

        {/* Bottom */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Neem Furniture. All rights reserved. Designed with precision, built for comfort.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;