-- Task 1: Insert the new record into the 'account' table

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');



-- Task 2: Update the account_type to 'Admin' for Tony Stark

UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- Task 3: Delete the Tony Stark record from the 'account' table

DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Task 4: Modify the 'GM Hummer' record description

UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10

-- Task 5: Inner join to select make, model, and classification_name

SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Task 6: Update all records in the 'inventory' table to modify file paths

UPDATE inventory
SET inv_image = CONCAT('/images/vehicles/', REPLACE(inv_image, '/images/', '')),
    inv_thumbnail = CONCAT('/images/vehicles/', REPLACE(inv_thumbnail, '/images/', ''));











