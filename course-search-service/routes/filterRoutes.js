const express = require('express');
const router = express.Router();
const FilterController = require('../controllers/FilterController');

const filterController = new FilterController();

router.get('/', (req, res) => filterController.getAllFilters(req, res));

module.exports = router;
