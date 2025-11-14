import { renderToStaticMarkup } from 'react-dom/server';
import NotificationBasicEmailTemplate from './emails/basic.js';
import NotificationPrettyEmailTemplate from './emails/pretty.js';
import NotificationNerdyEmailTemplate from './emails/nerdy.js';
import NotificationRecoveryEmailTemplate from './emails/recovered.js';

const EmailSchema = {};

const EmailTemplateObjects = {
  basic: JSON.stringify({
    serviceName: '{{service_name}}',
    dashboardUrl: '{{service_address}}',
    timestamp: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
  }),
  pretty: JSON.stringify({
    serviceName: '{{service_name}}',
    dashboardUrl: '{{service_address}}',
    timestamp: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
    latency: '{{heartbeat_latency}}',
    status: '{{heartbeat_status}}',
    message: '{{heartbeat_message}}',
  }),
  nerdy: JSON.stringify({
    id: '{{service_monitorId}}',
    serviceName: '{{service_name}}',
    dashboardUrl: '{{service_address}}',
    address: '{{service_address}}',
    type: '{{service_type}}',
    timestamp: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
    status: '{{heartbeat_status}}',
    latency: '{{heartbeat_latency}}',
    statusMessage: '{{heartbeat_message}}',
  }),
  recovery: JSON.stringify({
    serviceName: '{{service_name}}',
    dashboardUrl: '{{service_address}}',
    timestamp: '{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}',
  }),
};

const EmailTemplateMessages = {
  basic: (props) => renderToStaticMarkup(NotificationBasicEmailTemplate(props)),
  pretty: (props) =>
    renderToStaticMarkup(NotificationPrettyEmailTemplate(props)),
  nerdy: (props) => renderToStaticMarkup(NotificationNerdyEmailTemplate(props)),
  recovery: (props) =>
    renderToStaticMarkup(NotificationRecoveryEmailTemplate(props)),
};

export { EmailTemplateObjects, EmailTemplateMessages, EmailSchema };
