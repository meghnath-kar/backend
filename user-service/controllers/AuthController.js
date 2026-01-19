const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Registration failed';
      console.error('Registration error:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Login failed';
      console.error('Login error:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // But we can implement token blacklisting if needed
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
      });
    }
  }

  /**
   * Get current logged-in user profile
   */
  async getProfile(req, res) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to fetch profile';
      console.error('Get profile error:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to update profile';
      console.error('Update profile error:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res) {
    try {
      await AuthService.changePassword(req.body);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Failed to change password';
      console.error('Change password error:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Verify email or account
   */
  async verifyAccount(req, res) {
    try {
      const result = await AuthService.verifyAccount(req.params.token);
      res.status(200).json({
        success: true,
        message: 'Account verified successfully',
        data: result,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Account verification failed';
      console.error('Verify account error:', error);
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }
}

module.exports = AuthController;
