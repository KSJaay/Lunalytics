import { useMemo, useState } from 'react';
import useCurrentUrl from '../../hooks/useCurrentUrl';

interface CodeDisplayerProps {
  code: string;
  title: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  initialCollapsed?: boolean;
}

const CodeDisplayer = ({
  code = '',
  title = '',
  showLineNumbers = true,
  wrapLines = false,
  initialCollapsed = false,
}: CodeDisplayerProps) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const htmlLines = useMemo(() => {
    const highlighted = code;
    const lines = highlighted.split('\n');
    return lines.map((line, idx) => ({
      key: idx,
      html: line.length ? line : '\u00A0',
    }));
  }, [code]);

  return (
    <div className={`light code-displayer ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="cd-header">
        <div className="cd-title">{title || 'JavaScript'}</div>
        <div className="cd-actions">
          <button className="cd-btn" onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className={`cd-body ${wrapLines ? 'wrap' : 'nowrap'}`}>
          <pre className={`cd-pre ${showLineNumbers ? 'with-lines' : ''}`}>
            <code>
              {htmlLines.map((line) => (
                <span
                  key={line.key}
                  className="cd-line"
                  dangerouslySetInnerHTML={{ __html: line.html }}
                />
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

const MonitorPush = ({ token }: { token: string }) => {
  const currentUrl = useCurrentUrl();

  return (
    <CodeDisplayer
      title="How to send push monitor heartbeats?"
      code={`await fetch('${currentUrl}/api/push', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: '${token}',
    status: 'online', 
    message: 'Service is running smoothly.',
    latency: 123 // in ms
  })
});`}
      initialCollapsed
    />
  );
};

export default MonitorPush;
