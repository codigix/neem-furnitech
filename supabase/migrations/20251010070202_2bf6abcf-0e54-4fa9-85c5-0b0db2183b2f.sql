-- Fix contacts table RLS policy to use security definer function
-- This prevents RLS recursion issues and ensures proper admin-only access

-- Drop the existing policy that uses a direct subquery
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;

-- Create a new policy using the security definer function
CREATE POLICY "Admins can view all contacts"
ON public.contacts
FOR SELECT
USING (public.is_current_user_admin());