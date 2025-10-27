const { createClient } = require('@supabase/supabase-js');
const prisma = require('../utils/prisma');
const { registerSchema, loginSchema } = require('../utils/validation');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Register new user with Supabase Auth
const register = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password } = value;

    // Create user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    // For Supabase, we need to wait for email confirmation
    // The user record will be created when they first login after confirming email
    // Or we can create it now but mark it as unconfirmed

    res.status(201).json({
      message: 'User registered successfully. Please check your email to confirm your account.',
      user: {
        id: data.user.id,
        name,
        email,
        confirmed: false
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user with Supabase Auth or local database for admin
const login = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // First, check if this is an admin user in our local database
    const adminUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true }
    });

    if (adminUser && adminUser.role === 'admin') {
      // Admin user found, verify password against local database
      const bcrypt = require('bcrypt');
      const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate a simple JWT-like token for admin (you might want to use proper JWT)
      const jwt = require('jsonwebtoken');
      const accessToken = jwt.sign(
        { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      return res.json({
        message: 'Admin login successful',
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
        accessToken,
        refreshToken: null, // Admin doesn't need refresh token for now
      });
    }

    // Not an admin user, proceed with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({ error: 'Login failed' });
    }

    // Check if user is confirmed
    if (!data.user.email_confirmed_at) {
      return res.status(401).json({ error: 'Please confirm your email before logging in' });
    }

    // Get or create user record in our database
    let dbUser = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: { id: true, email: true, name: true, role: true }
    });

    // If user doesn't exist in our database, create it (for confirmed users)
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'User',
          email: data.user.email,
          role: 'customer', // Default role
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Get all customers (admin only)
const getCustomers = async (req, res, next) => {
  try {
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
                status: 'approved',
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ customers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getCustomers,
};
