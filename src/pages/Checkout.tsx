import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, MapPin, Package, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    base_price: number;
    image_url: string;
  };
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  const [shippingForm, setShippingForm] = useState({
    full_name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    await Promise.all([
      fetchCartItems(session.user.id),
      fetchProfile(session.user.id)
    ]);
  };

  const fetchCartItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            base_price,
            image_url
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Map the data to our expected interface
      const mappedCartItems: CartItem[] = (data || []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        products: {
          id: (item.products as any).id,
          name: (item.products as any).name,
          base_price: (item.products as any).base_price,
          image_url: (item.products as any).image_url
        }
      }));
      
      setCartItems(mappedCartItems);
      
      if (mappedCartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Add some items to your cart first",
          variant: "destructive",
        });
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      
      // Shipping form starts empty as profile doesn't have address
      setShippingForm(prev => ({
        ...prev,
        full_name: data?.full_name || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.products.base_price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    
    // Validate shipping form
    if (!shippingForm.full_name || !shippingForm.street || !shippingForm.city) {
      toast({
        title: "Incomplete shipping information",
        description: "Please fill in all required shipping details",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    
    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        product_id: item.products.id,
        name: item.products.name,
        base_price: item.products.base_price,
        quantity: item.quantity
      }));

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_items: orderItems,
          total: getTotalPrice(),
          status: 'pending',
          shipping_address: shippingForm
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Clear cart
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      // Show success animation
      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id.slice(-8)} has been created`,
      });

      // Navigate to orders page
      setTimeout(() => {
        navigate('/orders');
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-elegant">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading checkout...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/cart')} className="mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold text-primary mb-1">Checkout</h1>
          <p className="text-xs text-foreground/70">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={shippingForm.full_name}
                    onChange={(e) => setShippingForm(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm(prev => ({ ...prev, street: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, zip: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingForm.country}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === "card" && (
                  <div className="mt-3 p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-foreground/70">
                      Card payment integration would be implemented here with a payment processor like Stripe.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <img
                          src={item.products.image_url || "/placeholder.svg"}
                          alt={item.products.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.products.name}</h4>
                          <p className="text-xs text-foreground/70">Qty: {item.quantity}</p>
                           <p className="text-sm font-semibold">
                            ₹{(item.products.base_price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2 space-y-1 text-sm">
                    <div className="flex justify-between text-xs">
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Tax</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="border-t pt-1">
                      <div className="flex justify-between font-bold text-sm">
                        <span>Total</span>
                        <span>₹{getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={processing || cartItems.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;