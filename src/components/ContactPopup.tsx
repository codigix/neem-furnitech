import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ContactPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Don't show or attach listeners on admin pages; also close if navigating to admin
    if (location.pathname.startsWith('/admin')) {
      setIsOpen(false);
      return;
    }

    // Check if user has already seen the popup
    const popupShown = localStorage.getItem("contactPopupShown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    let interactionTriggered = false;

    const handleInteraction = () => {
      if (!interactionTriggered && !hasShown) {
        interactionTriggered = true;
        setTimeout(() => {
          setIsOpen(true);
        }, 1000); // Small delay for better UX
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 100) { // Only after scrolling 100px
        handleInteraction();
      }
    };

    // Add event listeners
    document.addEventListener("click", handleInteraction);
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contacts")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "We'll get in touch with you soon.",
      });

      // Mark popup as shown
      localStorage.setItem("contactPopupShown", "true");
      setHasShown(true);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to submit contact information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("contactPopupShown", "true");
    setHasShown(true);
  };

  if (location.pathname.startsWith('/admin') || hasShown) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Stay Connected!
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us how we can help you..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPopup;