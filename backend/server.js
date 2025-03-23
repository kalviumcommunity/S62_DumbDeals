if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./DB/mysql.js')
const { setupDatabase, seedDatabase } = require('./models/mysql-schema.js')

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8080;

// Initialize database
async function initDatabase() {
    const connected = await testConnection();
    if (connected) {
        await setupDatabase();
        await seedDatabase();
    }
}
initDatabase();
// Home route to check database connection
app.get('/', async (req, res) => {
    const connected = await testConnection();
    res.send(`<h3>Database Connection Status: ${connected ? 'connected' : 'disconnected'}</h3>`);
});

// Routes
app.use('/user-router', require('./mysqlRoutes/usersRoute.js'));
app.use('/product-router', require('./mysqlRoutes/productsRoute.js'));

app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});