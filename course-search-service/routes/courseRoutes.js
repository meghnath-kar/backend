const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController');
const authMiddleware = require('../middleware/authMiddleware');

const courseController = new CourseController();

router.post('/', authMiddleware, (req, res) => courseController.createCourse(req, res));
router.post('/search', (req, res) => courseController.getFilteredCourses(req, res));
router.get('/:id', (req, res) => courseController.getCourseById(req, res));

module.exports = router;
