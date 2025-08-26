ALTER TABLE restaurants
ADD COLUMN search_vector tsvector;

CREATE INDEX restaurants_search_gin
ON restaurants
USING GIN (search_vector);

-- Enable unaccent extension (safe if it already exists)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add search_vector column (if not already exists)
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Backfill search_vector for existing rows
UPDATE restaurants
SET search_vector = to_tsvector('english', unaccent(coalesce(name, '')));

-- Create function to keep search_vector updated
CREATE OR REPLACE FUNCTION restaurants_search_vector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', unaccent(coalesce(NEW.name, ''))), 'A');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Drop old trigger if it exists (safety)
DROP TRIGGER IF EXISTS restaurants_search_vector_update ON restaurants;

-- Create new trigger to update search_vector on insert/update
CREATE TRIGGER restaurants_search_vector_update
BEFORE INSERT OR UPDATE ON restaurants
FOR EACH ROW
EXECUTE FUNCTION restaurants_search_vector_trigger();

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS restaurants_search_gin
ON restaurants USING GIN (search_vector);
