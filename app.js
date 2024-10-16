const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const app = express();
const hpp = require('hpp')
const AppError = require('./utils/appError')
const userRouter = require('./routes/usersRoutes');
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controller/errorController')
// set security https, 
app.use(helmet())
// middleware
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV ==='development') {
  app.use(morgan('dev'));
}
// limit request from one ip
const limiter = rateLimit({
  max:100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this Ip, please try again in an hour"
}) 
// Prevent parameter pollution
app.use(hpp());


// 
app.use(mongoSanitize())


app.use(xss());

app.use('/api', limiter)
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
