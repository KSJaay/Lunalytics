// export interface SlackBlockText {
//   type: string;
//   text: string;
// }

// export interface SlackBlockField {
//   type: string;
//   text: string;
// }

// export interface SlackBlock {
//   type: string;
//   text?: SlackBlockText;
//   fields?: SlackBlockField[];
// }

export interface SlackSchemaType {
  text: { _type: string; _validate: (value: string) => boolean };
  color: { _type: string; _validate: (value: string) => boolean };
  blocks: {
    _type: string;
    _keys: {
      type: {
        _type: string;
        _validate: (value: string) => boolean;
        _required: boolean;
      };
      text: {
        _type: string;
        _required: boolean;
        _keys: {
          type: {
            _type: string;
            _validate: (value: string) => boolean;
            _required: boolean;
          };
          text: {
            _type: string;
            _validate: (value: string) => boolean;
            _required: boolean;
          };
        };
      };
      fields: {
        _type: string;
        _required: boolean;
        _keys: {
          type: {
            _type: string;
            _validate: (value: string) => boolean;
            _required: boolean;
          };
          text: {
            _type: string;
            _validate: (value: string) => boolean;
            _required: boolean;
          };
        };
      };
    };
  };
}

const SlackSchema: SlackSchemaType = {
  text: {
    _type: 'string',
    _validate: (value: string) => value?.length <= 4000,
  },
  color: {
    _type: 'string',
    _validate: (value: string) => /^#(?:[0-9a-f]{3}){1,2}$/i.test(value),
  },
  blocks: {
    _type: 'array',
    _keys: {
      type: {
        _type: 'string',
        _validate: (value: string) =>
          value === 'divider' || value === 'header' || value === 'section',
        _required: true,
      },
      text: {
        _type: 'object',
        _required: true,
        _keys: {
          type: {
            _type: 'string',
            _validate: (value: string) => value === 'plain_text',
            _required: true,
          },
          text: {
            _type: 'string',
            _validate: (value: string) =>
              value?.length > 0 && value?.length <= 150,
            _required: true,
          },
        },
      },
      fields: {
        _type: 'array',
        _required: false,
        _keys: {
          type: {
            _type: 'string',
            _validate: (value: string) =>
              value === 'plain_text' || value === 'mrkdwn',
            _required: true,
          },
          text: {
            _type: 'string',
            _validate: (value: string) =>
              value?.length > 0 && value?.length <= 3000,
            _required: true,
          },
        },
      },
    },
  },
};

const SlackTemplateMessages = {
  basic: {
    color: '#b80a47',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Triggered: Service {{service_name}} is currently down!',
        },
      },
    ],
  },
  pretty: {
    color: '#b80a47',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Triggered: Service {{service_name}} is currently down!',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Service Name*\n{{service_name}}\n\n*Service Address*\n{{service_address}}\n\n*Latency*\n{{heartbeat_latency}} ms\n\n*Error*\n{{heartbeat_message}}',
          },
        ],
      },
    ],
  },
  nerdy: {
    color: '#b80a47',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Triggered: Service {{service_name}} is currently down!',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Service*\n```{{service_parsed_json}}```\n\n*Heartbeat*\n```{{heartbeat_parsed_json}}```',
          },
        ],
      },
    ],
  },
  recovery: {
    color: '#13a452',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Service {{service_name}} is back up!',
        },
      },
    ],
  },
};

export { SlackSchema, SlackTemplateMessages };
