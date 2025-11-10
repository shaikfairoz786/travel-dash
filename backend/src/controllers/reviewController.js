const prisma = require('../utils/prisma');
const { reviewSchema, paginationSchema } = require('../utils/validation');

// Create new review (customer only)
const createReview = async (req, res, next) => {
  const { packageId } = req.params;

  try {
    // Validate input
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { rating, comment } = value;

    // Check if package exists and is active
    const package = await prisma.package.findUnique({
      where: { id: packageId, active: true },
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found or inactive' });
    }

    // Check if user has already reviewed this package
    const existingReview = await prisma.review.findFirst({
      where: {
        packageId,
        customerId: req.user.id,
      },
    });

    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this package' });
    }

    // Check if user has an approved or completed booking for this package
    const eligibleBooking = await prisma.booking.findFirst({
      where: {
        customerId: req.user.id,
        packageId,
        status: { in: ['approved', 'completed'] },
      },
    });

    if (!eligibleBooking) {
      return res.status(403).json({ error: 'You can only review packages you have approved or completed bookings for' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        packageId,
        customerId: req.user.id,
        rating,
        comment,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews for a package
const getPackageReviews = async (req, res, next) => {
  const { packageId } = req.params;

  try {
    // Validate pagination
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    // Check if package exists
    const package = await prisma.package.findUnique({
      where: { id: packageId, active: true },
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found or inactive' });
    }

    const reviews = await prisma.review.findMany({
      where: { packageId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalCount = await prisma.review.count({
      where: { packageId },
    });

    // Calculate average rating
    const ratings = reviews.map(review => review.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        averageRating,
        totalReviews: totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update review (review owner only)
const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    // Validate input
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { rating, comment } = value;

    // Find review and check ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.customerId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own reviews' });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// Delete review (review owner or admin)
const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    // Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check permissions (owner or admin)
    if (review.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get user's reviews (customer only)
const getMyReviews = async (req, res, next) => {
  try {
    // Validate pagination
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where: { customerId: req.user.id },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalCount = await prisma.review.count({
      where: { customerId: req.user.id },
    });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getPackageReviews,
  updateReview,
  deleteReview,
  getMyReviews,
};
