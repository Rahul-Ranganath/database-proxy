import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Load the database schema from the schema.json file
const schema = require('./schema.json');

// Initialize the SQLite database
const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
      console.error("Error opening database " + err.message);
  }});

// Function to create the table and its columns if not already present in the database
function createTableIfNotExists(collection: string) {
  const columns = schema.collections[collection];
  const col_len = Object.keys(columns).length;
  var count = 0;
  let columnsQuery = '';
  for (const column in columns) {
    count += 1;
    if (count == col_len){
      columnsQuery += `${column} ${columns[column]}`;
    }
    else{
      columnsQuery += `${column} ${columns[column]}, `;
    }
    
  }

  const query = `CREATE TABLE IF NOT EXISTS ${collection} (${columnsQuery})`;
  db.run(query, function (err) {
    if (err) {
      console.error(err);
    }});
}



// Middleware to check if the table exists and create it if not
function ensureTableExists(req: Request, res: Response, next: NextFunction) {
  const collection = req.params.collection;
  createTableIfNotExists(collection);
  next();
}

// Create endpoint
app.post('/:collection', ensureTableExists, (req: Request, res: Response) => {
  const collection = req.params.collection;
  const data = req.body;
  const columns = Object.keys(data).join(',');
  const placeholders = Object.keys(data).map(() => '?').join(',');

  db.run(`INSERT INTO ${collection} (${columns}) VALUES (${placeholders})`, Object.values(data), function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error inserting data into the database.');
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Read endpoint
app.get('/:collection/:id', ensureTableExists, (req: Request, res: Response) => {
  const collection = req.params.collection;
  const id = req.params.id;

  db.get(`SELECT * FROM ${collection} WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data from the database.');
    }
    if (!row) {
      return res.status(404).send('Data not found.');
    }
    res.json(row);
  });
});

// Update endpoint
app.post('/:collection/:id', ensureTableExists, (req: Request, res: Response) => {
  const collection = req.params.collection;
  const id = req.params.id;
  const data = req.body;

  const columns = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(', ');

  const values = Object.values(data);
  //console.log("no id: ", values);
  values.push(id);
  //console.log("with id: ", values);


  db.run(`UPDATE ${collection} SET ${columns} WHERE id = ?`, values, function (err) {
    //console.log("changes: ",this.changes);
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating data in the database.');
    }
    if (this.changes === 0) {
      return res.status(404).send('Could not find row to update.');
    }
    res.sendStatus(200);
  });
});

// Delete endpoint
app.delete('/:collection/:id', ensureTableExists, (req: Request, res: Response) => {
  const collection = req.params.collection;
  const id = req.params.id;

  db.run(`DELETE FROM ${collection} WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting data from the database.');
    }
    if (this.changes === 0) {
      return res.status(404).send('Data not found.');
    }
    res.sendStatus(204);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
