const prisma = require('../utils/prisma');
const { bookingSchema, updateBookingStatusSchema, paginationSchema } = require('../utils/validation');

// Create new booking (customer only)
const createBooking = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { packageId, quantity, travelStart, travelEnd, notes } = value;

    // Get package details to calculate total price
    const package = await prisma.package.findUnique({
      where: { id: packageId, active: true },
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found or inactive' });
    }

    const totalPrice = package.price * quantity;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        packageId,
        quantity,
        totalPrice,
        travelStart: travelStart ? new Date(travelStart) : null,
        travelEnd: travelEnd ? new Date(travelEnd) : null,
        notes,
      },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
            images: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's own bookings (customer only)
const getMyBookings = async (req, res, next) => {
  try {
    // Validate pagination
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
            images: true,
          },
        },
      },
      orderBy: { bookingDate: 'desc' },
      skip,
      take: limit,
    });

    const totalCount = await prisma.booking.count({
      where: { customerId: req.user.id },
    });

    res.json({
      bookings,
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

// Get all bookings (admin only)
const getAllBookings = async (req, res, next) => {
  try {
    // Validate pagination
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const bookings = await prisma.booking.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
          },
        },
      },
      orderBy: { bookingDate: 'desc' },
      skip,
      take: limit,
    });

    const totalCount = await prisma.booking.count();

    res.json({
      bookings,
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

// Get booking by ID (admin or booking owner)
const getBookingById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
            overview: true,
            itinerary: true,
            inclusions: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is admin or booking owner
    if (req.user.role !== 'admin' && booking.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Validate input
    const { error, value } = updateBookingStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { status } = value;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
          },
        },
      },
    });

    res.json({
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get booking statistics (admin only)
const getBookingStats = async (req, res, next) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      approvedBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'approved' } }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ['approved', 'completed'] } },
      }),
    ]);

    res.json({
      stats: {
        totalBookings,
        pendingBookings,
        approvedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
};
