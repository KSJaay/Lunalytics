// import dependencies
import { Input } from '@lunalytics/ui';

interface MonitorPageTcpProps {
  inputs: any;
  errors: any;
  handleInput: (key: string, value: any) => void;
}

const MonitorPageTcp = ({
  inputs,
  errors,
  handleInput,
}: MonitorPageTcpProps) => {
  return (
    <>
      <Input
        id="input-host"
        title="Host"
        value={inputs.url}
        error={errors.url}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInput('url', e.target.value)
        }
        color="var(--lunaui-accent-900)"
        subtitle="The hostname or IP address of the server"
      />

      <Input
        id="input-port"
        title="Port"
        value={inputs.port}
        error={errors.port}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInput('port', e.target.value)
        }
        color="var(--lunaui-accent-900)"
        subtitle="The port number of the server"
      />
    </>
  );
};

MonitorPageTcp.displayName = 'MonitorPageTcp';

export default MonitorPageTcp;
