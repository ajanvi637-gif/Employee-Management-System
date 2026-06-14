CREATE DATABASE employee_management;
USE employee_management;

CREATE TABLE employees(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
phone VARCHAR(20),
department VARCHAR(100),
designation VARCHAR(100),
username VARCHAR(100) UNIQUE,
password VARCHAR(255)
);

CREATE TABLE tasks(
id INT PRIMARY KEY AUTO_INCREMENT,
employee_id INT,
task_title VARCHAR(255),
task_description TEXT,
status VARCHAR(50) DEFAULT 'Pending',
priority VARCHAR(50),

due_date DATE,
assigned_date TIMESTAMP
DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(employee_id)
REFERENCES employees(id)
ON DELETE CASCADE

);

-- Employee Management System
-- Database Schema

