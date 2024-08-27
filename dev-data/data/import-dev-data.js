const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const { isErrored } = require('stream');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB conncetion successful'));

//   read file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data to database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit()
};

//delete all data from db

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit()
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
    deleteData()
}
