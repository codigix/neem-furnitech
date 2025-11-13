-- Add product specification fields
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comment to explain the specifications structure
COMMENT ON COLUMN public.products.specifications IS 'Stores product specifications like chair_type, arm_type, brand, height_adjustable, back_type, warranty, seat_material, upholstery_material, model, etc.';