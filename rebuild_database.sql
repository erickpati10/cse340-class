


--database rebuild 

-- Task 4: Modify the 'GM Hummer' record description 

UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10

-- Task 6: Update

UPDATE inventory
SET inv_image = CONCAT('/images/vehicles/', REPLACE(inv_image, '/images/', '')),
    inv_thumbnail = CONCAT('/images/vehicles/', REPLACE(inv_thumbnail, '/images/', ''));



-----