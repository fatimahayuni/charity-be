-- CREATE DATABASE charity_ecommerce;

USE charity_ecommerce;

-- Create Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('donor', 'admin') NOT NULL DEFAULT 'donor',
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Campaigns Table
CREATE TABLE campaigns (
  campaign_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  media_url VARCHAR(255),
  target_amount DECIMAL(10,2) NOT NULL,   -- Target amount for the campaign
  current_amount DECIMAL(10,2) DEFAULT 0,  -- Current amount raised
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  campaign_status ENUM('active', 'inactive', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
  urgency_level ENUM('low', 'medium', 'high') DEFAULT 'low',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (end_date >= start_date),
  CHECK (target_amount >= 0),
  CHECK (current_amount >= 0)
);

CREATE INDEX idx_campaign_status ON campaigns(campaign_status);

-- Create Labels Table
CREATE TABLE labels (
  label_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Insert predefined values for the labels table
INSERT INTO labels (name) VALUES
('Orphans'),
('Education'),
('Basic Needs'),
('Civil Infrastructure');

-- Create Campaign Labels Table
CREATE TABLE campaign_labels (
  campaign_id INT NOT NULL,
  label_id INT NOT NULL,
  PRIMARY KEY (campaign_id, label_id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(label_id) ON DELETE CASCADE
);

-- Create Pledge Amounts Table
CREATE TABLE pledge_amounts (
    pledge_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,  -- Pledge amount for donation
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (amount > 0)
);

-- Create Cart Items Table
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  campaign_id INT NOT NULL,
  pledge_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  FOREIGN KEY (pledge_id) REFERENCES pledge_amounts(pledge_id),
  UNIQUE(user_id, campaign_id, pledge_id)
);

-- Create Orders Table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                 -- FK to Users table
    donor_type ENUM('individual', 'corporate') DEFAULT 'individual',
    campaign_id INT NOT NULL,             -- FK to Campaigns table
    pledge_id INT NOT NULL,               -- FK to Pledge Amounts table
    order_amount DECIMAL(10, 2) NOT NULL, -- Total order amount
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    receipt_url VARCHAR(255),             -- URL for receipt (optional)
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending', -- Status of the order
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (pledge_id) REFERENCES pledge_amounts(pledge_id),
    UNIQUE (receipt_url)
);

CREATE INDEX idx_status_date ON orders (status, order_date);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,            -- Unique identifier for the order item
  order_id INT NOT NULL,                        -- Foreign Key referencing the order
  campaign_id INT NOT NULL,                     -- Foreign Key referencing the campaign
  pledge_id INT NOT NULL,                       -- Foreign Key referencing the pledge amount
  item_amount DECIMAL(10, 2) NOT NULL,          -- Amount donated for this specific item (campaign/pledge)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the order item was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for updates
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE, -- Link to the order
  FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id) ON DELETE CASCADE, -- Link to the campaign
  FOREIGN KEY (pledge_id) REFERENCES pledge_amounts(pledge_id) ON DELETE CASCADE  -- Link to the pledge amount
);






