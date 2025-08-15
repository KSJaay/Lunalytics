import PropTypes from 'prop-types';

const NotificationIcon = ({ name, icon }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src={`/notifications/${icon}`} style={{ width: '22px' }} />
      <div>{name}</div>
    </div>
  );
};

NotificationIcon.displayName = 'NotificationIcon';

NotificationIcon.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default NotificationIcon;
