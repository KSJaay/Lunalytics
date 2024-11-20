// import dependencies
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// import local files
import { monitorPropType } from '../../../../../../shared/utils/propTypes';
import classNames from 'classnames';

const MonitorCompactItem = ({ monitor = {}, isActive, setActive }) => {
  const navigate = useNavigate();

  const { name, url } = monitor;

  const classes = classNames('home-monitor-name-compact', {
    'home-monitor-name-compact-active': isActive,
  });

  return (
    <div
      className="home-monitor-container-compact"
      onClick={() => {
        if (window.innerWidth <= 1024) {
          return navigate(`/monitor/${monitor.monitorId}`);
        }

        setActive(monitor.monitorId);
      }}
      id={`monitor-${monitor.name}`}
    >
      <div className={classes}>
        <div>{name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--accent-200)' }}>
          {url}
        </div>
      </div>
    </div>
  );
};

MonitorCompactItem.displayName = 'MonitorCompactItem';

MonitorCompactItem.propTypes = {
  monitor: monitorPropType.isRequired,
  isActive: PropTypes.bool,
  setActive: PropTypes.func,
};

export default MonitorCompactItem;
