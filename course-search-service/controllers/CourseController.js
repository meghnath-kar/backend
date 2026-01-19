const CourseService = require('../services/CourseService');

class CourseController {
    constructor() {
        this.courseService = new CourseService();
    }

    async createCourse(req, res) {
        try {
            const savedCourse = await this.courseService.createCourse(req.body);

            res.status(201).json({
                message: 'Course added successfully',
                course: savedCourse,
            });
        } catch (error) {
            console.error('Error adding course:', error);
            if (error.message === 'Missing required fields') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to add course', details: error.message });
        }
    }

    async getFilteredCourses(req, res) {
        try {
            const courses = await this.courseService.getFilteredCourses(req.body);

            res.status(200).json({
                ...courses
            });
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
        }
    }

    async getCourseById(req, res) {
        try {
            const { id } = req.params;
            const course = await this.courseService.getCourseById(id);

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            res.status(200).json(course);
        } catch (error) {
            console.error('Error fetching course by ID:', error);
            res.status(500).json({ error: 'Failed to fetch course', details: error.message });
        }
    }
}

module.exports = CourseController;
