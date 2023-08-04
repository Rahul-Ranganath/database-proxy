# Database-proxy
This project implements a REST API for CRUD operations on a SQL database using Node.js and TypeScript. The API allows you to create, read, update, and delete records in the database based on a specified schema.

# Getting Started
Follow these steps to set up and run the project on your local machine.

# Prerequisites
Node.js (>=12.0.0) <br>
npm (Node Package Manager)

# Installation
**1. Clone the repository:** <br>
git clone https://github.com/srahulrm96/database-proxy.git <br>
cd db-proxy

**2. Install dependencies:** <br>
npm install

# Usage
**1. Start the server:** <br>
npx ts-node index.ts <br>
This will start the server and create the necessary tables in an SQLite database based on the provided schema. <br>

**2. Access the API endpoints:**<br>
Use **Postman** to access the following endpoints<br>

Create a new record:<br>
POST -> http://localhost:3000/:collection<br>
Read a record by ID:<br>
GET -> http://localhost:3000/:collection/:id<br>
Update a record by ID:<br>
POST -> http://localhost:3000/:collection/:id<br>
Delete a record by ID:<br>
DELETE -> http://localhost:3000/:collection/:id<br>

# Schema Configuration
The schema for the database is defined in the schema.json file. This file specifies the collections and their respective columns.

# Test
Run '**npm test**' to run the automated tests to test the working of the business logic implementation, namely the CRUD operations and table creation logic.

# Running in a Concurrent Environment
To run this application in a concurrent environment (e.g., multiple requests or users interacting with the API simultaneously), we might need to consider the following changes:

**Database Connections**: In a concurrent environment, managing database connections becomes crucial. We might need to implement a connection pool to efficiently handle multiple incoming requests.

**Transactions:** For operations that involve multiple database actions (e.g., updating multiple tables), we need to consider using database transactions to ensure data consistency and integrity.

**Caching:** Depending on the use case, caching mechanisms (e.g., Redis) can help reduce the load on our database by serving frequently requested data from memory.

**Error Handling:** Robust error handling becomes even more important in a concurrent environment. We need to make sure to handle errors gracefully and provide meaningful error responses to clients.

**Testing:** Write comprehensive tests, including stress and concurrency tests, to ensure that our application functions correctly and efficiently under varying levels of load.

# Further Enhancements
The automated tests are designed to run tests specifically for the 'users' collection from the schema.json. We will need to alter the tests to be able to test for other schema representations.
