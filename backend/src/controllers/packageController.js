const prisma = require('../utils/prisma');
const { packageSchema, updatePackageSchema, paginationSchema } = require('../utils/validation');

// Get all active packages with optional search and pagination
const getAllPackages = async (req, res, next) => {
  try {
    const { error: paginationError, value: pagination } = paginationSchema.validate(req.query);

    if (paginationError) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit, search: searchTerm, sortBy } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      active: true,
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { shortDesc: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
    };

    // Determine orderBy based on sortBy parameter
    let orderBy = { createdAt: 'desc' }; // default
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          orderBy = { price: 'asc' };
          break;
        case 'price-high':
          orderBy = { price: 'desc' };
          break;
        case 'rating-high':
          orderBy = [{ reviews: { _count: 'desc' } }, { createdAt: 'desc' }];
          break;
        case 'rating-low':
          orderBy = [{ reviews: { _count: 'asc' } }, { createdAt: 'desc' }];
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
      }
    }

    const packages = await prisma.package.findMany({
      where,
      include: {
        _count: { select: { reviews: true, bookings: true } },
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip,
      take: limit,
    });

    const packagesWithRating = packages.map(pkg => {
      // Transform images array to object format for frontend
      const transformedImages = pkg.images && pkg.images.length > 0 ? {
        main: pkg.images[0]
      } : undefined;

      return {
        ...pkg,
        images: transformedImages,
        averageRating: pkg.reviews.length > 0
          ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length
          : 0,
        reviewCount: pkg._count.reviews,
        bookingCount: pkg._count.bookings,
      };
    });

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

// Get package by slug (public)
const getPackageBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const pkg = await prisma.package.findUnique({
      where: { slug, active: true },
      include: {
        reviews: {
          include: {
            customer: {
              select: { id: true, name: true, createdAt: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const averageRating = pkg.reviews.length > 0
      ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length
      : 0;

    // Transform images array to object format for frontend
    const transformedImages = pkg.images && pkg.images.length > 0 ? {
      main: pkg.images[0],
      gallery: pkg.images.length > 1 ? pkg.images.slice(1) : []
    } : undefined;

    res.json({
      package: {
        ...pkg,
        images: transformedImages,
        averageRating,
        reviewCount: pkg._count.reviews,
        bookingCount: pkg._count.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ NEW: Get package by ID (admin only)
const getPackageById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            customer: {
              select: { id: true, name: true, createdAt: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const averageRating = pkg.reviews.length > 0
      ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length
      : 0;

    // Transform images array to object format for frontend
    const transformedImages = pkg.images && pkg.images.length > 0 ? {
      main: pkg.images[0],
      gallery: pkg.images.length > 1 ? pkg.images.slice(1) : []
    } : undefined;

    res.json({
      package: {
        ...pkg,
        images: transformedImages,
        averageRating,
        reviewCount: pkg._count.reviews,
        bookingCount: pkg._count.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new package (admin only)
const createPackage = async (req, res, next) => {
  try {
    console.log('Create package called');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Uploaded files:', req.files);

    // Parse JSON fields from FormData strings
    const parsedBody = { ...req.body };
    const jsonFields = ['highlights', 'itinerary', 'inclusions', 'exclusions'];
    jsonFields.forEach(field => {
      if (parsedBody[field]) {
        try {
          parsedBody[field] = JSON.parse(parsedBody[field]);
        } catch (e) {
          console.log(`Failed to parse ${field}:`, parsedBody[field]);
          parsedBody[field] = [];
        }
      }
    });

    const { error, value } = packageSchema.validate(parsedBody, { allowUnknown: true, stripUnknown: true });
    if (error) {
      console.log('Validation error:', error.details[0].message);
      console.log('Validation details:', error.details);
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log('Validated data:', JSON.stringify(value, null, 2));

    // Handle uploaded images
    const images = [];

    // Add main image if uploaded
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      images.push(`/uploads/${req.files.mainImage[0].filename}`);
    }

    // Add gallery images if uploaded
    if (req.files && req.files.galleryImages) {
      req.files.galleryImages.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    const packageData = {
      ...value,
      images: images,
      createdBy: req.user.id,
    };

    const pkg = await prisma.package.create({
      data: packageData,
      include: {
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    console.log('Package created successfully:', pkg.id);

    res.status(201).json({
      message: 'Package created successfully',
      package: pkg,
    });
  } catch (error) {
    console.log('Error in createPackage:', error);
    next(error);
  }
};

// Update package (admin only)
const updatePackage = async (req, res, next) => {
  const { id } = req.params;
  console.log('Update package called for id:', id);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Uploaded files:', req.files);

  try {
    // Get existing package to preserve images if not being updated
    const existingPackage = await prisma.package.findUnique({ where: { id } });
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Parse JSON fields from FormData strings
    const parsedBody = { ...req.body };
    const jsonFields = ['highlights', 'itinerary', 'inclusions', 'exclusions'];
    jsonFields.forEach(field => {
      if (parsedBody[field]) {
        try {
          parsedBody[field] = JSON.parse(parsedBody[field]);
        } catch (e) {
          console.log(`Failed to parse ${field}:`, parsedBody[field]);
          parsedBody[field] = [];
        }
      }
    });

    // Handle images field separately - it's sent as newline-separated string
    if (parsedBody.images) {
      parsedBody.images = parsedBody.images.split('\n').filter(url => url.trim());
    }

    console.log('Parsed body:', JSON.stringify(parsedBody, null, 2));

    const { error, value } = updatePackageSchema.validate(parsedBody, { allowUnknown: true, stripUnknown: true });
    if (error) {
      console.log('Validation error:', error.details[0].message);
      console.log('Validation details:', error.details);
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log('Validated data:', JSON.stringify(value, null, 2));

    // Handle uploaded images - start with existing images or parsed images
    let images = value.images || existingPackage.images || [];

    // Add main image if uploaded
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      images = [`/uploads/${req.files.mainImage[0].filename}`, ...images.filter(img => !img.includes('mainImage'))];
    }

    // Add gallery images if uploaded
    if (req.files && req.files.galleryImages) {
      const galleryPaths = req.files.galleryImages.map(file => `/uploads/${file.filename}`);
      images = [...images, ...galleryPaths];
    }

    const packageData = {
      ...value,
      images: images,
    };

    const pkg = await prisma.package.update({
      where: { id },
      data: packageData,
      include: {
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    console.log('Package updated successfully:', pkg.id);

    res.json({
      message: 'Package updated successfully',
      package: pkg,
    });
  } catch (error) {
    console.log('Error in updatePackage:', error);
    next(error);
  }
};

// Delete package (admin only)
const deletePackage = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.package.delete({ where: { id } });
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all packages for admin (including inactive)
const getAllPackagesAdmin = async (req, res, next) => {
  try {
    const { error: paginationError, value: pagination } = paginationSchema.validate(req.query);
    if (paginationError) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const packages = await prisma.package.findMany({
      include: {
        _count: { select: { reviews: true, bookings: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const packagesWithRating = packages.map(pkg => {
      // Transform images array to object format for frontend
      const transformedImages = pkg.images && pkg.images.length > 0 ? {
        main: pkg.images[0]
      } : undefined;

      return {
        ...pkg,
        images: transformedImages,
        averageRating: pkg.reviews.length > 0
          ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) / pkg.reviews.length
          : 0,
        reviewCount: pkg._count.reviews,
        bookingCount: pkg._count.bookings,
      };
    });

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
  getPackageById, // ✅ added
  createPackage,
  updatePackage,
  deletePackage,
  getAllPackagesAdmin,
};
