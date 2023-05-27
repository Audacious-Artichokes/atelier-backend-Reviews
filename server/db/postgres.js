const { Pool, Client } = require('pg');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const csv = require('csv-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// eslint-disable-next-line import/prefer-default-export
const reviewPool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  port: process.env.DBPORT,
});


async function connectAndCreateSchema() {
  const client = new Client({
    database: 'reviews',
  });

  try {
    await client.connect();
    console.log('Database connection successful');
    // Rest of your code...
  } catch (error) {
    console.error('Error connecting to database:', error);
  }

  await client.query(`
    CREATE TABLE revs (
    id SERIAL primary key,
    product_id int,
    rating int,
    date bigint,
    summary varchar(500),
    body varchar(500),
    recommend boolean,
    reported boolean,
    reviewer_name varchar(500),
    reviewer_email varchar(500),
    response varchar(500) null,
    helpfulness int
  );

  CREATE TABLE chars (
    id SERIAL primary key,
    characteristic_id SERIAL,
    review_id int REFERENCES revs(id),
    value int
  )
    CREATE TABLE revPhotos (
      id SERIAL PRIMARY KEY,
      review_id INT REFERENCES revs(id),
      url VARCHAR(500)
    )
  `);
  client.end();
}

module.exports = reviewPool;
// connectAndCreateSchema();
// connectAndCreateSchema().then(async () => {
//   const client = new Client({
//     database: 'reviews',
//   });
//   await client.connect();
//   const csvFile = `${__dirname}/reviews.csv`;
//   await client.query('BEGIN');

//   await client.query(`
// eslint-disable-next-line max-len
//         COPY revs(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
//         FROM '${csvFile}' DELIMITER ',' CSV HEADER
//       `);

//   await client.query('COMMIT');

//   await client.end();
//   console.log('Database connection closed');
//   process.exit(0);
// });
// });
