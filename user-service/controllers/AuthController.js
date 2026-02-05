const AuthService = require('../services/AuthService');

class AuthController {
  
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

  async logout(req, res) {
    try {
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
}

module.exports = AuthController;
