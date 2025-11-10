-- Drop existing foreign key that points to auth.users
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add correct foreign key relationship between orders and profiles
ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;