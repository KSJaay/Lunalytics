// import dependencies
import PropTypes from 'prop-types';

// import local files
import TextInput from '../../../ui/input';
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';
import Checkbox from '../../../ui/checkbox';
import Textarea from '../../../ui/textarea';

const NotificationModalWebhookInput = ({
  values = {},
  errors = {},
  handleInput,
}) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const showAdditionalHeaders =
    typeof values.showAdditionalHeaders !== 'boolean'
      ? values.additionalHeaders
      : values.showAdditionalHeaders;

  return (
    <>
      <TextInput
        label={'Friendly Name'}
        placeholder="Lunalytics"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <TextInput
        label={'Webhook URL'}
        placeholder="https://lunalytics.xyz/webhooks/example"
        description={
          <>
            For more information about how to create a custom webhoook checkout
            this guide:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://lunalytics.xyz/guides/webhook/services"
              // A list of services that are available for the user (ifttt, zapier, express, etc...)
              target="_blank"
              rel="noreferrer"
            >
              https://lunalytics.xyz/guides/blogs/create-webhook
            </a>
          </>
        }
        isRequired
        error={errors?.token}
        defaultValue={values.token}
        onChange={(e) => {
          handleInput({ key: 'token', value: e.target.value });
        }}
      />
      <label className="input-label">Request Type</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="http-method-dropdown"
        >
          {values.requestType || 'application/json'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {[
            'application/json',
            'form-data',
            // 'custom body'
          ].map((method) => (
            <Dropdown.Item
              key={method}
              id={method}
              onClick={() => {
                handleInput({ key: 'requestType', value: method });
                toggleDropdown();
              }}
            >
              {method}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>

      <div style={{ padding: '12px 0 3px 0' }}>
        <Checkbox
          label="Additional Headers"
          checked={showAdditionalHeaders}
          onChange={(e) =>
            handleInput({
              key: 'showAdditionalHeaders',
              value: e.target.checked,
            })
          }
          description={
            showAdditionalHeaders && (
              <>
                <div style={{ paddingBottom: '8px' }}>
                  Add additional headers to be sent with the webhook request.
                  Make sure to follow JSON key/value format.
                </div>
                <Textarea
                  rows={8}
                  error={errors.additionalHeaders}
                  onChange={(e) => {
                    handleInput({
                      key: 'additionalHeaders',
                      value: e.target.value,
                    });
                  }}
                >
                  {values.additionalHeaders}
                </Textarea>
              </>
            )
          }
        />
      </div>
    </>
  );
};

NotificationModalWebhookInput.displayName = 'NotificationModalWebhookInput';

NotificationModalWebhookInput.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
};

export default NotificationModalWebhookInput;
