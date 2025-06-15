// import dependencies
import express from 'express';

// import local files
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import createIncidentMiddleware from '../middleware/incident/create.js';
import getAllIncidents from '../middleware/incident/getAll.js';
import updateIncidentMiddleware from '../middleware/incident/update.js';
import createIncidentMessageMiddleware from '../middleware/incident/addMessage.js';
import updateIncidentMessageMiddleware from '../middleware/incident/updateMessage.js';
import deleteIncidentMiddleware from '../middleware/incident/delete.js';

const router = express.Router();

const canEditIncident = hasRequiredPermission(PermissionsBits.MANAGE_INCIDENTS);

router.get('/all', getAllIncidents);

router.use(canEditIncident);
router.post('/create', createIncidentMiddleware);
router.post('/update', updateIncidentMiddleware);
router.post('/messages/create', createIncidentMessageMiddleware);
router.post('/messages/update', updateIncidentMessageMiddleware);
router.post('/delete', deleteIncidentMiddleware);

export default router;
