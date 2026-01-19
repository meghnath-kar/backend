const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Instantiate the controller
const userController = new UserController();

// All user routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// User management routes
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/stats', (req, res) => userController.getUserStats(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));
router.patch('/:id/toggle-status', (req, res) => userController.toggleUserStatus(req, res));

module.exports = router;
