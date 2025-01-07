-- Insert sample data into the users table
INSERT INTO users (username, email, password, role, first_name, last_name) VALUES
('john_doe', 'john@example.com', 'password123', 'donor', 'John', 'Doe'),
('jane_admin', 'jane@example.com', 'adminpass', 'admin', 'Jane', 'Smith'),
('michael_donor', 'michael@example.com', 'password456', 'donor', 'Michael', 'Brown');

-- Insert sample data into the campaigns table
INSERT INTO campaigns (title, description, media_url, target_amount, current_amount, start_date, end_date, campaign_status, urgency_level) VALUES
('Education for All', 'Providing educational resources to underprivileged children.', 'https://example.com/image1.jpg', 5000.00, 1000.00, '2024-01-01', '2024-12-31', 'active', 'high'),
('Clean Water Project', 'Building wells in remote areas.', 'https://example.com/image2.jpg', 10000.00, 2500.00, '2024-02-01', '2024-11-30', 'active', 'medium'),
('Healthcare Access', 'Improving healthcare access in rural areas.', 'https://example.com/image3.jpg', 8000.00, 4000.00, '2024-03-01', '2024-10-31', 'active', 'low');

-- Insert sample data into the labels table
INSERT INTO labels (name) VALUES
('Orphans'),
('Education'),
('Basic Needs'),
('Civil Infrastructure');

-- Insert sample data into the campaign_labels table
INSERT INTO campaign_labels (campaign_id, label_id) VALUES
(1, 2),
(2, 4),
(3, 3);

-- Insert sample data into the pledge_amounts table
INSERT INTO pledge_amounts (amount, description) VALUES
(50.00, 'Basic contribution'),
(100.00, 'Supporter contribution'),
(250.00, 'Major donor contribution');

-- Insert sample data into the cart_items table
INSERT INTO cart_items (user_id, campaign_id, pledge_id) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 3);

-- Insert sample data into the orders table
INSERT INTO orders (user_id, donor_type, campaign_id, pledge_id, order_amount, receipt_url, status) VALUES
(1, 'individual', 1, 1, 50.00, 'https://example.com/receipt1.pdf', 'completed'),
(2, 'corporate', 3, 3, 250.00, 'https://example.com/receipt2.pdf', 'pending'),
(3, 'individual', 2, 2, 100.00, 'https://example.com/receipt3.pdf', 'completed');
