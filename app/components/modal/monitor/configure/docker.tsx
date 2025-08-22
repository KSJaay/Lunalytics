// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import useFetch from '../../../../hooks/useFetch';
import Loading from '../../../ui/loading';
import { Alert, Button } from '@lunalytics/ui';

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
  const { isError, isLoading, data } = useFetch({
    url: '/api/docker/containers',
  });

  return (
    <>
      {pageId === 'basic' ? (
        <div>
          {isLoading ? (
            <Loading
              style={{ width: '100%', height: '100%', margin: '50px 0' }}
            />
          ) : null}
          {isError || !data?.length ? (
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
          {data?.length ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  padding: '16px 4px 6px 4px',
                  borderBottom: '2px solid var(--accent-500)',
                  marginBottom: '12px',
                  fontWeight: 600,
                }}
              >
                <div>Container Name</div>
                <div>Image</div>
                <div style={{ textAlign: 'right', paddingRight: '12px' }}>
                  Actions
                </div>
              </div>

              {data.map((container) => (
                <div
                  key={container.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    backgroundColor: 'var(--accent-900)',
                    padding: '8px 12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    margin: '12px 0',
                  }}
                >
                  <div>
                    <div>{container.name}</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 'var(--font-xs)',
                        color: 'var(--font-light-color)',
                      }}
                    >
                      {container.platform}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {container.image}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {inputs.url === container.id ? (
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
                          handleInput('url', container.id);
                        }}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
