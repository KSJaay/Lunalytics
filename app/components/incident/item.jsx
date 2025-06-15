import './style.scss';

// import node_modules
import { useNavigate } from 'react-router-dom';

// import local files
import Button from '../ui/button';
import Label from '../ui/label';
import classNames from 'classnames';

const incidentTypes = {
  Investigating: 'red',
  Identified: 'yellow',
  Monitoring: 'blue',
  Resolved: 'green',
};

const IncidentItem = ({ id, title = '', affect, status, lastUpdate }) => {
  const navigate = useNavigate();
  const classes = classNames('incident-item-container', { [affect]: affect });

  return (
    <div>
      <div className={classes}>
        <div className="incident-item-content">
          <div className="incident-item-title">{title}</div>
          <div className="incident-item-user">
            {status && (
              <Label color={incidentTypes[status]} style="flat" size="xs">
                {status}
              </Label>
            )}
            <div>
              {status && ' · '}
              created {lastUpdate}
            </div>
          </div>
        </div>
        <div
          className="incident-item-action"
          onClick={() => navigate(`/incidents/${id}`)}
        >
          <Button>Update</Button>
        </div>
      </div>
    </div>
  );
};

export default IncidentItem;
