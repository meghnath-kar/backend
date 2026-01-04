const FilterService = require('../services/FilterService');

class FilterController {
    constructor() {
        this.filterService = new FilterService();
    }

    async getAllFilters(req, res) {
        try {
            const filters = await this.filterService.getAllFilters();

            res.status(200).json({
                success: true,
                data: filters
            });
        } catch (error) {
            console.error('Error fetching all filters:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch filters',
                details: error.message
            });
        }
    }
}

module.exports = FilterController;
