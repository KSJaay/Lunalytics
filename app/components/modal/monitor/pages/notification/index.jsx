// import dependencies
import PropTypes from 'prop-types';

// import local files
import MonitorNotificationList from './list';
import MonitorNotificationType from './type';

const MonitorNotificationPage = ({ inputs, errors, handleInput, isEdit }) => {
  return (
    <div className="monitor-configure-container">
      <MonitorNotificationList
        inputs={inputs}
        errors={errors}
        handleInput={handleInput}
      />

      <MonitorNotificationType
        inputs={inputs}
        errors={errors}
        handleInput={handleInput}
      />
    </div>
  );
};

MonitorNotificationPage.displayName = 'MonitorNotificationPage';

MonitorNotificationPage.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default MonitorNotificationPage;
