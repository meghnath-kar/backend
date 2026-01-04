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

    async getAllCourses(req, res) {
        try {
            const courses = await this.courseService.getAllCourses(req.body);

            res.status(200).json({
                count: courses.length,
                courses: courses,
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

            res.status(200).json({ course });
        } catch (error) {
            console.error('Error fetching course:', error);
            if (error.message === 'Invalid course ID') {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to fetch course', details: error.message });
        }
    }

    async getCoursesByCategory(req, res) {
        try {
            const { category } = req.params;
            const courses = await this.courseService.getCoursesByCategory(category);

            res.status(200).json({
                count: courses.length,
                courses: courses,
            });
        } catch (error) {
            console.error('Error searching by category:', error);
            if (error.message === 'Invalid category ID') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to search courses', details: error.message });
        }
    }

    async getCoursesByInstructor(req, res) {
        try {
            const { instructor } = req.params;
            const courses = await this.courseService.getCoursesByInstructor(instructor);

            res.status(200).json({
                count: courses.length,
                courses: courses,
            });
        } catch (error) {
            console.error('Error searching by instructor:', error);
            if (error.message === 'Invalid instructor ID') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to search courses', details: error.message });
        }
    }

    async getCoursesByTechnology(req, res) {
        try {
            const { technology } = req.params;
            const courses = await this.courseService.getCoursesByTechnology(technology);

            res.status(200).json({
                count: courses.length,
                courses: courses,
            });
        } catch (error) {
            console.error('Error searching by technology:', error);
            if (error.message === 'Invalid technology ID') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to search courses', details: error.message });
        }
    }

    async getCoursesByLevel(req, res) {
        try {
            const { level } = req.params;
            const courses = await this.courseService.getCoursesByLevel(level);

            res.status(200).json({
                count: courses.length,
                courses: courses,
            });
        } catch (error) {
            console.error('Error searching by level:', error);
            if (error.message === 'Invalid level. Must be Beginner, Intermediate, or Advanced') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to search courses', details: error.message });
        }
    }

    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const updatedCourse = await this.courseService.updateCourse(id, req.body);

            res.status(200).json({
                message: 'Course updated successfully',
                course: updatedCourse,
            });
        } catch (error) {
            console.error('Error updating course:', error);
            if (error.message === 'Invalid course ID') {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to update course', details: error.message });
        }
    }

    async toggleCourseStatus(req, res) {
        try {
            const { id } = req.params;
            const course = await this.courseService.toggleCourseStatus(id);

            res.status(200).json({
                message: `Course ${course.isActive ? 'activated' : 'deactivated'} successfully`,
                course: course,
            });
        } catch (error) {
            console.error('Error toggling course status:', error);
            if (error.message === 'Invalid course ID') {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to toggle course status', details: error.message });
        }
    }

    async softDeleteCourse(req, res) {
        try {
            const { id } = req.params;
            const course = await this.courseService.softDeleteCourse(id);

            res.status(200).json({
                message: 'Course deleted successfully (soft delete)',
                course: course,
            });
        } catch (error) {
            console.error('Error deleting course:', error);
            if (error.message === 'Invalid course ID') {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to delete course', details: error.message });
        }
    }

    async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const deletedCourse = await this.courseService.deleteCourse(id);

            res.status(200).json({
                message: 'Course permanently deleted',
                course: deletedCourse,
            });
        } catch (error) {
            console.error('Error deleting course:', error);
            if (error.message === 'Invalid course ID') {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Course not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to delete course', details: error.message });
        }
    }

    async getCourseStats(req, res) {
        try {
            const stats = await this.courseService.getCourseStats();

            res.status(200).json(stats);
        } catch (error) {
            console.error('Error fetching course statistics:', error);
            res.status(500).json({ error: 'Failed to fetch course statistics', details: error.message });
        }
    }
}

module.exports = CourseController;
