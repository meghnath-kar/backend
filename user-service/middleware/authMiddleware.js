const AuthService = require('../services/AuthService');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Authorization denied.',
      });
    }

    const token = authHeader.split(' ')[1];
    const user = await AuthService.verifyToken(token);

    req.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    const status = error.status || 401;
    const message = error.message || 'Token is not valid';
    
    return res.status(status).json({
      success: false,
      error: message,
    });
  }
};

module.exports = authMiddleware;
