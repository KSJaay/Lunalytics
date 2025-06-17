---
aside: false
---

<script setup>
import DividePage from '../components/DividePage.vue';
</script>

# Notification Resource

## Authorization

Currently notifications are only able to access the API while they are signed into the application. The API requires the `session_token` cookie to be present in the request.

## Restrictions

There are various restrictions applied to the notification data. The following are some of the important restrictions when creating a notification. Each notification may also have unique values that are not required for others and will be stored in the `data` object field.

#### Platform

- Currently limited to the following platforms:
  - Discord
  - Slack
  - Telegram
  - Webhooks
  - HomeAssistant

#### Message Type

- Message type must be one of the following:
  - Basic
  - Pretty
  - Nerdy

#### Token

- This is the url or authorization token for the notification:
  - For Discord this is the webhook url
  - For Slack this is the webhook url
  - For Telegram this is the bot token
  - For Webhooks this is the url
  - For HomeAssistant this is the long lived access token

### Platform specific requirements

## Notification Object

### Notification Structure

| Field        | Type    | Description                                                               |
| ------------ | ------- | ------------------------------------------------------------------------- |
| id           | string  | Unique id for the monitor                                                 |
| platform     | string  | One of the following: Discord, Slack, Telegram, Webhooks                  |
| messageType  | string  | One of the following: basic, pretty, nerdy                                |
| token        | string  | Token/url for the platform                                                |
| email        | string  | Email address for the user who created the monitor                        |
| isEnabled    | boolean | Boolean if the notification is enabled                                    |
| content      | string  | Additional content for the notification                                   |
| friendlyName | string  | Friendly name for the notification                                        |
| data         | object  | Object containing information about the notification (Varies by platform) |
| createdAt    | date    | Timestamp of when the notification was created                            |

### Example Notification

::: code-group

```json [Discord]
{
  "id": "d8a53324-6c1b-410c-be0e-c17a99d862e6",
  "platform": "Discord",
  "messageType": "basic",
  "token": "https://discord.com/api/webhooks/XXXXXXXXX/XXXXXXXXXXXXXXX",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true,
  "content": "@everyone Ping! Alert from Lunalytics!",
  "friendlyName": "Lunalytics",
  "data": {},
  "createdAt": "2024-11-03 12:00:00"
}
```

```json [Slack]
{
  "id": "d8a53324-6c1b-410c-be0e-c17a99d862e6",
  "platform": "Slack",
  "messageType": "nerdy",
  "token": "https://hooks.slack.com/services/XXXXXXX/XXXXXXXXXXX/X43XxxxXX2XxxxXX",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true,
  "content": null,
  "friendlyName": "Lunalytics",
  "data": { "channel": "#general", "username": "Lunalytics" },
  "createdAt": "2024-11-03 12:00:00"
}
```

```json [Telegram]
{
  "id": "d8a53324-6c1b-410c-be0e-c17a99d862e6",
  "platform": "Telegram",
  "messageType": "pretty",
  "token": "",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true,
  "content": "",
  "friendlyName": "Lunalytics",
  "data": {},
  "createdAt": "2024-11-03 12:00:00"
}
```

```json [Webhooks]
{
  "id": "d8a53324-6c1b-410c-be0e-c17a99d862e6",
  "platform": "Webhook",
  "messageType": "nerdy",
  "token": "https://lunalytics.xyz/api/webhook/alert",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true,
  "content": null,
  "friendlyName": "Lunalytics",
  "data": { "requestType": "form-data" },
  "createdAt": "2024-11-03 12:00:00"
}
```

```json [HomeAssistant]
{
  "id": "d8a53324-6c1b-410c-be0e-c17a99d862e6",
  "platform": "HomeAssistant",
  "messageType": "pretty",
  "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true,
  "content": null,
  "friendlyName": "Lunalytics",
  "data": { 
    "homeAssistantUrl": "https://home-assistant.local:8123",
    "homeAssistantNotificationService": "mobile_app_my_device"
  },
  "createdAt": "2024-11-03 12:00:00"
}
```

