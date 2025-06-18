// import dependencies
import PropTypes from 'prop-types';

// import local files
import { Input } from '@lunalytics/ui';

const HomeAssistantNotificationModalHomeAssistantInput = ({
  values = {},
  errors = {},
  handleInput,
}) => {
  return (
    <>
      <Input
        title={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <Input
        title={'HomeAssistant URL'}
        placeholder="https://www.home-assistant.io/"
        subtitle={
          <>
            URL of your HomeAssistant instance.
          </>
        }
        id="home-assistant-url"
        isRequired
        error={errors?.homeAssistantUrl}
        defaultValue={values.data?.homeAssistantUrl}
        onChange={(e) => {
          handleInput({ key: 'data', value: { ...values.data, homeAssistantUrl: e.target.value } });
        }}
      />
       <Input
        title={'Notification Service'}
        placeholder="mobile_app_<device_name>"
        subtitle={
          <>
            Notification service to use.
          </>
        }
        id="home-assistant-notification-service"
        isRequired
        error={errors?.homeAssistantNotificationService}
        defaultValue={values.data?.homeAssistantNotificationService}
        onChange={(e) => {
          handleInput({ key: 'data', value: { ...values.data, homeAssistantNotificationService: e.target.value } });
        }}
      />
      <Input
        title={'Long Lived Access Token'}
        subtitle={
            <>
                Long-lived access tokens can be created using the &quot;Long-Lived Access Tokens&quot; 
                section at the bottom of a user&apos;s Home Assistant profile page.
            </>
        }
        id="home-assistant-access-token"
        error={errors?.token}
        defaultValue={values.token}
        onChange={(e) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />
    </>
  );
};

HomeAssistantNotificationModalHomeAssistantInput.displayName = 'HomeAssistantNotificationModalHomeAssistantInput';

HomeAssistantNotificationModalHomeAssistantInput.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
};

export default HomeAssistantNotificationModalHomeAssistantInput;
