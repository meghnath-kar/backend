const User = require('../models/User');
const UserType = require('../models/UserType');
const jwt = require('jsonwebtoken');

class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  }

  /**
   * Register a new user
   */
  async register(userData) {
    const { fullName, email, country, age, password } = userData;

    // Validate required fields
    if (!fullName || !email || !country || !age || !password) {
      throw { status: 400, message: 'All fields are required' };
    }

    // Validate age
    if (age < 18) {
      throw { status: 400, message: 'User must be at least 18 years old' };
    }

    // Validate password length
    if (password.length < 6) {
      throw { status: 400, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw { status: 409, message: 'User with this email already exists' };
    }

    const userType = await UserType.findOne({ name: 'user' });

    // Create new user
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      country,
      age,
      password,
      userType: userType._id
    });

    await user.save();
    await user.populate('userType', '_id name');
    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Login user
   */
  async login(credentials) {
    const { email, password } = credentials;
    
    // Validate input
    if (!email || !password) {
      throw { status: 400, message: 'Email and password are required' };
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('userType', 'name');
      
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    if (!user.is_active) {
      throw { status: 403, message: 'Account is inactive. Please contact support.' };
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await User.findById(userId).populate('userType', '_id name');
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    // Fields that can be updated
    const allowedUpdates = ['fullName', 'country', 'age'];
    const updateData = {};

    // Filter allowed updates
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    // Validate age if provided
    if (updateData.age && updateData.age < 18) {
      throw { status: 400, message: 'Age must be at least 18' };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userType', '_id name');

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

  /**
   * Change password
   */
  async changePassword({ userId, currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw { status: 400, message: 'Current password and new password are required' };
    }

    if (newPassword.length < 6) {
      throw { status: 400, message: 'New password must be at least 6 characters' };
    }

    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Current password is incorrect' };
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Verify account (placeholder for email verification)
   */
  async verifyAccount(token) {
    // This is a placeholder for email verification logic
    // In a real application, you would:
    // 1. Verify the token
    // 2. Find user by verification token
    // 3. Mark user as verified
    // 4. Clear verification token

    throw { status: 501, message: 'Email verification not yet implemented' };
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate('userType', '_id name');
      
      if (!user || !user.is_active) {
        throw { status: 401, message: 'Invalid token or inactive user' };
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw { status: 401, message: 'Invalid token' };
      }
      if (error.name === 'TokenExpiredError') {
        throw { status: 401, message: 'Token expired' };
      }
      throw error;
    }
  }
}

module.exports = new AuthService();
