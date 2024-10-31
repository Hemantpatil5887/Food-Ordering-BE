CREATE DATABASE foodOrdering;
USE foodOrdering;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL
);


INSERT INTO users (username, password_hash, email, phone_number, address, is_active, last_login) 
VALUES (
    'hemant patil', 
    'password', 
    'hemantpatil5887@gmail.com', 
    '9028615034', 
    '904, Royal Meadows, Kalyan', 
    TRUE, 
    NOW()
);

CREATE TABLE restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    type ENUM('Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side', 'Fruit', 'Non-Veg', 'Vegetable', 'Drink', 'Breads' ) NOT NULL DEFAULT 'Main Course',
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Processing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE SET NULL
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE
);


INSERT INTO restaurants (name, location, phone) VALUES
('Pizza Palace', '123 Main St, Cityville', '123-456-7890'),
('Burger Haven', '456 Elm St, Townsville', '234-567-8901'),
('Sushi World', '789 Oak St, Villagetown', '345-678-9012'),
('Pasta Corner', '101 Maple Ave, Cityville', '456-789-0123'),
('Taco Fiesta', '202 Birch Rd, Townsville', '567-890-1234'),
('BBQ Delight', '303 Pine Ln, Villagetown', '678-901-2345'),
('Vegan Vibes', '404 Cedar Blvd, Cityville', '789-012-3456'),
('Steakhouse Prime', '505 Spruce St, Townsville', '890-123-4567'),
('Indian Spice', '606 Walnut Ave, Villagetown', '901-234-5678'),
('Bakery Bliss', '707 Chestnut St, Cityville', '012-345-6789');

