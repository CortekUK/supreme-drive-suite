-- Reset accent color to original gold color
UPDATE site_settings 
SET accent_color = '#D4AF37', 
    updated_at = now()
WHERE id = 'f6a0e62a-625c-4098-a37c-3b14356da7d3';