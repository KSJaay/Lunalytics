---
aside: false
---

<script setup>
import DividePage from '../components/DividePage.vue';
</script>

# Monitor Resource

## Authorization

Currently monitors are only able to access the API while they are signed into the application. The API requires the `session_token` cookie to be present in the request.

## Restrictions

There are various restrictions applied to the monitor data. The following are some of the important restrictions when creating a monitor.

#### Name

- Name does not have to be unique
- Name must be between 3 and 64 characters

#### URL/IP

- Value must be a valid URL/IP
- Value for IP must be IPv4

#### Method

- Value must be one of the following `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, or `PATCH`

#### Interval, Retry Interval, Request Timeout

- Value must be greater than 20
- Value must be less than 600

#### Port for TCP

- Value must be between 1 and 65535

## Monitor Object

### Partial Monitor Structure

| Field                   | Type    | Description                                              |
| ----------------------- | ------- | -------------------------------------------------------- |
| monitorId               | string  | Unique id for the monitor                                |
| name                    | string  | Name of the monitor                                      |
| url                     | string  | URL/IP of the monitor                                    |
| interval                | number  | Interval between each ping to monitor                    |
| retryInterval           | number  | Retry interval after a failed ping                       |
| requestTimeout          | number  | Request timeout for ping                                 |
| method                  | string  | Method for http monitor                                  |
| headers                 | object  | Headers object for http request                          |
| body                    | object  | Body object for http request                             |
| valid_status_codes      | array   | Array of valid status codes for http request             |
| email                   | string  | Email address for the user who created the monitor       |
| type                    | string  | Type of montior (HTTP/TCP)                               |
| port                    | number  | Port for the TCP monitor                                 |
| uptimePercentage        | number  | Uptime percentage for the monitor over the last 24 hours |
| averageHeartbeatLatency | number  | Average latency for the monitor over the last 24 hours   |
| showFilters             | boolean | Used to check if hourly heartbeats are available         |
| paused                  | boolean | Boolean if the monitor is paused                         |

### Example Partial Monitor

::: code-group

```json [HTTP]
{
  "monitorId": "4d048471-9e85-428b-8050-4238f6033478",
  "name": "Lunalytics",
  "url": "https://demo.lunalytics.xyz/api/status",
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30,
  "method": "GET",
  "headers": {},
  "body": {},
  "valid_status_codes": ["200-299"],
  "email": "KSJaay@lunalytics.xyz",
  "type": "http",
  "port": null,
  "uptimePercentage": 83,
  "averageHeartbeatLatency": 38,
  "showFilters": true,
  "paused": false
}
```

```json [TCP]
{
  "monitorId": "4d048471-9e85-428b-8050-4238f6033478",
  "name": "Lunalytics TCP",
  "url": "127.0.0.1",
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30,
  "method": null,
  "headers": null,
  "body": null,
  "valid_status_codes": null,
  "email": "KSJaay@lunalytics.xyz",
  "type": "tcp",
  "port": 2308,
  "uptimePercentage": 83,
  "averageHeartbeatLatency": 38,
  "showFilters": false,
  "paused": false
}
```

:::

### Full Monitor Structure

| Field                   | Type                                     | Description                                              |
| ----------------------- | ---------------------------------------- | -------------------------------------------------------- |
| monitorId               | string                                   | Unique id for the monitor                                |
| name                    | string                                   | Name of the monitor                                      |
| url                     | string                                   | URL/IP of the monitor                                    |
| interval                | number                                   | Interval between each ping to monitor                    |
| retryInterval           | number                                   | Retry interval after a failed ping                       |
| requestTimeout          | number                                   | Request timeout for ping                                 |
| method                  | string                                   | Method for http monitor                                  |
| headers                 | object                                   | Headers object for http request                          |
| body                    | object                                   | Body object for http request                             |
| valid_status_codes      | array                                    | Array of valid status codes for http request             |
| email                   | string                                   | Email address for the user who created the monitor       |
| type                    | string                                   | Type of montior (HTTP/TCP)                               |
| port                    | number                                   | Port for the TCP monitor                                 |
| uptimePercentage        | number                                   | Uptime percentage for the monitor over the last 24 hours |
| averageHeartbeatLatency | number                                   | Average latency for the monitor over the last 24 hours   |
| showFilters             | boolean                                  | Used to check if hourly heartbeats are available         |
| paused                  | boolean                                  | Boolean if the monitor is paused                         |
| heartbeats              | Array<[Heartbeat](#heartbeat-structure)> | Array of monitor heartbeats                              |
| cert                    | [Certificate](#certificate-structure)    | Information about the certificate                        |

### Example Full Monitor

::: code-group

```json [HTTP]
{
  "monitorId": "4d048471-9e85-428b-8050-4238f6033478",
  "name": "Lunalytics",
  "url": "https://demo.lunalytics.xyz/api/status",
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30,
  "method": "GET",
  "headers": {},
  "body": {},
  "valid_status_codes": ["200-299"],
  "email": "KSJaay@lunalytics.xyz",
  "type": "http",
  "port": null,
  "uptimePercentage": 83,
  "averageHeartbeatLatency": 38,
  "showFilters": true,
  "paused": false,
  "heartbeats": [
    {
      "id": 38,
      "status": 200,
      "latency": 38,
      "date": 1708095536463,
      "isDown": false,
      "message": "200 - OK"
    }
    {
      "id": 23,
      "status": 200,
      "latency": 38,
      "date": 1714178279326,
      "isDown": false,
      "message": "200 - OK"
    },
    ...
  ],
  "cert": {
    "isValid": true,
    "issuer": { "C": "US", "O": "Let's Encrypt", "CN": "R3" },
    "validFrom": "Apr 11 03:50:40 2024 GMT",
    "validTill": "Jul 10 03:50:39 2024 GMT",
    "validOn": ["lunalytics.xyz", "www.lunalytics.xyz"],
    "daysRemaining": "72",
    "nextCheck": 1714178279326
  }
}
```

```json [TCP]
{
  "monitorId": "4d048471-9e85-428b-8050-4238f6033478",
  "name": "Lunalytics TCP",
  "url": "127.0.0.1",
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30,
  "method": null,
  "headers": null,
  "body": null,
  "valid_status_codes": null,
  "email": "KSJaay@lunalytics.xyz",
  "type": "tcp",
  "port": 2308,
  "uptimePercentage": 83,
  "averageHeartbeatLatency": 38,
  "showFilters": false,
  "paused": false,
  "heartbeats": [
    {
      "id": 38,
      "status": "ALIVE",
      "latency": 38,
      "date": 1708095536463,
      "isDown": false,
      "message": "Up and running!"
    }
    {
      "id": 23,
      "status": "ALIVE",
      "latency": 38,
      "date": 1714178279326,
      "isDown": false,
      "message": "Up and running!"
    },
    ...
  ],
  "cert": { "isValid": false }
}
```

:::

## Certificate Object

### Certificate Structure

| Field         | Type    | Description                                             |
| ------------- | ------- | ------------------------------------------------------- |
| isValid       | boolean | Boolean if the certificate is valid                     |
| issuer        | object  | Information about the issuer of the certificate         |
| validFrom     | date    | Date the certificate was issued                         |
| validTill     | date    | Date the certificate expires                            |
| validOn       | array   | Array of urls the certificate is valid for              |
| daysRemaining | number  | Number of days the certificate is valid                 |
| nextCheck     | number  | Time of next time certificate should be checked (in ms) |

### Example Certificate

```json
{
  "isValid": true,
  "issuer": { "C": "US", "O": "Let's Encrypt", "CN": "R3" },
  "validFrom": "Apr 11 03:50:40 2024 GMT",
  "validTill": "Jul 10 03:50:39 2024 GMT",
  "validOn": ["lunalytics.xyz", "www.lunalytics.xyz"],
  "daysRemaining": "72",
  "nextCheck": 1714178279326
}
```

## Heartbeat Object

### Heartbeat Structure

| Field   | Type          | Description                           |
| ------- | ------------- | ------------------------------------- |
| id      | string        | Unique Id for that specific heartbeat |
| status  | number/string | Status code from request              |
| latency | number        | Latency of request                    |
| date    | number        | Date the request was made (in ms)     |
| isDown  | boolean       | Boolean if the monitor is down        |
| message | string        | Message from request                  |

### Example Heartbeat

```json
{
  "id": 23,
  "status": 200,
  "latency": 38,
  "date": 1714178279326,
  "isDown": false,
  "message": "200 - OK"
}
```

## Add a new monitor

<DividePage>

<template #left>

### <Badge type="post" text="POST" /> /api/monitor/add

Returns the [full monitor](#full-monitor-structure) object for the new monitor added. Only editors, admins, and owners are allow to access this endpoint.

### Payload

::: code-group

```json [HTTP]
{
  "name": "Lunalytics",
  "url": "https://lunalytics.xyz/api/status",
  "type": "http",
  "method": "GET",
  "valid_status_codes": ["200-299"],
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30
}
```

```json [TCP]
{
  "name": "Lunalytics",
  "url": "127.0.0.1",
  "type": "tcp",
  "port": 2308,
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30
}
```

:::

### HTTP Response Codes

| Status Code | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| 200         | Success, returns [full monitor](#full-monitor-structure) object |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)       |
| 403         | User is unverified                                              |
| 422         | Invalid monitor information                                     |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  --data '{"name":"Lunalytics","url":"https://lunalytics.xyz/api/status","type":"http","method":"GET","valid_status_codes":["200-299"],"interval":30,"retryInterval":30,"requestTimeout":30}' \
    'https://lunalytics.xyz/api/monitor/add'
```

