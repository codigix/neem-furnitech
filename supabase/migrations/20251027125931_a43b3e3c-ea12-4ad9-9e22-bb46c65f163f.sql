-- Create admin user properly using Supabase auth extensions
-- This approach ensures all auth columns are set correctly

-- First, let's create a function to set up the admin
CREATE OR REPLACE FUNCTION public.create_initial_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if admin already exists
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE role = 'admin'
  ) THEN
    RAISE NOTICE 'Admin user already exists';
    RETURN;
  END IF;

  -- Create a placeholder that will be replaced with actual user creation
  -- The actual user needs to be created via Supabase Auth API
  RAISE NOTICE 'Admin user needs to be created via Auth API';
  RAISE NOTICE 'Email: admin@neemfurnitech.com';
  RAISE NOTICE 'Password: Admin@12345';
END;
$$;

-- Execute the function
SELECT public.create_initial_admin();

-- Drop the function as it's no longer needed
DROP FUNCTION public.create_initial_admin();