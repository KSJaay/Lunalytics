// import dependencies
import express from 'express';
const router = express.Router();

// import local files
import monitorAdd from '../middleware/monitor/add.js';
import monitorEdit from '../middleware/monitor/edit.js';
import monitorDelete from '../middleware/monitor/delete.js';
import fetchMonitorUsingId from '../middleware/monitor/id.js';
import hasEditorPermissions from '../middleware/user/hasEditor.js';
import fetchMonitorStatus from '../middleware/monitor/status.js';
import monitorPause from '../middleware/monitor/pause.js';

router.post('/add', hasEditorPermissions, monitorAdd);
router.post('/edit', hasEditorPermissions, monitorEdit);
router.get('/delete', hasEditorPermissions, monitorDelete);
router.get('/status', fetchMonitorStatus);
router.get('/id', fetchMonitorUsingId);
router.post('/pause', hasEditorPermissions, monitorPause);

export default router;
