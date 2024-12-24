// import dependencies
import PropTypes from 'prop-types';

const userPropType = PropTypes.shape({
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  isVerified: PropTypes.number.isRequired,
  permission: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
  canManage: PropTypes.bool,
});

const monitorPropType = PropTypes.shape({
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  interval: PropTypes.number.isRequired,
  retryInterval: PropTypes.number.isRequired,
  requestTimeout: PropTypes.number.isRequired,
  method: PropTypes.string.isRequired,
  headers: PropTypes.object,
  body: PropTypes.object,
  valid_status_codes: PropTypes.array.isRequired,
  email: PropTypes.string.isRequired,
});

const heartbeatPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  latency: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  isDown: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
});

const certPropType = PropTypes.shape({
  id: PropTypes.number,
  monitorId: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  issuer: PropTypes.string,
  validFrom: PropTypes.string,
  validTill: PropTypes.string,
  validOn: PropTypes.string,
  daysRemaining: PropTypes.number,
  nextCheck: PropTypes.string,
});

const fullMonitorPropType = PropTypes.shape({
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  interval: PropTypes.number.isRequired,
  retryInterval: PropTypes.number.isRequired,
  requestTimeout: PropTypes.number.isRequired,
  method: PropTypes.string.isRequired,
  headers: PropTypes.object,
  body: PropTypes.object,
  valid_status_codes: PropTypes.array.isRequired,
  email: PropTypes.string.isRequired,
  cert: certPropType,
  heartbeats: PropTypes.arrayOf(heartbeatPropType),
});

const colorPropType = PropTypes.oneOf([
  'blue',
  'cyan',
  'gray',
  'green',
  'pink',
  'primary',
  'purple',
  'red',
  'yellow',
]);

export {
  userPropType,
  monitorPropType,
  fullMonitorPropType,
  heartbeatPropType,
  certPropType,
  colorPropType,
};