```js [axios]
axios('/api/monitor/add', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    name: 'Lunalytics',
    url: 'https://lunalytics.xyz/api/status',
    type: 'http',
    method: 'GET',
    valid_status_codes: ['200-299'],
    interval: 30,
    retryInterval: 30,
    requestTimeout: 30,
  },
});
```

:::

</template>
</DividePage>

## Edit a monitor

<DividePage>

<template #left>

### <Badge type="post" text="POST" /> /api/monitor/edit

Returns the [full monitor](#full-monitor-structure) object for the edited monitor added. Only editors, admins, and owners are allow to access this endpoint.

### Payload

::: code-group

```json [HTTP]
{
  "monitorId": "4d048471-9e85-428b-8050-4238f6033478",
  "name": "Lunalytics",
  "url": "https://lunalytics.xyz/api/status",
  "type": "http",
  "method": "GET",
  "valid_status_codes": ["200-299"],
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30
}
```

```json [TCP]
{
  "monitorId": "4d048471-9e85-428b-8050-4238f6033478",
  "name": "Lunalytics",
  "url": "127.0.0.1",
  "type": "tcp",
  "port": 2308,
  "interval": 30,
  "retryInterval": 30,
  "requestTimeout": 30
}
```

:::

### HTTP Response Codes

| Status Code | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| 200         | Success, returns [full monitor](#full-monitor-structure) object |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)       |
| 403         | User is unverified                                              |
| 422         | Invalid monitor information                                     |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  --data '{"monitorId": "4d048471-9e85-428b-8050-4238f6033478","name":"Lunalytics","url":"https://lunalytics.xyz/api/status","type":"http","method":"GET","valid_status_codes":["200-299"],"interval":30,"retryInterval":30,"requestTimeout":30}' \
    'https://lunalytics.xyz/api/monitor/edit'
```

```js [axios]
axios('/api/monitor/edit', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    monitorId: '4d048471-9e85-428b-8050-4238f6033478',
    name: 'Lunalytics',
    url: 'https://lunalytics.xyz/api/status',
    type: 'http',
    method: 'GET',
    valid_status_codes: ['200-299'],
    interval: 30,
    retryInterval: 30,
    requestTimeout: 30,
  },
});
```

:::

</template>
</DividePage>

## Delete monitor

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/monitor/delete

Deletes the monitor, along with the heartbeats and certificates. Only editors, admins, and owners are allow to access this endpoint.

### Query Parameters

`monitorId` <Badge type="tip" text="String" />

Monitor id for the monitor to be deleted.

### HTTP Response Codes

| Status Code | Description                                               |
| ----------- | --------------------------------------------------------- |
| 200         | Success, return status code 200                           |
| 400         | Bad Request, monitorId not provided                       |
| 401         | Unauthorized (Missing `session_token` cookie or API Token) |
| 403         | User is unverified                                        |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  -d "monitorId=4d048471-9e85-428b-8050-4238f6033478" \
    'https://lunalytics.xyz/api/monitor/delete'
```

