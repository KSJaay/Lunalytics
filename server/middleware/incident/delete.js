import statusCache from '../../cache/status.js';
import { deleteIncident } from '../../database/queries/incident.js';

const deleteIncidentMiddleware = async (req, res) => {
  const { incidentId } = req.body;

  try {
    if (!incidentId) {
      throw new Error('Incident id is required');
    }

    await deleteIncident(incidentId);
    statusCache.deleteIncident(incidentId);

    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default deleteIncidentMiddleware;
