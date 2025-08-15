// import dependencies
import PropTypes from 'prop-types';

// import local files
import MonitorNotificationList from './list';
import MonitorNotificationType from './type';

const MonitorNotificationPage = ({ inputs, errors, handleInput }) => {
  return (
    <>
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
    </>
  );
};

MonitorNotificationPage.displayName = 'MonitorNotificationPage';

MonitorNotificationPage.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorNotificationPage;