```js [axios]
axios('/api/monitor/delete', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  params: {
    monitorId: '4d048471-9e85-428b-8050-4238f6033478',
  },
});
```

:::

</template>
</DividePage>

## Get monitor status

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/monitor/status

Endpoint returns an array of [heartbeats](#heartbeat-structure) within the given timespace. Heartbeats for week and month are the heartbeats closest to every fith minute within the time span.

### Query Parameters

`monitorId` <Badge type="tip" text="String" />

Monitor id for the monitor to be deleted.

`Status` <Badge type="tip" text="String" />

Status can either be `latest`, `day`, `week`, or `month`. If no status is specified, the latest status will be returned.

### HTTP Response Codes

| Status Code | Description                                                |
| ----------- | ---------------------------------------------------------- |
| 200         | Success, an array of [heartbeats](#heartbeat-structure)    |
| 400         | Bad Request, monitorId not provided or invalid status type |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)  |
| 403         | User is unverified                                         |
| 404         | Monitor not found                                          |
| 416         | Range Not Satisfiable (Less than 2 monitors)               |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  -d "monitorId=4d048471-9e85-428b-8050-4238f6033478" \
  -d "type=latest" \
    'https://lunalytics.xyz/api/monitor/status'
```

```js [axios]
axios('/api/monitor/status', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  params: {
    monitorId: '4d048471-9e85-428b-8050-4238f6033478',
    type: 'latest',
  },
});
```

:::

</template>
</DividePage>

## Get a specific monitor

<DividePage>

<template #left>

### <Badge type="tip" text="GET" /> /api/monitor/id

Returns the [full monitor](#full-monitor-structure) object for a specific monitor using the given monitor id.

### Query Parameters

`monitorId` <Badge type="tip" text="String" />

Monitor id for the monitor to be deleted.

### HTTP Response Codes

| Status Code | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| 200         | Success, returns the [full monitor](#full-monitor-structure) object |
| 400         | Bad Request, monitorId not provided                                 |
| 401         | Unauthorized (Missing `session_token` cookie or API Token)           |
| 403         | User is unverified                                                  |
| 404         | Monitor not found                                                   |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  -d "monitorId=4d048471-9e85-428b-8050-4238f6033478" \
    'https://lunalytics.xyz/api/monitor/id'
```

```js [axios]
axios('/api/monitor/id', {
  method: 'GET',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  params: {
    monitorId: '4d048471-9e85-428b-8050-4238f6033478',
  },
});
```

:::

</template>
</DividePage>