INSERT INTO menu_items (restaurant_id, name, description, price, available, image_url, type) VALUE
(1, 'Margherita Pizza', 'Classic cheese and tomato pizza', 8.99, TRUE, 'https://example.com/images/margherita_pizza.jpg', 'Main Course'),
(1, 'Pepperoni Pizza', 'Pepperoni with mozzarella and tomato sauce', 10.99, TRUE, 'https://example.com/images/pepperoni_pizza.jpg', 'Main Course'),
(1, 'Cheese Sticks', 'Mozzarella cheese sticks with marinara sauce', 5.99, TRUE, 'https://example.com/images/cheese_sticks.jpg', 'Appetizer'),
(1, 'Buffalo Wings', 'Spicy buffalo wings with blue cheese dip', 7.99, TRUE, 'https://example.com/images/buffalo_wings.jpg', 'Appetizer'),
(1, 'Garlic Bread', 'Garlic butter spread on toasted bread', 4.99, TRUE, 'https://example.com/images/garlic_bread.jpg', 'Breads'),
(1, 'Caesar Salad', 'Romaine lettuce with Caesar dressing', 6.99, TRUE, 'https://example.com/images/caesar_salad.jpg', 'Vegetable'),
(1, 'Garden Salad', 'Mixed greens with tomatoes, cucumbers, and carrots', 5.99, TRUE, 'https://example.com/images/garden_salad.jpg', 'Vegetable'),
(1, 'Soda', 'Choice of cola, lemon-lime, or orange soda', 1.99, TRUE, 'https://example.com/images/soda.jpg', 'Drink'),
(1, 'Fruit Platter', 'Seasonal fresh fruits', 6.49, TRUE, 'https://example.com/images/fruit_platter.jpg', 'Fruit'),
(1, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 6.99, TRUE, 'https://example.com/images/lava_cake.jpg', 'Dessert'),
(2, 'Classic Burger', 'Beef patty, lettuce, tomato, and cheese', 7.99, TRUE, 'https://example.com/images/classic_burger.jpg', 'Main Course'),
(2, 'Double Cheeseburger', 'Two beef patties with cheese and pickles', 9.99, TRUE, 'https://example.com/images/double_cheeseburger.jpg', 'Main Course'),
(2, 'French Fries', 'Crispy golden French fries', 2.99, TRUE, 'https://example.com/images/fries.jpg', 'Side'),
(2, 'Onion Rings', 'Crispy fried onion rings', 3.99, TRUE, 'https://example.com/images/onion_rings.jpg', 'Side'),
(2, 'Milkshake', 'Choice of vanilla, chocolate, or strawberry', 4.49, TRUE, 'https://example.com/images/milkshake.jpg', 'Beverage'),
(2, 'Bacon Burger', 'Beef patty with bacon, cheese, and BBQ sauce', 8.99, TRUE, 'https://example.com/images/bacon_burger.jpg', 'Non-Veg'),
(2, 'Veggie Burger', 'Plant-based patty with lettuce and tomato', 7.99, TRUE, 'https://example.com/images/veggie_burger.jpg', 'Vegetable'),
(2, 'Chicken Nuggets', 'Breaded chicken nuggets with dipping sauce', 5.99, TRUE, 'https://example.com/images/chicken_nuggets.jpg', 'Non-Veg'),
(2, 'Iced Tea', 'Refreshing iced tea with lemon', 2.49, TRUE, 'https://example.com/images/iced_tea.jpg', 'Drink'),
(2, 'Apple Pie', 'Classic apple pie with cinnamon', 4.99, TRUE, 'https://example.com/images/apple_pie.jpg', 'Dessert'),
(3, 'California Roll', 'Crab, avocado, cucumber roll', 8.99, TRUE, 'https://example.com/images/california_roll.jpg', 'Main Course'),
(3, 'Spicy Tuna Roll', 'Spicy tuna with cucumber', 9.49, TRUE, 'https://example.com/images/spicy_tuna_roll.jpg', 'Main Course'),
(3, 'Avocado Roll', 'Simple roll with fresh avocado', 6.99, TRUE, 'https://example.com/images/avocado_roll.jpg', 'Vegetable'),
(3, 'Salmon Sashimi', 'Slices of fresh salmon', 12.99, TRUE, 'https://example.com/images/salmon_sashimi.jpg', 'Non-Veg'),
(3, 'Edamame', 'Steamed and salted soybeans', 4.99, TRUE, 'https://example.com/images/edamame.jpg', 'Vegetable'),
(3, 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 3.99, TRUE, 'https://example.com/images/miso_soup.jpg', 'Appetizer'),
(3, 'Tempura Shrimp', 'Crispy fried shrimp tempura', 10.99, TRUE, 'https://example.com/images/tempura_shrimp.jpg', 'Non-Veg'),
(3, 'Chicken Teriyaki', 'Grilled chicken with teriyaki sauce', 11.99, TRUE, 'https://example.com/images/chicken_teriyaki.jpg', 'Non-Veg'),
(3, 'Vegetable Tempura', 'Assorted fried vegetables in tempura batter', 8.99, TRUE, 'https://example.com/images/vegetable_tempura.jpg', 'Vegetable'),
(3, 'Green Tea', 'Traditional Japanese green tea', 2.49, TRUE, 'https://example.com/images/green_tea.jpg', 'Drink'),
(4, 'Spaghetti Carbonara', 'Pasta with bacon, egg, and cheese sauce', 12.99, TRUE, 'https://example.com/images/spaghetti_carbonara.jpg', 'Main Course'),
(4, 'Fettuccine Alfredo', 'Pasta with creamy Alfredo sauce', 11.99, TRUE, 'https://example.com/images/fettuccine_alfredo.jpg', 'Main Course'),
(4, 'Lasagna', 'Layered pasta with meat and cheese', 13.99, TRUE, 'https://example.com/images/lasagna.jpg', 'Main Course'),
(4, 'Penne Arrabbiata', 'Spicy tomato sauce with garlic and chili', 10.99, TRUE, 'https://example.com/images/penne_arrabbiata.jpg', 'Main Course'),
(4, 'Bruschetta', 'Tomato and basil on toasted bread', 5.99, TRUE, 'https://example.com/images/bruschetta.jpg', 'Appetizer'),
(4, 'Minestrone Soup', 'Classic Italian vegetable soup', 6.99, TRUE, 'https://example.com/images/minestrone_soup.jpg', 'Vegetable'),
(4, 'Caprese Salad', 'Tomato, mozzarella, and basil', 8.99, TRUE, 'https://example.com/images/caprese_salad.jpg', 'Vegetable'),
(4, 'Tiramisu', 'Coffee-flavored Italian dessert', 7.49, TRUE, 'https://example.com/images/tiramisu.jpg', 'Dessert'),
(4, 'Garlic Bread', 'Toasted bread with garlic butter', 4.49, TRUE, 'https://example.com/images/garlic_bread.jpg', 'Breads'),
(4, 'Espresso', 'Strong Italian coffee', 2.99, TRUE, 'https://example.com/images/espresso.jpg', 'Drink'),
(5, 'Margherita Pizza', 'Classic cheese and tomato pizza', 8.99, TRUE, 'https://example.com/images/margherita_pizza.jpg', 'Main Course'),
(5, 'Pepperoni Pizza', 'Pepperoni with mozzarella and tomato sauce', 10.99, TRUE, 'https://example.com/images/pepperoni_pizza.jpg', 'Main Course'),
(5, 'Cheese Sticks', 'Mozzarella cheese sticks with marinara sauce', 5.99, TRUE, 'https://example.com/images/cheese_sticks.jpg', 'Appetizer'),
(5, 'Buffalo Wings', 'Spicy buffalo wings with blue cheese dip', 7.99, TRUE, 'https://example.com/images/buffalo_wings.jpg', 'Appetizer'),
(5, 'Garlic Bread', 'Garlic butter spread on toasted bread', 4.99, TRUE, 'https://example.com/images/garlic_bread.jpg', 'Breads'),
(5, 'Caesar Salad', 'Romaine lettuce with Caesar dressing', 6.99, TRUE, 'https://example.com/images/caesar_salad.jpg', 'Vegetable'),
(5, 'Garden Salad', 'Mixed greens with tomatoes, cucumbers, and carrots', 5.99, TRUE, 'https://example.com/images/garden_salad.jpg', 'Vegetable'),
(5, 'Soda', 'Choice of cola, lemon-lime, or orange soda', 1.99, TRUE, 'https://example.com/images/soda.jpg', 'Drink'),
(5, 'Fruit Platter', 'Seasonal fresh fruits', 6.49, TRUE, 'https://example.com/images/fruit_platter.jpg', 'Fruit'),
(5, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 6.99, TRUE, 'https://example.com/images/lava_cake.jpg', 'Dessert'),
(6, 'Classic Burger', 'Beef patty, lettuce, tomato, and cheese', 7.99, TRUE, 'https://example.com/images/classic_burger.jpg', 'Main Course'),
(6, 'Double Cheeseburger', 'Two beef patties with cheese and pickles', 9.99, TRUE, 'https://example.com/images/double_cheeseburger.jpg', 'Main Course'),
(6, 'French Fries', 'Crispy golden French fries', 2.99, TRUE, 'https://example.com/images/fries.jpg', 'Side'),
(6, 'Onion Rings', 'Crispy fried onion rings', 3.99, TRUE, 'https://example.com/images/onion_rings.jpg', 'Side'),
(6, 'Milkshake', 'Choice of vanilla, chocolate, or strawberry', 4.49, TRUE, 'https://example.com/images/milkshake.jpg', 'Beverage'),
(6, 'Bacon Burger', 'Beef patty with bacon, cheese, and BBQ sauce', 8.99, TRUE, 'https://example.com/images/bacon_burger.jpg', 'Non-Veg'),
(6, 'Veggie Burger', 'Plant-based patty with lettuce and tomato', 7.99, TRUE, 'https://example.com/images/veggie_burger.jpg', 'Vegetable'),
(6, 'Chicken Nuggets', 'Breaded chicken nuggets with dipping sauce', 5.99, TRUE, 'https://example.com/images/chicken_nuggets.jpg', 'Non-Veg'),
(6, 'Iced Tea', 'Refreshing iced tea with lemon', 2.49, TRUE, 'https://example.com/images/iced_tea.jpg', 'Drink'),
(6, 'Apple Pie', 'Classic apple pie with cinnamon', 4.99, TRUE, 'https://example.com/images/apple_pie.jpg', 'Dessert'),
(7, 'California Roll', 'Crab, avocado, cucumber roll', 8.99, TRUE, 'https://example.com/images/california_roll.jpg', 'Main Course'),
(7, 'Spicy Tuna Roll', 'Spicy tuna with cucumber', 9.49, TRUE, 'https://example.com/images/spicy_tuna_roll.jpg', 'Main Course'),
(7, 'Avocado Roll', 'Simple roll with fresh avocado', 6.99, TRUE, 'https://example.com/images/avocado_roll.jpg', 'Vegetable'),
(7, 'Salmon Sashimi', 'Slices of fresh salmon', 12.99, TRUE, 'https://example.com/images/salmon_sashimi.jpg', 'Non-Veg'),
(7, 'Edamame', 'Steamed and salted soybeans', 4.99, TRUE, 'https://example.com/images/edamame.jpg', 'Vegetable'),
(7, 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 3.99, TRUE, 'https://example.com/images/miso_soup.jpg', 'Appetizer'),
(7, 'Tempura Shrimp', 'Crispy fried shrimp tempura', 10.99, TRUE, 'https://example.com/images/tempura_shrimp.jpg', 'Non-Veg'),
(7, 'Chicken Teriyaki', 'Grilled chicken with teriyaki sauce', 11.99, TRUE, 'https://example.com/images/chicken_teriyaki.jpg', 'Non-Veg'),
(7, 'Vegetable Tempura', 'Assorted fried vegetables in tempura batter', 8.99, TRUE, 'https://example.com/images/vegetable_tempura.jpg', 'Vegetable'),
(7, 'Green Tea', 'Traditional Japanese green tea', 2.49, TRUE, 'https://example.com/images/green_tea.jpg', 'Drink'),
(8, 'Spaghetti Carbonara', 'Pasta with bacon, egg, and cheese sauce', 12.99, TRUE, 'https://example.com/images/spaghetti_carbonara.jpg', 'Main Course'),
(8, 'Fettuccine Alfredo', 'Pasta with creamy Alfredo sauce', 11.99, TRUE, 'https://example.com/images/fettuccine_alfredo.jpg', 'Main Course'),
(8, 'Lasagna', 'Layered pasta with meat and cheese', 13.99, TRUE, 'https://example.com/images/lasagna.jpg', 'Main Course'),
(8, 'Penne Arrabbiata', 'Spicy tomato sauce with garlic and chili', 10.99, TRUE, 'https://example.com/images/penne_arrabbiata.jpg', 'Main Course'),
(8, 'Bruschetta', 'Tomato and basil on toasted bread', 5.99, TRUE, 'https://example.com/images/bruschetta.jpg', 'Appetizer'),
(8, 'Minestrone Soup', 'Classic Italian vegetable soup', 6.99, TRUE, 'https://example.com/images/minestrone_soup.jpg', 'Vegetable'),
(8, 'Caprese Salad', 'Tomato, mozzarella, and basil', 8.99, TRUE, 'https://example.com/images/caprese_salad.jpg', 'Vegetable'),
(8, 'Tiramisu', 'Coffee-flavored Italian dessert', 7.49, TRUE, 'https://example.com/images/tiramisu.jpg', 'Dessert'),
(9, 'Garlic Bread', 'Toasted bread with garlic butter', 4.49, TRUE, 'https://example.com/images/garlic_bread.jpg', 'Breads'),
(9, 'Espresso', 'Strong Italian coffee', 2.99, TRUE, 'https://example.com/images/espresso.jpg', 'Drink'),
(9, 'California Roll', 'Crab, avocado, cucumber roll', 8.99, TRUE, 'https://example.com/images/california_roll.jpg', 'Main Course'),
(9, 'Spicy Tuna Roll', 'Spicy tuna with cucumber', 9.49, TRUE, 'https://example.com/images/spicy_tuna_roll.jpg', 'Main Course'),
(9, 'Avocado Roll', 'Simple roll with fresh avocado', 6.99, TRUE, 'https://example.com/images/avocado_roll.jpg', 'Vegetable'),
(9, 'Salmon Sashimi', 'Slices of fresh salmon', 12.99, TRUE, 'https://example.com/images/salmon_sashimi.jpg', 'Non-Veg'),
(10, 'Hot Chocolate', 'Creamy hot chocolate with whipped cream', 3.49, TRUE, 'https://example.com/images/hot_chocolate.jpg', 'Drink'),
(10, 'Blueberry Muffin', 'Fresh blueberry muffin', 2.99, TRUE, 'https://example.com/images/blueberry_muffin.jpg', 'Dessert'),
(10, 'Croissant', 'Buttery French croissant', 2.49, TRUE, 'https://example.com/images/croissant.jpg', 'Breads'),
(10, 'Grilled Cheese', 'Classic grilled cheese sandwich', 4.99, TRUE, 'https://example.com/images/grilled_cheese.jpg', 'Main Course'),
(10, 'Tomato Soup', 'Creamy tomato soup', 3.99, TRUE, 'https://example.com/images/tomato_soup.jpg', 'Vegetable');

