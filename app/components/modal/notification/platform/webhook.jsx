// import dependencies
import PropTypes from 'prop-types';
import { Textarea, Input } from '@lunalytics/ui';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';
import Switch from '../../../ui/switch';

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
      <Input
        title="Friendly Name"
        placeholder="Lunalytics"
        id="friendly-name"
        error={errors?.friendlyName}
        defaultValue={values.friendlyName}
        onChange={(e) => {
          handleInput({ key: 'friendlyName', value: e.target.value });
        }}
      />
      <Input
        title="Webhook URL"
        placeholder="https://lunalytics.xyz/webhooks/example"
        subtitle={
          <>
            For more information about how to create a custom webhoook checkout
            this guide:{' '}
            <a
              style={{ color: 'var(--primary-700)' }}
              href="https://lunalytics.xyz/guides/webhook/services"
              target="_blank"
              rel="noreferrer"
            >
              https://lunalytics.xyz/guides/webhook/services
            </a>
          </>
        }
        id="webhook-url"
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
          id="http-form-dropdown"
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
        <Switch
          label="Additional Headers"
          id="additional-headers"
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
                  id="additional-headers-textarea"
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
