# Subcategories Feature - End-to-End Flow

## Overview
This document describes the complete end-to-end flow for adding and managing subcategories in the Admin Panel's Categories Management page.

## Database Schema
The categories table supports hierarchical relationships using a `parent_id` column:

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Features

### 1. **Main Categories & Subcategories Display**
- Main categories are displayed with a "Main Category" badge
- Subcategories are indented and displayed with a "Subcategory" badge
- Each category shows the count of subcategories (if any)
- Hierarchical tree structure visualization

### 2. **Add Subcategory - Two Methods**

#### Method 1: Direct Button Click on Parent Category
1. Navigate to Admin Panel → Categories
2. View the list of main categories
3. Click the **"Add Sub"** button on any main category card
4. The form will:
   - Open automatically
   - Display: "Adding subcategory to: {Parent Category Name}"
   - Set the parent category automatically
   - Pre-populate the parent_id field
5. Fill in the subcategory details:
   - **Subcategory Name** (required)
   - **Description** (optional)
6. Click **"Add Category"** button
7. Subcategory is created and appears under the parent category

#### Method 2: Manual Parent Selection in Form
1. Navigate to Admin Panel → Categories
2. Click the **"Add Category"** button
3. Fill in the category name and description
4. In the **"Parent Category (Optional)"** dropdown, select a parent category
5. If you select "None", you can add subcategories inline:
   - Click **"Add Subcategory"** button
   - Fill in subcategory name and description
   - Add multiple subcategories as needed
6. Click **"Add Category"** button
7. Both main category and all subcategories are created together

### 3. **Edit Subcategory**
1. Hover over a subcategory card in the hierarchy
2. Click the **Edit** button (pencil icon)
3. Modify the subcategory details
4. Click **"Update Category"** button
5. Changes are saved

### 4. **Delete Subcategory**
1. Hover over a subcategory card
2. Click the **Delete** button (trash icon)
3. Confirm the deletion
4. Subcategory is removed from the parent category

### 5. **View Hierarchy**
The categories page displays all categories in a hierarchical tree structure:
- Main categories are shown at the root level
- Subcategories are indented and grouped under their parent
- Visual indicators show the relationship level

## User Interface Changes

### CategoryCard Component
- Added **"Add Sub"** button for main categories (level === 0 only)
- The button appears before Edit and Delete buttons
- Clicking it opens the form with parent_id pre-set

### Category Form
- Enhanced header shows parent category name when adding subcategory:
  ```
  Adding subcategory to: {Parent Category Name}
  ```
- Maintains all existing functionality for creating main categories
- Parent category selection dropdown remains unchanged

## Workflow Examples

### Example 1: Create "Furniture" Category with Subcategories (Inline)
1. Click "Add Category"
2. Enter name: "Furniture"
3. Enter description: "All furniture items"
4. Leave "Parent Category" as "None (Main Category)"
5. Click "Add Subcategory" button
6. Add "Chairs", "Tables", "Sofas" as subcategories
7. Click "Add Category"
8. Result: 1 main category + 3 subcategories created in one step

### Example 2: Add Subcategory to Existing Category
1. In the categories list, find "Furniture" category
2. Click "Add Sub" button on the Furniture card
3. Form opens with Furniture pre-selected as parent
4. Enter subcategory name: "Beds"
5. Enter description: "Bed frames and mattresses"
6. Click "Add Category"
7. Result: "Beds" appears under "Furniture" in the hierarchy

### Example 3: Convert Subcategory to Details
1. Find the subcategory you want to edit
2. Click the Edit button
3. Modify the name or description
4. Click "Update Category"
5. Changes are reflected in the hierarchy

## Database Operations

### Insert Main Category with Subcategories
```sql
-- Insert main category
INSERT INTO categories (name, description, parent_id)
VALUES ('Furniture', 'All furniture items', NULL);

-- Insert subcategories
INSERT INTO categories (name, description, parent_id)
VALUES 
  ('Chairs', 'Chair products', {main_category_id}),
  ('Tables', 'Table products', {main_category_id}),
  ('Sofas', 'Sofa products', {main_category_id});
```

### Insert Subcategory for Existing Parent
```sql
INSERT INTO categories (name, description, parent_id)
VALUES ('Beds', 'Bed frames and mattresses', {parent_category_id});
```

### Query Hierarchy
```sql
-- Get all main categories with subcategories
SELECT c1.*, 
       COUNT(c2.id) as subcategory_count
FROM categories c1
LEFT JOIN categories c2 ON c1.id = c2.parent_id
WHERE c1.parent_id IS NULL
GROUP BY c1.id
ORDER BY c1.created_at DESC;

-- Get subcategories for specific parent
SELECT * FROM categories 
WHERE parent_id = {parent_id}
ORDER BY created_at DESC;
```

## Form State Management

### categoryForm State Structure
```typescript
{
  name: string;                           // Category/Subcategory name
  description: string;                    // Description
  parent_id: string;                      // Parent category ID (empty for main)
  subcategories: Array<{                  // Only used when creating main category
    name: string;
    description: string;
  }>;
}
```

### State Transitions
- **Initial**: Empty form with parent_id = ""
- **Add Main Category**: Populate name/description, keep parent_id empty
- **Add Subcategory (via button)**: parent_id is set, name/description empty
- **Edit Category**: Populate all fields from category data
- **Save**: Reset form and refresh category list

## Error Handling

- **Duplicate Names**: Database enforces uniqueness within context (currently allows)
- **Parent Not Found**: Validation in parent dropdown
- **Delete Protection**: Cascade delete removes all subcategories
- **Update Failed**: Toast notification with error message
- **Delete Confirmation**: Confirmation dialog before deletion

## Performance Considerations

- Categories fetched on component mount and after any changes
- Hierarchical organization done client-side for better UX
- Efficient data structure using Map for O(1) lookups
- Recursive rendering for unlimited nesting depth (though typically 2-3 levels)

## Security

- All operations require admin role (enforced by RLS policies)
- Category management restricted to authenticated admins
- Parent-child relationships maintained by foreign key constraint
- Cascade delete prevents orphaned records

## Future Enhancements

1. **Drag-and-Drop Reordering**: Reorganize category hierarchy
2. **Bulk Operations**: Delete multiple categories at once
3. **Import/Export**: Backup and restore category structure
4. **Search**: Find categories by name or description
5. **Analytics**: Track products per category/subcategory
6. **Multi-level Nesting**: Support deeper hierarchy (3+ levels)
7. **Category Images**: Add icons/images to categories
8. **Sorting Options**: Sort by name, date, product count