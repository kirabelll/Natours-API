const { json } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFesture');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
// Route handlers

exports.aliasTop = (req, res, next) => {
  (req.query.limit = '5'),
    (req.query.sort = '-ratingAvarage'),
    (req.query.fileds = 'name, price,ratingAvarage, summery, difficlty'),
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .Pagination();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
});

exports.getTour = catchAsync(async (req, res, next ) => {
    const tour = await Tour.findById(req.params.id);  
    if(!tour) {
      return next(new AppError('No tour found with that ID',404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
});

exports.updateTours = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour) {
      return next(new AppError('No tour found with that ID',404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
});

exports.deleteTours = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour) {
      return next(new AppError('No tour found with that ID',404))
    }
    res.status(204).json({
      status: 'success',
      data: tour,
    });
});


exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tours: newTour,
      },
    })
});


exports.getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAvarage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$reatingQuantity' },
          avgRating: { $avg: '$ratingsAvarage' },
          avgPrice: { $avg: '$price' },
          minprice: { $min: '$price' },
          maxprice: { $max: '$price' },
        },

        sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDate',
      },
      {
        $match: {
          startDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDate' },
          numTourStart: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStart: -1 },
      },
      {
        $limit: 13,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
});

