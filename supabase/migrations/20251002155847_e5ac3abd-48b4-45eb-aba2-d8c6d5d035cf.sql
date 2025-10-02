-- Update vehicle pricing to reflect exclusive luxury positioning
UPDATE vehicles 
SET base_price_per_mile = 20.00 
WHERE name ILIKE '%Rolls-Royce Phantom%';

UPDATE vehicles 
SET base_price_per_mile = 8.00 
WHERE name ILIKE '%Mercedes S-Class%';

UPDATE vehicles 
SET base_price_per_mile = 7.00 
WHERE name ILIKE '%Mercedes V-Class%';

UPDATE vehicles 
SET base_price_per_mile = 9.00 
WHERE name ILIKE '%Range Rover Autobiography%';