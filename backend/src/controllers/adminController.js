const prisma = require('../utils/prisma');
const { paginationSchema } = require('../utils/validation');

// Get all customers with booking counts (admin only)
const getAllCustomers = async (req, res, next) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: { in: ['approved', 'completed'] },
              },
            },
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const totalCount = await prisma.user.count({
      where: { role: 'customer' },
    });

    res.json({
      customers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('❌ getAllCustomers error:', error);
    next(error);
  }
};

// Get admin dashboard metrics overview
const getMetricsOverview = async (req, res, next) => {
  try {
    const [
      totalRevenue,
      totalBookings,
      totalCustomers,
      activePackages,
      pendingBookings,
      approvedBookings,
      cancelledBookings,
      completedBookings,
    ] = await Promise.all([
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ['approved', 'completed'] } },
      }),
      prisma.booking.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.package.count({ where: { active: true } }),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'approved' } }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.count({ where: { status: 'completed' } }),
    ]);

    res.json({
      overview: {
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalBookings,
        totalCustomers,
        activePackages,
      },
      bookingStats: {
        pendingBookings,
        approvedBookings,
        cancelledBookings,
        completedBookings,
      },
    });
  } catch (error) {
    console.error('❌ getMetricsOverview error:', error);
    next(error);
  }
};

// Get metrics trends for charts
const getMetricsTrends = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: { gte: twelveMonthsAgo },
      },
      select: { bookingDate: true },
    });

    const bookingsPerMonth = {};
    bookings.forEach(booking => {
      if (booking.bookingDate) {
        const month = `${booking.bookingDate.getFullYear()}-${String(booking.bookingDate.getMonth() + 1).padStart(2, '0')}`;
        bookingsPerMonth[month] = (bookingsPerMonth[month] || 0) + 1;
      }
    });

    const bookingsPerMonthArray = Object.keys(bookingsPerMonth).sort().map(month => ({
      month,
      count: bookingsPerMonth[month],
    }));

    // Revenue trend
    const revenueBookings = await prisma.booking.findMany({
      where: {
        bookingDate: { gte: twelveMonthsAgo },
        status: { in: ['approved', 'completed'] },
      },
      select: { bookingDate: true, totalPrice: true },
    });

    const revenueTrend = {};
    revenueBookings.forEach(booking => {
      if (booking.bookingDate && booking.totalPrice) {
        const month = `${booking.bookingDate.getFullYear()}-${String(booking.bookingDate.getMonth() + 1).padStart(2, '0')}`;
        revenueTrend[month] = (revenueTrend[month] || 0) + booking.totalPrice;
      }
    });

    const revenueTrendArray = Object.keys(revenueTrend).sort().map(month => ({
      month,
      revenue: revenueTrend[month],
    }));

    // Top packages
    const topPackages = await prisma.booking.groupBy({
      by: ['packageId'],
      _count: { id: true },
      _sum: { totalPrice: true },
      orderBy: [{ _count: { id: 'desc' } }],
      take: 10,
    });

    const topPackagesWithDetails = await Promise.all(
      topPackages.map(async (pkg) => {
        if (!pkg.packageId) return null;
        const packageData = await prisma.package.findUnique({
          where: { id: pkg.packageId },
          select: { title: true, slug: true, price: true },
        });
        return {
          packageId: pkg.packageId,
          packageTitle: packageData?.title || 'Unknown',
          packageSlug: packageData?.slug || 'unknown',
          bookingCount: pkg._count.id,
          totalRevenue: pkg._sum.totalPrice || 0,
          averagePrice: packageData?.price || 0,
        };
      })
    );

    // Customer growth
    const customers = await prisma.user.findMany({
      where: {
        createdAt: { gte: twelveMonthsAgo },
        role: 'customer',
      },
      select: { createdAt: true },
    });

    const customerGrowth = {};
    customers.forEach(customer => {
      if (customer.createdAt) {
        const month = `${customer.createdAt.getFullYear()}-${String(customer.createdAt.getMonth() + 1).padStart(2, '0')}`;
        customerGrowth[month] = (customerGrowth[month] || 0) + 1;
      }
    });

    const customerGrowthArray = Object.keys(customerGrowth).sort().map(month => ({
      month,
      count: customerGrowth[month],
    }));

    res.json({
      bookingsPerMonth: bookingsPerMonthArray,
      revenueTrend: revenueTrendArray,
      topPackages: topPackagesWithDetails.filter(Boolean),
      customerGrowth: customerGrowthArray,
    });
  } catch (error) {
    console.error('❌ Dashboard trends error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard trends', details: error.message });
  }
};

// Get recent activity (admin only)
const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const recentBookings = await prisma.booking.findMany({
      take: limit,
      orderBy: { bookingDate: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        package: { select: { title: true, slug: true } },
      },
    });

    const recentReviews = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true } },
        package: { select: { title: true, slug: true } },
      },
    });

    const activities = [
      ...recentBookings.map(booking => ({
        type: 'booking',
        id: booking.id,
        message: `${booking.customer.name} booked ${booking.package.title}`,
        date: booking.bookingDate,
        status: booking.status,
        amount: booking.totalPrice,
      })),
      ...recentReviews.map(review => ({
        type: 'review',
        id: review.id,
        message: `${review.customer.name} reviewed ${review.package.title}`,
        date: review.createdAt,
        rating: review.rating,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

    res.json({ activities });
  } catch (error) {
    console.error('❌ getRecentActivity error:', error);
    next(error);
  }
};

// Get system health metrics (admin only)
const getSystemHealth = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalPackages,
      inactivePackages,
      totalBookings,
      totalReviews,
      averageBookingValue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.package.count(),
      prisma.package.count({ where: { active: false } }),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.booking.aggregate({
        _avg: { totalPrice: true },
        where: { status: { in: ['approved', 'completed'] } },
      }),
    ]);

    res.json({
      systemHealth: {
        totalUsers,
        activeUsers,
        totalPackages,
        inactivePackages,
        totalBookings,
        totalReviews,
        averageBookingValue: averageBookingValue._avg.totalPrice || 0,
        packageUtilizationRate: totalPackages > 0 ? ((totalPackages - inactivePackages) / totalPackages * 100) : 0,
      },
    });
  } catch (error) {
    console.error('❌ getSystemHealth error:', error);
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getMetricsOverview,
  getMetricsTrends,
  getRecentActivity,
  getSystemHealth,
};
