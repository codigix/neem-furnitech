-- Update gallery table to remove category requirement and add file upload support
ALTER TABLE gallery 
ALTER COLUMN category_id DROP NOT NULL,
ADD COLUMN uploaded_file_path TEXT;

-- Create storage bucket for gallery images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Gallery storage policies
CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images' AND EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
));

CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images' AND EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
));

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images' AND EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
));