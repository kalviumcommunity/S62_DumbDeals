const { pool } = require('../DB/mysql.js')

async function setupDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // Create products table with foreign key to users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        console.log('Database schema setup completed');
        connection.release();
    } catch (error) {
        console.error('Error setting up database schema:', error);
    }
}

async function seedDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Check if users already exist
        const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
        if (userRows[0].count > 0) {
            console.log('Database already seeded');
            connection.release();
            return;
        }
        
        // Create users with bcrypt-hashed passwords (all passwords are 'password123')
        const hashedPassword = '$2a$10$qnTGFJCWLQw3RsYlJKm7xeP7QxLkar/Y1G4KMPEgd74iPeJTQTgJm';
        await connection.query(`
            INSERT INTO users (name, email, password) VALUES
            ('John Doe', 'john@example.com', '${hashedPassword}'),
            ('Jane Smith', 'jane@example.com', '${hashedPassword}'),
            ('Bob Johnson', 'bob@example.com', '${hashedPassword}')
        `);
        
        // Fetch the inserted users to get their IDs
        const [users] = await connection.query('SELECT id FROM users');
        
        // Create products by different users
        await connection.query(`
            INSERT INTO products (name, price, description, image, created_by) VALUES
            ('Noise-Cancelling Headphones for Arguments', 199.99, 'Tuned to block out only annoying conversations. Works 50% of the time, every time.', 'https://i.pinimg.com/474x/5d/d4/17/5dd417cdc87f02e6157616c35117bc74.jpg', ${users[0].id}),
            ('Gravity-Defying Heels', 299.99, 'Walk like you're in a sci-fi movie. Warning: May cause unexpected floating.', 'https://i.pinimg.com/736x/63/55/30/6355308434f7ef65c56c422d78b4c4ba.jpg', ${users[1].id}),
            ('Self-Refilling Coffee Cup', 149.99, 'Never run out of coffee again! Disclaimer: Only refills if you pour more coffee in.', 'https://i.pinimg.com/736x/bb/f9/03/bbf90307a0b38f6a255dc18828eb47a7.jpg', ${users[2].id})
        `);
        
        console.log('Database seeded successfully');
        connection.release();
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

module.exports = { setupDatabase, seedDatabase };
