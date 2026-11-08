import { useEffect, useState } from 'react';
import initSqlJs, { QueryExecResult } from 'sql.js';
import { typeToText } from '../../home/header';
import Loading from '../../ui/loading';

function sqlJsResultToObjects<T = Record<string, any>>(
  result: QueryExecResult[]
): T[] {
  const { columns, values } = result[0];

  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i] as any]))
  ) as T[];
}

const parseJsonSafe = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

const notificationName = (str: string) => {
  const lowerCaseStr = str?.toLowerCase();

  if (lowerCaseStr === 'apprise') {
    return 'Apprise';
  } else if (lowerCaseStr === 'discord') {
    return 'Discord';
  } else if (lowerCaseStr === 'smtp') {
    return 'Email';
  } else if (lowerCaseStr === 'homeassistant') {
    return 'HomeAssistant';
  } else if (lowerCaseStr === 'pushover') {
    return 'Pushover';
  } else if (lowerCaseStr === 'slack') {
    return 'Slack';
  } else if (lowerCaseStr === 'telegram') {
    return 'Telegram';
  } else if (lowerCaseStr === 'webhook') {
    return 'Webhook';
  }
};

const formatUptimeKumaData = (data: any[]) => {
  const formatData = (row: any) => {
    switch (row.type) {
      case 'dns': {
        return {
          name: row.name,
          url: row.hostname,
          port: row.port,
          type: 'dns',
          dnsResolver: row.dns_resolve_server,
          dnsRecordType: row.dns_resolve_type,
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
      case 'docker': {
        return {
          name: row.name,
          url: row.docker_container,
          type: 'json',
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
          dockerSocket: '/var/run/docker.sock', // Need to update this to get from another table and add to this table
        };
      }
      case 'gamedig': {
        return {
          name: row.name,
          type: 'gamedig',
          url: row.hostname,
          port: row.port,
          game: row.game,
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
      case 'http': {
        return {
          name: row.name,
          type: 'http',
          url: row.url,
          method: row.method,
          valid_status_codes: row.accepted_statuscodes_json,
          headers: row.headers,
          body: row.body,
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
      case 'json-query': {
        return {
          name: row.name,
          type: 'http',
          url: row.url,
          method: row.method,
          valid_status_codes: row.accepted_statuscodes_json,
          headers: row.headers,
          body: row.body,
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          json_query: [
            {
              key: row.json_path,
              operator: row.json_path_operator,
              value: row.expected_value,
            },
          ],
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
      case 'ping': {
        return {
          name: row.name,
          url: row.hostname,
          type: 'ping',
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
      case 'push': {
        return {
          name: row.name,
          url: row.push_token,
          type: 'push',
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
      case 'port': {
        // TCP for Lunalytics
        return {
          name: row.name,
          url: row.hostname,
          port: row.port,
          type: 'tcp',
          paused: row.active === 0,
          created_at: row.created_date,
          retry: row.maxretries,
          interval: row.interval,
          retryInterval: row.retry_interval,
          requestTimeout: row.timeout,
          upsideDown: row.upside_down === 1,
          notificationId: null, // Needs to be mapped
          notificationType: 'All',
        };
      }
    }
  };

  return data.map(formatData);
};

const formatUptimeKumaNotificationData = (data: any[]) => {
  return data.map(({ id, config, name }) => {
    const parsedConfig = parseJsonSafe(config);

    return {
      id,
      type: notificationName(parsedConfig?.type),
      config: parsedConfig,
      name,
    };
  });
};

const formatUptimeKumaHeartbeatData = (data: any[]) => {
  return data.map(({ id, monitor_id, status, msg, time, ping }) => ({
    id,
    monitorId: monitor_id,
    status: status === 1 ? 'UP' : 'DOWN',
    latency: Math.ceil(ping) || 0,
    date: new Date(time).toISOString(),
    isDown: status !== 1,
    message: msg,
  }));
};

const SQL = await initSqlJs({
  locateFile: () => '/sql-wasm.wasm',
});

type SourceType = 'monitors' | 'notifications';

const SetupImportSQLite = ({ file }: { file: File }) => {
  const [fileContent, setFileContent] = useState<any>(null);
  const [source, setSource] = useState<SourceType>('monitors');

  useEffect(() => {
    const loadFileData = async () => {
      const buffer = await file.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(buffer));

      const monitors = db.exec('SELECT * FROM monitor');
      const notifications = db.exec('SELECT * FROM notification');
      const heartbeats = db.exec('SELECT * FROM heartbeat');

      [
        'heartbeat',
        'notification',
        'monitor_notification',
        'monitor_tag',
        'setting',
        'docker_host',
        'api_key',
        'monitor',
        'stat_daily',
        'stat_hourly',
        'stat_minutely',
      ];

      setFileContent({
        monitors: formatUptimeKumaData(sqlJsResultToObjects(monitors)),
        heartbeats: formatUptimeKumaHeartbeatData(
          sqlJsResultToObjects(heartbeats)
        ),
        notifications: formatUptimeKumaNotificationData(
          sqlJsResultToObjects(notifications)
        ),
      });
    };

    loadFileData();
  }, [file]);

  if (!fileContent) {
    return (
      <div style={{ padding: '80px 0' }}>
        <Loading maxWidth={false} />
      </div>
    );
  }

  return (
    <div>
      <div className="source-switch">
        {['Monitors', 'Notifications'].map((type) => (
          <button
            key={type}
            className={source === type.toLowerCase() ? 'active' : ''}
            onClick={() => {
              setSource(type.toLowerCase() as SourceType);
            }}
          >
            {type}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '8px',
          marginBottom: '16px',
        }}
      >
        {fileContent[source].map((item: any, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '2px 8px',
              border: '2px solid var(--accent-600)',
              borderRadius: '8px',
              gap: '2px',
            }}
          >
            <div>{item?.name || 'Unknown'}</div>
            <div style={{ color: 'var(--font-light-color)' }}>
              {typeToText[item?.type as keyof typeof typeToText] ||
                item?.type ||
                'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupImportSQLite;
