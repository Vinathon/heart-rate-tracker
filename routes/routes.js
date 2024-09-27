
const express = require('express');
const router = express.Router();
const clinicalDataController = require('../controllers/clinicalDataController');

router.post('/', clinicalDataController.receiveClinicalData);

module.exports = router;
