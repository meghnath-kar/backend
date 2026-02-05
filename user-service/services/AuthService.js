const User = require('../models/User');
const UserType = require('../models/UserType');
const jwt = require('jsonwebtoken');

class AuthService {
  
  generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  }
  
  async register(userData) {
    const { fullName, email, country, password } = userData;

    if (!fullName || !email || !country || !password) {
      throw { status: 400, message: 'All fields are required' };
    }

    if (password.length < 6) {
      throw { status: 400, message: 'Password must be at least 6 characters' };
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw { status: 409, message: 'User with this email already exists' };
    }

    const userType = await UserType.findOne({ name: 'user' });

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      country,
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

  async login(credentials) {
    const { email, password } = credentials;
    
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

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    user.lastLogin = new Date();
    await user.save();

    const token = this.generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).populate('userType', '_id name');
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

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
