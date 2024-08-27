const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError')
const userRouter = require('./routes/usersRoutes');
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controller/errorController')

// middleware
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV ==='development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); 

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);


// Server
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
