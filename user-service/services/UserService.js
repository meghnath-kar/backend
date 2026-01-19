const User = require('../models/User');

class UserService {
  /**
   * Get all users with optional filters
   */
  async getAllUsers(filters = {}) {
    const { email, country, minAge, maxAge, is_active, role, page = 1, limit = 10 } = filters;
    let query = {};

    // Build query based on filters
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

    if (role) {
      query.role = role;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

  /**
   * Update user
   */
  async updateUser(userId, updates) {
    // Don't allow password updates through this method
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId).select('-password');
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return user.toJSON();
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    user.is_active = !user.is_active;
    await user.save();

    return user.toJSON();
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ is_active: true });
    const inactiveUsers = await User.countDocuments({ is_active: false });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const usersByCountry = await User.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
      usersByCountry,
      recentUsers,
    };
  }

  /**
   * Search users
   */
  async searchUsers(searchTerm) {
    const users = await User.find({
      $or: [
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { country: { $regex: searchTerm, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(20);

    return users;
  }
}

module.exports = new UserService();
