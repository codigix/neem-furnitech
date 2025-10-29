-- Add subcategory support to categories table
-- This allows creating hierarchical category structures

-- Add parent_id column to support subcategories
ALTER TABLE public.categories
ADD COLUMN parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);

-- Add a check to prevent circular references (a category cannot be its own parent)
ALTER TABLE public.categories
ADD CONSTRAINT check_not_self_parent CHECK (id != parent_id);