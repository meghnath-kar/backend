const Category = require('../models/Category');
const Technology = require('../models/Technology');
const Course = require('../models/Course');

class FilterService {
    async getAllCategories() {
        const categories = await Category.find({})
            .select('_id label name')
            .sort({ name: 1 });
        return categories;
    }

    async getAllTechnologies() {
        const technologies = await Technology.find({})
            .select('_id label')
            .sort({ label: 1 });
        return technologies;
    }

    async getAllFilters() {
        const [categories, technologies ] = await Promise.all([
            this.getAllCategories(),
            this.getAllTechnologies()
        ]);

        return {
            categories,
            technologies
        };
    }
}

module.exports = FilterService;
