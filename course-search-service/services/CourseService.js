const Course = require('../models/Course');
require('../models/Category');
require('../models/Technology');
require('../models/User');

class CourseService {
    async createCourse(courseData) {
        const { title, description, instructor, category, duration, level, technology } = courseData;

        // Validation
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

    async getAllCourses(filters = {}) {
        const { category, level, duration, search, technology } = filters;
        let query = {
            isActive: true
        };

        // Build array to hold $and conditions when multiple $or conditions exist
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

        // If we have multiple $or conditions, wrap them in $and
        if (andConditions.length > 1) {
            query.$and = andConditions;
        } else if (andConditions.length === 1) {
            // If only one $or condition, add it directly
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

        console.log('Constructed Course Query:', JSON.stringify(query, null, 2));
        let courseQuery = Course.find(query)
            .populate('category', 'name')
            .populate('instructor', 'fullName email')
            .populate('technology', 'label');

        // Apply sorting
        courseQuery = courseQuery.sort({ createdAt: -1 });

        const courses = await courseQuery.exec();
        return courses;
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
