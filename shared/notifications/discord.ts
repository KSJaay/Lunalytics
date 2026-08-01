const DiscordSchema = {
  content: {
    _type: 'string',
    _validate: (value: string) => value?.length <= 2000,
    _required: false,
  },
  tts: {
    _type: 'boolean',
    _required: false,
  },
  embeds: {
    _type: 'array',
    _required: false,
    _keys: {
      color: {
        _type: 'number',
        _validate: (value: number) => value >= 0 && value <= 16777215,
        _required: false,
      },
      author: {
        _type: 'object',
        _required: false,
        _keys: {
          name: {
            _type: 'string',
          },
          url: {
            _type: 'string',
          },
          icon_url: {
            _type: 'string',
          },
        },
      },
      title: {
        _type: 'string',
        _validate: (value: string) => value.length > 0 && value.length <= 3000,
        _required: false,
      },
      url: {
        _type: 'string',
        _validate: (value: string) => value.length > 0 && value.length <= 3000,
        _required: false,
      },
      description: {
        _type: 'string',
        _validate: (value: string) => value.length > 0 && value.length <= 3000,
        _required: false,
      },
      fields: {
        _type: 'array',
        _required: false,
        _keys: {
          name: {
            _type: 'string',
            _validate: (value: string) =>
              value.length > 0 && value.length <= 3000,
            _required: true,
          },
          value: {
            _type: 'string',
            _validate: (value: string) =>
              value.length > 0 && value.length <= 3000,
            _required: true,
          },
          inline: {
            _type: 'boolean',
            _required: false,
          },
        },
      },
      thumbnail: {
        _type: 'object',
        _required: false,
        _keys: {
          url: {
            _type: 'string',
          },
        },
      },
      image: {
        _type: 'object',
        _required: false,
        _keys: {
          url: {
            _type: 'string',
          },
        },
      },
      footer: {
        _type: 'object',
        _required: false,
        _keys: {
          text: {
            _type: 'string',
          },
          icon_url: {
            _type: 'string',
          },
        },
      },
    },
  },
  allowed_mentions: {
    _type: 'object',
    _required: false,
    _keys: {
      parse: {
        _type: 'array',
        _required: false,
        _validate: (value: string[]) => {
          if (!value?.length) return true; // Nothing has been passed in
          const validParseTypes = ['roles', 'users', 'everyone'];
          return value.every((v: string) => validParseTypes.includes(v));
        },
      },
      roles: { _type: 'array' },
      users: { _type: 'array' },
    },
  },
};

const DiscordTemplateMessages = {
  basic: {
    embeds: [
      {
        color: 12061255,
        title: 'Triggered: Service {{service_name}} is currently down!',
      },
    ],
  },
  pretty: {
    embeds: [
      {
        color: 12061255,
        title: 'Triggered: Service {{service_name}} is currently down!',
        description:
          '**Service Name**\n{{service_name}}\n\n**Service Address**\n{{service_address}}\n\n**Latency**\n{{heartbeat_latency}} ms\n\n**Error**\n{{heartbeat_message}}',
      },
    ],
  },
  nerdy: {
    embeds: [
      {
        color: 12061255,
        title: 'Triggered: Service {{service_name}} is currently down!',
        description:
          '**Service**\n```{{service_parsed_json}}```\n\n**Heartbeat**\n```{{heartbeat_parsed_json}}```',
        footer: { text: `{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}` },
      },
    ],
  },
  recovery: {
    embeds: [
      {
        color: 1287250,
        title: 'Service {{service_name}} is back up!',
        footer: { text: `{{date[YYYY-MM-DDTHH:mm:ssZ[Z]]}}` },
      },
    ],
  },
};

export { DiscordSchema, DiscordTemplateMessages };
