const prisma = require('../utils/prisma');
const { paginationSchema } = require('../utils/validation');

// Get all customers with booking counts (admin only)
const getAllCustomers = async (req, res, next) => {
  try {
    // Validate pagination
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
    next(error);
  }
};

// Get metrics trends for charts
const getMetricsTrends = async (req, res, next) => {
  try {
    // Get bookings per month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const bookingsPerMonth = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "bookingDate") as month,
        COUNT(*) as count
      FROM "Booking"
      WHERE "bookingDate" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "bookingDate")
      ORDER BY month ASC
    `;

    // Get revenue trend (last 12 months)
    const revenueTrend = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "bookingDate") as month,
        SUM("totalPrice") as revenue
      FROM "Booking"
      WHERE "bookingDate" >= ${twelveMonthsAgo}
        AND "status" IN ('approved', 'completed')
      GROUP BY DATE_TRUNC('month', "bookingDate")
      ORDER BY month ASC
    `;

    // Get top packages by booking count
    const topPackages = await prisma.booking.groupBy({
      by: ['packageId'],
      _count: {
        id: true,
      },
      _sum: {
        totalPrice: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Get package details for top packages
    const topPackagesWithDetails = await Promise.all(
      topPackages.map(async (booking) => {
        const package = await prisma.package.findUnique({
          where: { id: booking.packageId },
          select: { title: true, slug: true, price: true },
        });
        return {
          packageId: booking.packageId,
          packageTitle: package?.title || 'Unknown',
          packageSlug: package?.slug || 'unknown',
          bookingCount: booking._count.id,
          totalRevenue: booking._sum.totalPrice || 0,
          averagePrice: package?.price || 0,
        };
      })
    );

    // Get customer growth (last 12 months)
    const customerGrowth = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${twelveMonthsAgo}
        AND "role" = 'customer'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    res.json({
      bookingsPerMonth,
      revenueTrend,
      topPackages: topPackagesWithDetails,
      customerGrowth,
    });
  } catch (error) {
    next(error);
  }
};

// Get recent activity (admin only)
const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: limit,
      orderBy: { bookingDate: 'desc' },
      include: {
        customer: {
          select: { name: true, email: true },
        },
        package: {
          select: { title: true, slug: true },
        },
      },
    });

    // Get recent reviews
    const recentReviews = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true },
        },
        package: {
          select: { title: true, slug: true },
        },
      },
    });

    // Combine and sort by date
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
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
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
