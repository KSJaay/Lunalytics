export interface HandleMonitorProps {
  name: string;
  type: string;
  url: string;
  method: string;
  port: number;
  valid_status_codes: string[];
  interval: number;
  retry: number;
  retryInterval: number;
  requestTimeout: number;
  monitorId: string;
  notificationId: string;
  notificationType: string;
  headers: string;
  body: string;
  ignoreTls: boolean;
  json_query: any;
}
