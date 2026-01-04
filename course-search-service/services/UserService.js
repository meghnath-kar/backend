const User = require('../models/User');

class UserService {
  
  async createUser(userData) {
    const { fullName, email, country, age, password } = userData;

    if (!fullName || !email || !country || !age || !password) {
      throw { status: 400, message: 'Missing required fields' };
    }

    if (age < 18) {
      throw { status: 400, message: 'User must be at least 18 years old' };
    }

    const user = new User({
      fullName,
      email,
      country,
      age,
      password,
    });

    const savedUser = await user.save();
    return savedUser.toJSON();
  }

  async getAllUsers(filters = {}) {
    const { email, country, minAge, maxAge, is_active } = filters;
    let query = {};

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return {
      count: users.length,
      users: users,
    };
  }

  async getUserById(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw { status: 400, message: 'Invalid user ID' };
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user;
  }

  async updateUser(id, updateData) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw { status: 400, message: 'Invalid user ID' };
    }

    const user = await User.findById(id);

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    Object.keys(updateData).forEach(key => {
      user[key] = updateData[key];
    });

    await user.save();
    return user.toJSON();
  }


  async loginUser(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw { status: 400, message: 'Missing email or password' };
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    if (user.is_active) {
      throw { status: 403, message: 'User account is inactive' };
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    return user.toJSON();
  }
}

module.exports = new UserService();
