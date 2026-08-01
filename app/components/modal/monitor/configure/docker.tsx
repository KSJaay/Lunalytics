// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import useFetch from '../../../../hooks/useFetch';
import Loading from '../../../ui/loading';
import { Alert, Button, Input } from '@lunalytics/ui';
import { MdSearch } from 'react-icons/md';
import { useState } from 'react';
import { createGetRequest } from '../../../../services/axios';
import { toast } from 'react-toastify';

interface ModalProps {
  errors: Record<string, string>;
  inputs: Record<string, any>;
  handleInput: (field: string, value: any) => void;
  pageId: string;
}

const MonitorConfigureDockerModal = ({
  errors,
  inputs,
  handleInput,
  pageId,
}: ModalProps) => {
  const [containers, setContainers] = useState<Array<any>>([]);

  const { isError, isLoading } = useFetch({
    url: '/api/docker/containers',
    onSuccess: (data) => setContainers(data),
  });

  const onSearch = async () => {
    try {
      const response = await createGetRequest('/api/docker/containers', {
        socketPath: inputs.socketPath,
      });
      setContainers(response.data);
    } catch {
      setContainers([]);
      toast.error(
        'Error fetching Docker containers. Please check the socket path and try again.'
      );
    }
  };

  return (
    <>
      {pageId === 'basic' ? (
        <div>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: '1fr auto',
            }}
          >
            <Input
              id="input-socket-path"
              title={'Socket Path'}
              value={inputs.socketPath}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleInput('socketPath', event.target.value);
              }}
              error={errors.socketPath}
              color="var(--lunaui-accent-900)"
              placeholder="/var/run/docker.sock"
              subtitle="The socket path to the Docker daemon. For example: /var/run/docker.sock"
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: '100%',
                paddingBottom: '4px',
              }}
            >
              <Button onClick={onSearch}>
                <MdSearch size={20} />
                <div>Search</div>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <Loading
              style={{ width: '100%', height: '100%', margin: '50px 0' }}
            />
          ) : null}
          {isError || !containers?.length ? (
            <div style={{ margin: '25px 0' }}>
              <Alert
                status="error"
                description="Unable to find any Docker containers. Please make sure the Docker daemon is running and you have the necessary permissions to access it."
                title="Missing Containers"
                variant="border"
                style={{ backgroundColor: 'var(--accent-900)' }}
              />
            </div>
          ) : null}
          {containers?.length ? (
            <div>
              <div className="monitor-configure-docker-header">
                <div>Container Name</div>
                <div>Image</div>
                <div style={{ textAlign: 'right', paddingRight: '12px' }}>
                  Actions
                </div>
              </div>

              {containers.map(
                (container: {
                  id: string;
                  name: string;
                  platform: string;
                  image: string;
                }) => (
                  <div
                    key={container.id}
                    className="monitor-configure-docker-item"
                  >
                    <div>
                      <div>{container.name}</div>
                      <div className="monitor-configure-docker-item-platform">
                        {container.platform}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {container.image}
                    </div>
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      {inputs.url === container.name ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--green-700)',
                            paddingRight: '8px  ',
                          }}
                        >
                          Selected
                        </div>
                      ) : (
                        <Button
                          variant="border"
                          color="green"
                          onClick={() => {
                            handleInput('url', container.name);
                          }}
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {pageId === 'interval' ? (
        <MonitorPageInterval
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'notification' ? (
        <MonitorPageNotification
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'advanced' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-xl)',
            color: 'var(--font-light-color)',
            fontWeight: 500,
          }}
        >
          Nothing to see here, maybe there will be more stuff here in the future
        </div>
      ) : null}
    </>
  );
};

MonitorConfigureDockerModal.displayName = 'MonitorConfigureDockerModal';

export default MonitorConfigureDockerModal;
