-- ============================================================
-- NEEM FURNITURE - Complete Database Setup
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. Create Products Table (if not exists, or fix schema)
-- ============================================================
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'chair',
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  color_variants jsonb DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. Create Profiles Table
-- ============================================================
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address JSONB,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Create Cart Items Table
-- ============================================================
DROP TABLE IF EXISTS public.cart_items CASCADE;

CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_color text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. Create Favorites Table
-- ============================================================
DROP TABLE IF EXISTS public.favorites CASCADE;

CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- 5. Create Orders Table
-- ============================================================
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. Create Categories Table
-- ============================================================
DROP TABLE IF EXISTS public.categories CASCADE;

CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);

ALTER TABLE public.categories
ADD CONSTRAINT check_not_self_parent CHECK (id != parent_id);

-- ============================================================
-- 7. Create Gallery Table
-- ============================================================
DROP TABLE IF EXISTS public.gallery CASCADE;

CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  is_featured BOOLEAN DEFAULT false,
  uploaded_file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. Create Contacts Table
-- ============================================================
DROP TABLE IF EXISTS public.contacts CASCADE;

CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'website_popup',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. Enable Row Level Security
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 10. Create Update Timestamp Function
-- ============================================================
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 11. Create Admin Check Function
-- ============================================================
DROP FUNCTION IF EXISTS public.is_current_user_admin();

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_admin, false) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================
-- 12. Products Policies
-- ============================================================
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
USING (public.is_current_user_admin());

-- ============================================================
-- 13. Profiles Policies
-- ============================================================
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Profiles can be created on signup" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());

-- ============================================================
-- 14. Cart Items Policies
-- ============================================================
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart items" 
ON public.cart_items FOR ALL 
USING (auth.uid() = user_id);

-- ============================================================
-- 15. Favorites Policies
-- ============================================================
CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL 
USING (auth.uid() = user_id);

-- ============================================================
-- 16. Orders Policies
-- ============================================================
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (public.is_current_user_admin());

-- ============================================================
-- 17. Categories Policies
-- ============================================================
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_current_user_admin());

-- ============================================================
-- 18. Gallery Policies
-- ============================================================
CREATE POLICY "Gallery images are viewable by everyone" 
ON public.gallery 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage gallery" 
ON public.gallery 
FOR ALL 
USING (public.is_current_user_admin());

-- ============================================================
-- 19. Contacts Policies
-- ============================================================
CREATE POLICY "Admins can view all contacts" 
ON public.contacts 
FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Anyone can create contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- ============================================================
-- 20. Create Triggers for Updated At
-- ============================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 21. Create User Profile on Signup
-- ============================================================
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 22. Insert Default Categories
-- ============================================================
DELETE FROM public.categories WHERE name IN ('Chairs', 'Tables', 'Sofas', 'Storage', 'Decor');

INSERT INTO public.categories (name, description) VALUES 
('Chairs', 'Comfortable seating solutions'),
('Tables', 'Dining and work tables'),
('Sofas', 'Living room furniture'),
('Storage', 'Storage and organization solutions'),
('Decor', 'Decorative items and accessories');

-- ============================================================
-- 23. Create Storage Bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 24. Storage Policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;

CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images' AND public.is_current_user_admin());

CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images' AND public.is_current_user_admin());

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images' AND public.is_current_user_admin());

-- ============================================================
-- Database Setup Complete!
-- ============================================================