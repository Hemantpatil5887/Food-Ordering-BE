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