const UserService = require('../services/UserService');

class UserController {
  /**
   * Get all users with optional filters
   */
  async getAllUsers(req, res) {
    try {
      const result = await UserService.getAllUsers(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to fetch users';
      console.error('Error fetching users:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to fetch user';
      console.error('Error fetching user:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Update a user by ID
   */
  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to update user';
      console.error('Error updating user:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to delete user';
      console.error('Error deleting user:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(req, res) {
    try {
      const user = await UserService.toggleUserStatus(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
        data: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to update user status';
      console.error('Error updating user status:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(req, res) {
    try {
      const stats = await UserService.getUserStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to fetch user statistics';
      console.error('Error fetching user stats:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }
}

module.exports = UserController;
