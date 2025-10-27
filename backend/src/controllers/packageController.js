const prisma = require('../utils/prisma');
const { packageSchema, updatePackageSchema, paginationSchema, searchSchema } = require('../utils/validation');

// Get all active packages with optional search and pagination
const getAllPackages = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error: paginationError, value: pagination } = paginationSchema.validate(req.query);
    const { error: searchError, value: search } = searchSchema.validate(req.query);

    if (paginationError || searchError) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const { page, limit } = pagination;
    const { search: searchTerm } = search;

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = {
      active: true,
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { shortDesc: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
    };

    // Get packages with review count and average rating
    const packages = await prisma.package.findMany({
      where,
      include: {
        _count: {
          select: { reviews: true, bookings: true },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Calculate average rating for each package
    const packagesWithRating = packages.map(pkg => ({
      ...pkg,
      averageRating: pkg.reviews.length > 0
        ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length
        : 0,
      reviewCount: pkg._count.reviews,
      bookingCount: pkg._count.bookings,
    }));

    // Get total count for pagination
    const totalCount = await prisma.package.count({ where });

    res.json({
      packages: packagesWithRating,
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

// Get package by slug with full details including reviews
const getPackageBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const package = await prisma.package.findUnique({
      where: { slug, active: true },
      include: {
        reviews: {
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
        },
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    });

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Calculate average rating
    const averageRating = package.reviews.length > 0
      ? package.reviews.reduce((sum, review) => sum + review.rating, 0) / package.reviews.length
      : 0;

    res.json({
      package: {
        ...package,
        averageRating,
        reviewCount: package._count.reviews,
        bookingCount: package._count.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new package (admin only)
const createPackage = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = packageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const packageData = {
      ...value,
      createdBy: req.user.id, // Set creator from authenticated user
    };

    const package = await prisma.package.create({
      data: packageData,
      include: {
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    });

    res.status(201).json({
      message: 'Package created successfully',
      package,
    });
  } catch (error) {
    next(error);
  }
};

// Update package (admin only)
const updatePackage = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Validate input
    const { error, value } = updatePackageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const package = await prisma.package.update({
      where: { id },
      data: value,
      include: {
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    });

    res.json({
      message: 'Package updated successfully',
      package,
    });
  } catch (error) {
    next(error);
  }
};

// Delete package (admin only)
const deletePackage = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.package.delete({
      where: { id },
    });

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all packages for admin (including inactive ones)
const getAllPackagesAdmin = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error: paginationError, value: pagination } = paginationSchema.validate(req.query);
    if (paginationError) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const packages = await prisma.package.findMany({
      include: {
        _count: {
          select: { reviews: true, bookings: true },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Calculate average rating for each package
    const packagesWithRating = packages.map(pkg => ({
      ...pkg,
      averageRating: pkg.reviews.length > 0
        ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length
        : 0,
      reviewCount: pkg._count.reviews,
      bookingCount: pkg._count.bookings,
    }));

    const totalCount = await prisma.package.count();

    res.json({
      packages: packagesWithRating,
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
  getAllPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
  getAllPackagesAdmin,
};
