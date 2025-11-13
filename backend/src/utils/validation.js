const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]{10,15}$/).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Package validation schemas
const packageSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  slug: Joi.string().min(3).max(100).required(),
  shortDesc: Joi.string().max(300).allow('').optional(),
  overview: Joi.string().allow('').optional(),
  price: Joi.alternatives().try(Joi.number().positive(), Joi.string().pattern(/^\d+(\.\d+)?$/)).required(),
  currency: Joi.string().default('INR'),
  active: Joi.boolean().default(true),
  images: Joi.array().items(Joi.string()).optional(),
  duration: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  maxGroupSize: Joi.alternatives().try(Joi.number().integer().min(1), Joi.string().pattern(/^\d+$/)).optional(),
  difficulty: Joi.string().valid('Easy', 'Moderate', 'Challenging', 'Difficult').optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  itinerary: Joi.array().items(Joi.string()).optional(),
  inclusions: Joi.array().items(Joi.string()).optional(),
  exclusions: Joi.array().items(Joi.string()).optional(),
});

const updatePackageSchema = packageSchema.fork(['title', 'slug', 'price'], (schema) => schema.optional()).keys({
  images: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  price: Joi.alternatives().try(Joi.number().positive(), Joi.string().pattern(/^\d+(\.\d+)?$/)).optional(),
  highlights: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  itinerary: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  inclusions: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  exclusions: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
});

// Booking validation schemas
const bookingSchema = Joi.object({
  packageId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).default(1),
  travelStart: Joi.date().optional(),
  notes: Joi.string().max(500).optional(),
});

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'cancelled', 'completed').required(),
});

// Review validation schemas
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).optional(),
});

// Query validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().min(1).max(100).optional(),
  sortBy: Joi.string().valid('featured', 'price-low', 'price-high', 'rating-high', 'rating-low', 'newest', 'oldest').optional(),
}).unknown(true);

const searchSchema = Joi.object({
  search: Joi.string().min(1).max(100).optional(),
}).unknown(true);

const sortSchema = Joi.object({
  sortBy: Joi.string().valid('featured', 'price-low', 'price-high', 'rating-high', 'rating-low', 'newest', 'oldest').optional(),
}).unknown(true);

module.exports = {
  registerSchema,
  loginSchema,
  packageSchema,
  updatePackageSchema,
  bookingSchema,
  updateBookingStatusSchema,
  reviewSchema,
  paginationSchema,
  searchSchema,
  sortSchema,
};