:::

## Get all notifications

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/notifications

Returns an array of [notifications](#notification-structure). Only editors, admins, and owners are allowed to access this endpoint.

### HTTP Response Codes

| Status Code | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| 200         | Success, returns an array of [notifications](#notification-structure) |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)             |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
    'https://lunalytics.xyz/api/notifications'
```

```js [axios]
axios('/api/notifications', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
});
```

:::

</template>
</DividePage>

## Get a specific notification

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/notifications/id

Returns a [notification](#notification-structure) for the given id. Only editors, admins, and owners are allowed to access this endpoint.

### Query Parameters

`notificationId` <Badge type="tip" text="String" />

### HTTP Response Codes

| Status Code | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| 200         | Success, returns an object for [notification](#notification-structure) |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)              |
| 404         | Notification not found                                                 |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  -d "notificationId=4d048471-9e85-428b-8050-4238f6033478" \
    'https://lunalytics.xyz/api/notifications/id'
```

```js [axios]
axios('/api/notifications/id', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  params: {
    notificationId: '4d048471-9e85-428b-8050-4238f6033478',
  },
});
```

:::

</template>
</DividePage>

## Create a new notification

<DividePage>

<template #left>

### <Badge type="post" text="POST" /> /api/notifications/create

Create a new [notification](#notification-structure) and returns the notification object. Only editors, admins, and owners are allowed to access this endpoint.

### Payload

::: code-group

```json [Discord]
{
  "platform": "Disord",
  "messageType": "pretty",
  "friendlyName": "Lunalytics",
  "textMessage": "Ping @everyone",
  "token": "https://discord.com/api/webhook/xxxxxxxxxx/xxxxxxx",
  "username": "Lunalytics"
}
```

```json [Slack]
{
  "platform": "Slack",
  "channel": "XXXXXXXXXXXX",
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "textMessage": "Ping @here",
  "token": "https://hooks.slack.com/services/xxxxxxxxx/xxxxxx/xxxxx",
  "username": "Lunalytics"
}
```

```json [Telegram]
{
  "platform": "Telegram",
  "chatId": "xxxxxxxxxx",
  "disableNotification": false,
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "protectContent": false,
  "token": "xxxxxxxxxxxxxxx"
}
```

```json [Webhook]
{
  "platform": "Webhook",
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "requestType": "application/json",
  "showAdditionalHeaders": true,
  "additionalHeaders": {},
  "token": "https://lunalytics.xyz/api/webhook/alert"
}
```

```json [HomeAssistant]
{
  "platform": "HomeAssistant",
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "data": {
    "homeAssistantUrl": "https://home-assistant.local:8123",
    "homeAssistantNotificationService": "mobile_app_my_device"
  }
}
```

:::

### HTTP Response Codes

| Status Code | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| 201         | Success, returns an object for [notification](#notification-structure) |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)              |
| 422         | Return a notification error (Format: `{key: 'message'}`)               |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  --data '{"messageType": "pretty", "friendlyName": "Lunalytics", "textMessage": "Ping @everyone", "token": "https://discord.com/api/webhook/xxxxxxxxxx/xxxxxxx", "username": "Lunalytics"}' \
    'https://lunalytics.xyz/api/notifications/create'
```

```js [axios]
axios('/api/notifications/create', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    messageType: 'pretty',
    friendlyName: 'Lunalytics',
    textMessage: 'Ping @everyone',
    token: 'https://discord.com/api/webhook/xxxxxxxxxx/xxxxxxx',
    username: 'Lunalytics',
  },
});
```

:::

</template>
</DividePage>

## Edit a notification

<DividePage>

<template #left>

### <Badge type="post" text="POST" /> /api/notifications/edit

Edit an existing [notification](#notification-structure) and returns the notification object. Only editors, admins, and owners are allowed to access this endpoint.

### Payload

::: code-group

```json [Discord]
{
  "messageType": "pretty",
  "friendlyName": "Lunalytics",
  "textMessage": "Ping @everyone",
  "token": "https://discord.com/api/webhook/xxxxxxxxxx/xxxxxxx",
  "username": "Lunalytics",
  "id": "4d048471-9e85-428b-8050-4238f6033478",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true
}
```

```json [Slack]
{
  "channel": "XXXXXXXXXXXX",
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "textMessage": "Ping @here",
  "token": "https://hooks.slack.com/services/xxxxxxxxx/xxxxxx/xxxxx",
  "username": "Lunalytics",
  "id": "4d048471-9e85-428b-8050-4238f6033478",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true
}
```

```json [Telegram]
{
  "chatId": "xxxxxxxxxx",
  "disableNotification": false,
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "protectContent": false,
  "token": "xxxxxxxxxxxxxxx",
  "id": "4d048471-9e85-428b-8050-4238f6033478",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true
}
```

```json [Webhook]
{
  "friendlyName": "Lunalytics",
  "messageType": "pretty",
  "requestType": "application/json",
  "showAdditionalHeaders": true,
  "additionalHeaders": {},
  "token": "https://lunalytics.xyz/api/webhook/alert",
  "id": "4d048471-9e85-428b-8050-4238f6033478",
  "email": "KSJaay@lunalytics.xyz",
  "isEnabled": true
}
```

:::

### HTTP Response Codes

| Status Code | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| 200         | Success, returns an object for [notification](#notification-structure) |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)              |
| 422         | Return a notification error (Format: `{key: 'message'}`)               |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  --data '{"messageType": "pretty", "friendlyName": "Lunalytics", "textMessage": "Ping @everyone", "token": "https://discord.com/api/webhook/xxxxxxxxxx/xxxxxxx", "username": "Lunalytics"}' \
    'https://lunalytics.xyz/api/notifications/edit'
```

```js [axios]
axios('/api/notifications/edit', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    messageType: 'pretty',
    friendlyName: 'Lunalytics',
    textMessage: 'Ping @everyone',
    token: 'https://discord.com/api/webhook/xxxxxxxxxx/xxxxxxx',
    username: 'Lunalytics',
  },
});
```

:::

</template>
</DividePage>

## Delete a specific notification

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/notifications/delete

Deletes the notification using the given notificationId. Only editors, admins, and owners are allowed to access this endpoint.

### Query Parameters

`notificationId` <Badge type="tip" text="String" />

### HTTP Response Codes

| Status Code | Description                                               |
| ----------- | --------------------------------------------------------- |
| 200         | Success                                                   |
| 401         | Unauthorized (Missing `session_token` cookie or API Token) |
| 422         | No notificationId provided                                |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  -d "notificationId=4d048471-9e85-428b-8050-4238f6033478" \
    'https://lunalytics.xyz/api/notifications/delete'
```

```js [axios]
axios('/api/notifications/delete', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  params: {
    notificationId: '4d048471-9e85-428b-8050-4238f6033478',
  },
});
```

:::

</template>
</DividePage>

## Toggle a specific notification

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/notifications/toggle

Toggle the notification using the given notificationId and isEnabled query parameter. Only editors, admins, and owners are allowed to access this endpoint.

### Query Parameters

`notificationId` <Badge type="tip" text="String" />

`isEnabled` <Badge type="tip" text="Boolean" />

### HTTP Response Codes

| Status Code | Description                                               |
| ----------- | --------------------------------------------------------- |
| 200         | Success                                                   |
| 401         | Unauthorized (Missing `session_token` cookie or API Token) |
| 422         | No notificationId provided or isEnabled is not a boolean  |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  -d "notificationId=4d048471-9e85-428b-8050-4238f6033478&isEnabled=true" \
    'https://lunalytics.xyz/api/notifications/toggle'
```

```js [axios]
axios('/api/notifications/toggle', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  params: {
    notificationId: '4d048471-9e85-428b-8050-4238f6033478',
    isEnabled: 'true',
  },
});
```

:::

</template>
</DividePage>
