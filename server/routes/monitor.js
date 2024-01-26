// import dependencies
const express = require('express');
const router = express.Router();

// import local files
const monitorAdd = require('../middleware/monitor/add');
const monitorDelete = require('../middleware/monitor/delete');
const fetchMonitorUsingId = require('../middleware/monitor/id');
const hasEditorPermissions = require('../middleware/user/hasEditor');

router.post('/add', hasEditorPermissions, monitorAdd);
router.get('/delete', hasEditorPermissions, monitorDelete);
router.get('/id', fetchMonitorUsingId);

module.exports = router;
