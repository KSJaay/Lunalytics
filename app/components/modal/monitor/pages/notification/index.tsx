// import local files
import MonitorNotificationList from './list';
import MonitorNotificationType from './type';

interface MonitorNotificationPageProps {
  inputs: any;
  errors: any;
  handleInput: (key: string, value: any) => void;
}

const MonitorNotificationPage = ({
  inputs,
  errors,
  handleInput,
}: MonitorNotificationPageProps) => {
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
