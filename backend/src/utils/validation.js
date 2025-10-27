const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
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
  shortDesc: Joi.string().max(300).optional(),
  overview: Joi.string().optional(),
  itinerary: Joi.object().optional(),
  inclusions: Joi.object().optional(),
  price: Joi.number().positive().required(),
  currency: Joi.string().default('INR'),
  images: Joi.object().optional(),
  active: Joi.boolean().default(true),
});

const updatePackageSchema = packageSchema.fork(['title', 'slug', 'price'], (schema) => schema.optional());

// Booking validation schemas
const bookingSchema = Joi.object({
  packageId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).default(1),
  travelStart: Joi.date().optional(),
  travelEnd: Joi.date().optional(),
  notes: Joi.string().max(500).optional(),
});

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'cancelled', 'completed').required(),
});

// Review validation schemas
const reviewSchema = Joi.object({
  packageId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).optional(),
});

// Query validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const searchSchema = Joi.object({
  search: Joi.string().min(1).max(100).optional(),
});

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
};
