// import dependencies
import PropTypes from 'prop-types';

const userPropType = PropTypes.shape({
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  isVerified: PropTypes.bool.isRequired,
  permission: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canManage: PropTypes.bool.isRequired,
});

const monitorPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  interval: PropTypes.number.isRequired,
  retryInterval: PropTypes.number.isRequired,
  requestTimeout: PropTypes.number.isRequired,
  method: PropTypes.string.isRequired,
  headers: PropTypes.string,
  body: PropTypes.string,
  validStatusCodes: PropTypes.string.isRequired,
  email: userPropType.isRequired,
});

const heartbeatPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  monitorId: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  latency: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  isDown: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
});

const certPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  monitorId: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  issuer: PropTypes.string.isRequired,
  validFrom: PropTypes.number.isRequired,
  vaildTill: PropTypes.number.isRequired,
  validOn: PropTypes.string.isRequired,
  daysRemaining: PropTypes.number.isRequired,
});

const fullMonitorPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  monitorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  interval: PropTypes.number.isRequired,
  retryInterval: PropTypes.number.isRequired,
  requestTimeout: PropTypes.number.isRequired,
  method: PropTypes.string.isRequired,
  headers: PropTypes.string,
  body: PropTypes.string,
  validStatusCodes: PropTypes.string.isRequired,
  email: userPropType.isRequired,
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
