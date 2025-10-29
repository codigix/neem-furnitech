-- Remove the incorrectly created admin user
-- This user was created with incomplete auth columns causing login errors
DELETE FROM auth.users WHERE email = 'admin@neemfurnitech.com';