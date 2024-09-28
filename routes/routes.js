
const express = require('express');
const router = express.Router();
const clinicalDataController = require('../controllers/clinicalDataController');
const validatePayload = require('../middleware/validationMiddleware');

router.post('/', validatePayload,clinicalDataController.receiveClinicalData);

router.get('/:patientId', clinicalDataController.getClinicalData);

module.exports = router;
