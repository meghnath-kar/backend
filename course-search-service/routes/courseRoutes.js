const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController');

const courseController = new CourseController();

router.post('/', (req, res) => courseController.createCourse(req, res));
router.post('/search', (req, res) => courseController.getAllCourses(req, res));

module.exports = router;
