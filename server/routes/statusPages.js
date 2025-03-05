import express from 'express';
import hasEditorPermissions from '../middleware/user/hasEditor.js';
import createStatusPageMiddleware from '../middleware/status/create.js';
import getUsingIdMiddleware from '../middleware/status/getUsingId.js';
import getAllStatusPagesMiddleware from '../middleware/status/getAll.js';
import editStatusPageMiddleware from '../middleware/status/edit.js';
import deleteStatusPageMiddleware from '../middleware/status/delete.js';

const router = express.Router();

router.use(hasEditorPermissions);

router.get('/', getAllStatusPagesMiddleware);

router.get('/id', getUsingIdMiddleware);

router.post('/create', createStatusPageMiddleware);

router.post('/update', editStatusPageMiddleware);

router.post('/delete', deleteStatusPageMiddleware);

export default router;
