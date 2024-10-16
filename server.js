const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception');
  console.log(err);
  process.exit(1);
});

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
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
