import { expect } from 'chai';
import sqlite3 from 'sqlite3';

//const schema = require('../schema.json');
const db = new sqlite3.Database(':memory:'); // Use an in-memory database for testing

interface TableColumn {
    name: string;
  }

describe('Table Creation', () => {
  it('should create tables with correct columns', (done) => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, age INTEGER)`, (err) => {
      expect(err).to.be.null;

      db.all(`PRAGMA table_info(users)`, (err, rows: TableColumn[]) => {
        expect(err).to.be.null;
        expect(rows).to.have.lengthOf(4);

        // Validate the columns
        const columns = rows.map((row) => row.name);
        expect(columns).to.include.members(['id', 'name', 'email', 'age']);

        done();
      });
    });
  });

});
