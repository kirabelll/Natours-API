const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'a tour name must have less or equal 40 character '],
      minlength: [10, 'a tour name must have less or equal 10 character '],
    },

    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration '],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },

    ratingsAvarage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 
    },
    reatingQuantity: {
      type: Number,
      default: 0,
    },
    price: { type: Number, required: [true, 'A tour must have a price '] },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDate: [Date],
    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// docment middlewire

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

// querymiddlewire

// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now()
//   next()
// });

// tourSchema.pre(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milleseconds`);
//   next();
// });

// // aggregation middlewire

// tourSchema.pre('aggregate', function (next) {
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
