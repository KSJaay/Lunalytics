import { Textarea } from '@lunalytics/ui';

interface MonitorHttpHeadersProps {
  inputs: any;
  errors: any;
  handleInput: (key: string, value: any) => void;
}

const MonitorHttpHeaders = ({
  inputs,
  errors,
  handleInput,
}: MonitorHttpHeadersProps) => {
  const parseHeaders = (body: Record<string, any>) => {
    try {
      if (typeof body === 'object') {
        return JSON.stringify(body, null, 2);
      }
    } catch (error) {
      console.log(error);
      return '';
    }
  };

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">HTTP Headers</label>
      <div className="luna-input-subtitle">
        Add additional headers to be sent with the request. Make sure to follow
        JSON key/value format.
      </div>

      <Textarea
        rows={8}
        error={errors.headers}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          handleInput('headers', e.target.value)
        }
        id="http-headers-textarea"
        color="var(--lunaui-accent-900)"
      >
        {parseHeaders(inputs.headers)}
      </Textarea>
    </div>
  );
};

MonitorHttpHeaders.displayName = 'MonitorHttpHeaders';

export default MonitorHttpHeaders;
