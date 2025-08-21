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

export default MonitorNotificationPage;
