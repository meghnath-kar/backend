const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// ============== CREATE OPERATIONS ==============

// Add a new course
router.post('/', async (req, res) => {
  try {
    const { title, description, instructor, category, price, duration, level } = req.body;

    // Validation
    if (!title || !description || !instructor || !category || price === undefined || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const course = new Course({
      title,
      description,
      instructor,
      category,
      price,
      duration,
      level,
    });

    const savedCourse = await course.save();
    res.status(201).json({
      message: 'Course added successfully',
      course: savedCourse,
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// ============== READ OPERATIONS ==============

// Get all courses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, level, minPrice, maxPrice, search, sortBy } = req.query;
    let query = { isActive: true };

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
      ];
    }

    let courseQuery = Course.find(query);

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low-to-high':
          courseQuery = courseQuery.sort({ price: 1 });
          break;
        case 'price-high-to-low':
          courseQuery = courseQuery.sort({ price: -1 });
          break;
        case 'rating':
          courseQuery = courseQuery.sort({ rating: -1 });
          break;
        case 'newest':
          courseQuery = courseQuery.sort({ createdAt: -1 });
          break;
        default:
          courseQuery = courseQuery.sort({ createdAt: -1 });
      }
    } else {
      courseQuery = courseQuery.sort({ createdAt: -1 });
    }

    const courses = await courseQuery.exec();

    res.status(200).json({
      count: courses.length,
      courses: courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Search courses by category
router.get('/search/by-category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({ category, isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: courses.length,
      courses: courses,
    });
  } catch (error) {
    console.error('Error searching by category:', error);
    res.status(500).json({ error: 'Failed to search courses' });
  }
});

// Search courses by instructor
router.get('/search/by-instructor/:instructor', async (req, res) => {
  try {
    const { instructor } = req.params;
    const courses = await Course.find({
      instructor: { $regex: instructor, $options: 'i' },
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: courses.length,
      courses: courses,
    });
  } catch (error) {
    console.error('Error searching by instructor:', error);
    res.status(500).json({ error: 'Failed to search courses' });
  }
});

// ============== UPDATE OPERATIONS ==============

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// ============== DELETE OPERATIONS ==============

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course deleted successfully',
      course: deletedCourse,
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
