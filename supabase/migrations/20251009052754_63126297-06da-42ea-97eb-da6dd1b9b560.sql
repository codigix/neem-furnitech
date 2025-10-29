-- Add selected_color column to cart_items table
ALTER TABLE cart_items ADD COLUMN selected_color text;

-- Add comment for documentation
COMMENT ON COLUMN cart_items.selected_color IS 'The color selected by the customer for this cart item';