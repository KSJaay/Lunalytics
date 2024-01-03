const express = require('express');
const monitorAdd = require('../middleware/monitor/add');
const monitorDelete = require('../middleware/monitor/delete');
const fetchMonitorUsingId = require('../middleware/monitor/id');
const router = express.Router();

router.post('/add', monitorAdd);
router.get('/delete', monitorDelete);
router.get('/id', fetchMonitorUsingId);

module.exports = router;
