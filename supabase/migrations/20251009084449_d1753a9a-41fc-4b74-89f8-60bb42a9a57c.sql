-- Add color_variants column to products table to store color-specific images
ALTER TABLE products ADD COLUMN color_variants jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.color_variants IS 'Array of color variants with their images: [{"color": "Black", "images": ["url1", "url2"]}, ...]';