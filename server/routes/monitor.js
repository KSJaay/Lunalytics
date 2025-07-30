// import dependencies
import express from 'express';
const router = express.Router();

// import local files
import monitorAdd from '../middleware/monitor/add.js';
import monitorEdit from '../middleware/monitor/edit.js';
import monitorDelete from '../middleware/monitor/delete.js';
import fetchMonitorUsingId from '../middleware/monitor/id.js';
import fetchMonitorStatus from '../middleware/monitor/status.js';
import monitorPause from '../middleware/monitor/pause.js';
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';

router.use(hasRequiredPermission(PermissionsBits.VIEW_MONITORS));
router.get('/status', fetchMonitorStatus);
router.get('/id', fetchMonitorUsingId);

router.use(hasRequiredPermission(PermissionsBits.MANAGE_MONITORS));
router.post('/add', monitorAdd);
router.post('/edit', monitorEdit);
router.get('/delete', monitorDelete);
router.post('/pause', monitorPause);

export default router;
