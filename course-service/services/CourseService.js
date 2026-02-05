const Course = require('../models/Course');
require('../models/Category');
require('../models/Technology');
require('../models/User');

class CourseService {
    async createCourse(courseData) {
        const { title, description, instructor, category, duration, level, technology } = courseData;

        if (!title || !description || !instructor || !category || !duration || !technology) {
            throw new Error('Missing required fields');
        }

        const course = new Course({
            title,
            description,
            instructor,
            category,
            duration,
            level,
            technology,
        });

        const savedCourse = await course.save();

        await savedCourse.populate([
            { path: 'instructor', select: 'fullName email' },
            { path: 'category', select: 'name label' },
            { path: 'technology', select: 'label' }
        ]);

        return savedCourse;
    }

    async getFilteredCourses(filters = {}) {
        const { category, level, duration, search, technology, page = 1, limit = 6 } = filters;
        let query = {
            isActive: true
        };

        let andConditions = [];

        if (search) {
            andConditions.push({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            });
        }

        if (duration?.length) {
            const durationConditions = CourseService.buildDurationQuery(duration);
            if (durationConditions.length > 0) {
                andConditions.push({ $or: durationConditions });
            }
        }

        if (andConditions.length > 1) {
            query.$and = andConditions;
        } else if (andConditions.length === 1) {
            Object.assign(query, andConditions[0]);
        }

        if (category?.length) {
            query.category = { $in: Array.isArray(category) ? category : [category] };
        }

        if (level?.length) {
            query.level = { $in: Array.isArray(level) ? level : [level] };
        }

        if (technology?.length) {
            query.technology = { $in: Array.isArray(technology) ? technology : [technology] };
        }

        
        const totalCourses = await Course.countDocuments(query);

        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const totalPages = Math.ceil(totalCourses / pageSize);
        const skip = (pageNumber - 1) * pageSize;

        const courses = await Course.find(query)
            .populate('category', 'name')
            .populate('instructor', 'fullName email')
            .populate('technology', 'label')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(pageSize)
            .exec();

        return {
            count: totalCourses,
            courses: courses,
            totalPages: totalPages,
            currentPage: pageNumber,
            pageSize: pageSize,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        };
    }

    async getCourseById(id) {
        if (!id) {
            throw new Error('Missing required fields');
        }
        
        const course = await Course.findById(id)
            .populate('category', 'name')
            .populate('instructor', 'fullName email')
            .populate('technology', 'label')
            .exec();

        return course;
    }

    static buildDurationQuery(durationArray) {
        const conditions = durationArray.map((d) => {
            if(d.endsWith('+')) {
                const min = parseInt(d.slice(0, -1), 10);
                return { duration: { $gte: min } };
            } else if(d.includes('-')) {
                const [min, max] = d.split('-').map(Number);
                return { duration: { $gte: min, $lte: max } };
            }
            return null;
        }).filter(Boolean);
        return conditions.length > 0 ?  conditions : {};
    }
}

module.exports = CourseService;
