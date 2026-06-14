const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const employeeRoutes = require("./backend/routes/employeeRoutes");

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 60000
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

// Make DB available everywhere
app.locals.db = db;

// Test Route
app.get("/", (req, res) => {
    res.send("Employee Management System API Running");
});

// USE ROUTES
app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});