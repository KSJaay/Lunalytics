// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';

const HomeAssistantNotificationModalHomeAssistantInput = ({
  values = {},
  errors = {},
  handleInput,
}) => {
  return (
    <>
      <TextInput
        label={'Friendly Name'}
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <TextInput
        label={'HomeAssistant URL'}
        placeholder="https://www.home-assistant.io/"
        description={
          <>
            URL of your HomeAssistant instance.
          </>
        }
        id="home-assistant-url"
        isRequired
        error={errors?.data?.homeAssistantUrl}
        defaultValue={values.data?.homeAssistantUrl}
        onChange={(e) => {
          handleInput({ key: 'data', value: { ...values.data, homeAssistantUrl: e.target.value } });
        }}
      />
       <TextInput
        label={'Notification Service'}
        placeholder="mobile_app_<device_name>"
        description={
          <>
            Notification service to use.
          </>
        }
        id="home-assistant-notification-service"
        isRequired
        error={errors?.data?.homeAssistantNotificationService}
        defaultValue={values.data?.homeAssistantNotificationService}
        onChange={(e) => {
          handleInput({ key: 'data', value: { ...values.data, homeAssistantNotificationService: e.target.value } });
        }}
      />
      <TextInput
        label={'Long Lived Access Token'}
        description={
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
