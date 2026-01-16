// import dependencies
import express from 'express';

// import local files
import { memberHasPermission } from '../middleware/hasPermission.js';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';
import createIncidentMiddleware from '../middleware/incident/create.js';
import updateIncidentMiddleware from '../middleware/incident/update.js';
import createIncidentMessageMiddleware from '../middleware/incident/addMessage.js';
import updateIncidentMessageMiddleware from '../middleware/incident/updateMessage.js';
import deleteIncidentMiddleware from '../middleware/incident/delete.js';
import deleteIncidentMessageMiddleware from '../middleware/incident/deleteMessage.js';

const router = express.Router();

router.use(memberHasPermission(MemberPermissionBits.MANAGE_INCIDENTS));
router.post('/create', createIncidentMiddleware);
router.post('/update', updateIncidentMiddleware);
router.post('/messages/create', createIncidentMessageMiddleware);
router.post('/messages/update', updateIncidentMessageMiddleware);
router.post('/messages/delete', deleteIncidentMessageMiddleware);
router.post('/delete', deleteIncidentMiddleware);

export default router;
