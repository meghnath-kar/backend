const UserService = require('../services/UserService');

class UserController {
  /**
   * Create a new user
   */
  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        message: 'User created successfully',
        user: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to create user';
      res.status(status).json({ 
        error: message,
        details: status === 500 ? error : undefined
      });
    }
  }

  /**
   * Get all users with optional filters
   */
  async getAllUsers(req, res) {
    try {
      const result = await UserService.getAllUsers(req.query);
      res.status(200).json(result);
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to fetch users';
      console.error('Error fetching users:', error);
      res.status(status).json({ error: message });
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({ user });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to fetch user';
      console.error('Error fetching user:', error);
      res.status(status).json({ error: message });
    }
  }

  /**
   * Update a user by ID
   */
  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        message: 'User updated successfully',
        user: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to update user';
      console.error('Error updating user:', error);
      res.status(status).json({ error: message });
    }
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to delete user';
      console.error('Error deleting user:', error);
      res.status(status).json({ error: message });
    }
  }

  /**
   * User login/authentication
   */
  async loginUser(req, res) {
    try {
      const user = await UserService.loginUser(req.body);
      res.status(200).json({
        message: 'Login successful',
        user: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Login failed';
      console.error('Error during login:', error);
      res.status(status).json({ error: message });
    }
  }
}

module.exports = UserController;
