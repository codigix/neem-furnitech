import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderDetails, customerInfo } = await req.json();
    
    // Generate WhatsApp payment message similar to Pune Metro
    const whatsappMessage = generateWhatsAppMessage(orderDetails, customerInfo);
    
    // WhatsApp Business API number (replace with actual business number)
    const businessNumber = "+919999999999"; // Replace with your business WhatsApp number
    
    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${businessNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    return new Response(JSON.stringify({ 
      whatsappUrl,
      message: whatsappMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error creating WhatsApp payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function generateWhatsAppMessage(orderDetails: any, customerInfo: any): string {
  const { items, total, orderId } = orderDetails;
  const { name, phone, address } = customerInfo;
  
  let message = `🛋️ *Neem Furnitech ORDER*\n\n`;
  message += `📝 *Order ID:* ${orderId}\n`;
  message += `👤 *Customer:* ${name}\n`;
  message += `📱 *Phone:* ${phone}\n\n`;
  
  message += `🛍️ *ORDER ITEMS:*\n`;
  items.forEach((item: any, index: number) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}\n`;
  });
  
  message += `\n💰 *TOTAL AMOUNT: ₹${total}*\n\n`;
  
  if (address) {
    message += `📍 *Delivery Address:*\n${address}\n\n`;
  }
  
  message += `💳 *PAYMENT INSTRUCTIONS:*\n`;
  message += `1. Pay ₹${total} via UPI\n`;
  message += `2. UPI ID: neemfurnitaech@paytm\n`;
  message += `3. Send payment screenshot\n`;
  message += `4. Your order will be confirmed\n\n`;
  
  message += `🔄 *Reply with payment screenshot to confirm order*\n\n`;
  message += `Thank you for choosing Neem Furnitech! 🙏`;
  
  return message;
}