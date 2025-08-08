import { useState } from 'react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Alert, Input } from '@lunalytics/ui';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// import local filse
import Modal from '../../../ui/modal';
import useCurrentUrl from '../../../../hooks/useCurrentUrl';
import { createPostRequest } from '../../../../services/axios';
import useAuthenticationContext from '../../../../context/authentication';

const SettingsAuthenticationConfigureModal = ({
  closeModal,
  integration,
  provider,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    clientId: provider?.clientId || '',
    clientSecret: provider?.clientSecret || '',
  });
  const currentUrl = useCurrentUrl();
  const { addProvider } = useAuthenticationContext();

  const handleSumbit = async () => {
    try {
      const data = {
        provider: integration.id,
        clientId: values.clientId,
        clientSecret: values.clientSecret,
        enabled: true,
        data: {},
      };

      const provider = await createPostRequest('/api/providers/create', data);
      addProvider(provider.data);
      closeModal();

      toast.success('Provider created successfully');
    } catch (error) {
      if (error?.response?.data?.error) {
        return toast.error(error.response.data.error);
      }

      toast.error('Something went wrong, please try again later.');
    }
  };

  return (
    <Modal.Container contentProps={{ style: { width: '650px' } }}>
      <Modal.Title>Configure {integration.name} OAuth Provider</Modal.Title>
      <Modal.Message>
        <Input
          id="client-id"
          title="Client ID"
          value={values.clientId}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, clientId: e.target.value }))
          }
          isRequired
        />

        <Input
          id={`client-secret`}
          title="Client Secret"
          value={values.clientSecret}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, clientSecret: e.target.value }))
          }
          type={showPassword ? 'text' : 'password'}
          iconRight={
            <div onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <IoMdEyeOff style={{ width: '25px', height: '25px' }} />
              ) : (
                <IoMdEye style={{ width: '25px', height: '25px' }} />
              )}
            </div>
          }
          isRequired
        />

        <div style={{ margin: '20px 0 10px 0' }}>
          <Alert
            status="warning"
            title="Redirect URL"
            description={`${currentUrl}/api/auth/callback/${integration.id}`}
          />
        </div>
        <div>Please add this url to your Oauth provider settings</div>
      </Modal.Message>
      <Modal.Actions>
        <Modal.Button onClick={closeModal} color="red">
          Cancel
        </Modal.Button>
        <Modal.Button color="green" onClick={handleSumbit}>
          Confirm
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

export default observer(SettingsAuthenticationConfigureModal);
