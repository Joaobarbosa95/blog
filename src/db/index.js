const { Pool, Client } = require("pg");
require("dotenv").config();

function tablesCreation() {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      });

      await client.connect();

      await client.query(`
        CREATE TABLE IF NOT EXISTS  author (
          authorId SERIAL PRIMARY KEY,
          username VARCHAR(20) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          hashed_password VARCHAR(60) NOT NULL
        );`);

      await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          postId SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          text TEXT NOT NULL,
          description TEXT NOT NULL,
          createdAt TIMESTAMP NOT NULL,
          author INT NOT NULL,
          CONSTRAINT fk_author
          FOREIGN KEY(author) 
          REFERENCES author(authorId)
          ON DELETE CASCADE
          );`);

      await client.end();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

tablesCreation();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = {
  query: async (text, params) => {
    const res = await pool.query(text, params);
    return res;
  },
};
