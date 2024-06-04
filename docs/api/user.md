---
aside: false
---

<script setup>
import DividePage from '../components/DividePage.vue';
</script>

# User Resource

## Authorization

Currently users are only able to access the API while they are signed into the application. The API requires the `access_token` cookie to be present in the request. Soon in the future we will be rolling out an update that allows admins to create API keys to access the API, along with restricting what each API key can access.

## Restrictions

There are various restrictions applied to the user data. The following are some of the important restrictions when creating an account.

#### Email

- Email address must be unique and follow the email format
- Email address must be between 3 and 254 characters

#### Password

- Password must be between 8 and 64 characters
- Password must contain one letter, one number or special character
- Passwords can contain the following special characters: !@#$%^&\*~\_-+=

#### Username

- Usernames don't need to be unique
- Usernames must be between 3 and 32 characters
- Usernames can only contain letters, numbers, underscores (\_), and dashes (-)

## User Object

### User structure

| Field       | Type    | Description                                                   |
| ----------- | ------- | ------------------------------------------------------------- |
| email       | string  | The users's email address                                     |
| displayName | string  | Username of the user                                          |
| avatar      | string  | User's avatar url                                             |
| permission  | number  | Permissions the user has to teh application ([roles](#roles)) |
| createdAt   | date    | Date of when the user was created                             |
| isVerified  | boolean | If the user has been verified to accesss the application      |
| canEdit     | boolean | If the user can edit the monitors                             |
| canManage   | boolean | If the user can manage the application/team                   |

### Example User

```json
{
  "email": "KSJaay@lunalytics.xyz",
  "displayName": "KSJaay",
  "avatar": "https://lunalytics.xyz/icons/Panda.png",
  "permission": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isVerified": true,
  "canEdit": true,
  "canManage": true
}
```

### Roles

| Permission | Name   | Description                                                                                             |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------- |
| 1          | Owner  | All permissions                                                                                         |
| 2          | Admin  | Create, read, update, and delete monitors. Change permissions of other users. Remove and approve users. |
| 3          | Editor | Create, read, update, and delete monitors                                                               |
| 4          | Guest  | Read monitors                                                                                           |

<br />

# API Endpoints

<DividePage>

## Get current user

<template #left>

### <Badge type="tip" text="GET" /> /api/user

Returns the [user](#user-structure) object for the current logged in user. This will be updated in the future to return the API key holders account.

### HTTP Response Codes

| Status Code | Description                                               |
| ----------- | --------------------------------------------------------- |
| 200         | Success, returns [user](#user-structure) object           |
| 401         | Unauthorized (Missing `access_token` cookie or API Token) |
| 403         | User is unverified                                        |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
    'https://lunalytics.xyz/api/user'
```

```js [axios]
axios('/api/user', {
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

<DividePage>

## Check user exists

<template #left>

### <Badge type="post" text="POST" /> /api/user/exists

Returns a boolean stating whether the user exists in the database.

### HTTP Response Codes

| Status Code | Description                                               |
| ----------- | --------------------------------------------------------- |
| 200         | Success, returns boolean for if user exists               |
| 400         | Bad Request, email not provided                           |
| 401         | Unauthorized (Missing `access_token` cookie or API Token) |
| 403         | User is unverified                                        |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
  --data '{"email":"KSJaay@lunalytics.xyz"}' \
    "https://lunalytics.xyz//api/user/exists"
```

```js [axios]
axios('/api/user/exists', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    email: 'KSJaay@lunalytics.xyz',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Get user monitors

<template #left>

### <Badge type="tip" text="GET" /> /api/user/monitors

Returns an array of the montiors the user has access to.

### HTTP Response Codes

| Status Code | Description                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 200         | Success, returns an array of [monitor](#monitor-structure) along with [heartbeats](#heartbeat-structure) and [cert](#cert-structure) |
| 400         | Bad Request, email not provided                                                                                                      |
| 401         | Unauthorized (Missing `access_token` cookie or API Token)                                                                            |
| 403         | User is unverified                                                                                                                   |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET \
  -H "Content-Type:application/json" \
  -H "Authorization:API Token" \
    'https://lunalytics.xyz/api/montiors'
```

```js [axios]
axios('/api/user/monitors', {
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

<DividePage>

## Update user display name

<template #left>

### <Badge type="post" text="POST" /> /api/user/update/username

Update the username for the current logged in user.

### Payload

```json
{
  "displayName": "Not KSJaay"
}
```

### HTTP Response Codes

| Status Code | Description                                                |
| ----------- | ---------------------------------------------------------- |
| 200         | Success, username has been updates                         |
| 400         | Bad Request, displayName not provided or is invalid format |
| 401         | Unauthorized (Missing `access_token` cookie)               |
| 403         | User is unverified                                         |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  --data '{"displayName":"Not KSJaay"}'
    "https://lunalytics.xyz/api/user/update/username"
```

```js [axios]
axios('/api/user/update/username', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: {
    displayName: 'Not KSJaay',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Update user password

<template #left>

### <Badge type="post" text="POST" /> /api/user/update/password

Update the password for the current logged in user.

### Payload

```json
{
  "currentPassword": "ReallyOldPassword123",
  "newPassword": "ReallySecurePassword123"
}
```

### HTTP Response Codes

| Status Code | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| 200         | Success, username has been updates                                            |
| 400         | Bad Request, currentPassword or newPassword not provided or is invalid format |
| 401         | Unauthorized (Missing `access_token` cookie or user password is invalid)      |
| 403         | User is unverified                                                            |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  --data '{"currentPassword": "ReallyOldPassword123", "newPassword": "ReallySecurePassword123"}'
    "https://lunalytics.xyz/api/user/update/password"
```

```js [axios]
axios('/api/user/update/password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: {
    currentPassword: 'ReallyOldPassword123',
    newPassword: 'ReallySecurePassword123',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Update user avatar

<template #left>

### <Badge type="post" text="POST" /> /api/user/update/avatar

Update the avatar for the current logged in user.

### Payload

```json
{
  "avatar": "https://lunalytics.xyz/icons/Gerbil.png"
}
```

### HTTP Response Codes

| Status Code | Description                                           |
| ----------- | ----------------------------------------------------- |
| 200         | Success, avatar has been updates                      |
| 400         | Bad Request, avatar not provided or is invalid format |
| 401         | Unauthorized (Missing `access_token` cookie)          |
| 403         | User is unverified                                    |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  --data '{"avatar":"https://lunalytics.xyz/icons/Gerbil.png"}'
    "https://lunalytics.xyz/api/user/update/avatar"
```

```js [axios]
axios('/api/user/update/avatar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: {
    avatar: 'https://lunalytics.xyz/icons/Gerbil.png',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Get team members

<template #left>

### <Badge type="tip" text="GET" /> /api/user/team

Returns an array of [team members](#user-structure).

### HTTP Response Codes

| Status Code | Description                                               |
| ----------- | --------------------------------------------------------- |
| 200         | Success, returns an array of team members                 |
| 401         | Unauthorized (Missing `access_token` cookie or API Token) |
| 403         | User is unverified                                        |

</template>

<template #right>

::: code-group

```[cURL]
curl -X GET
  -H "Content-Type:application/json"
  -H "Authorization:API Token"
    "https://lunalytics.xyz/api/user/team"
```

```js [axios]
axios('/api/user/team', {
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

<DividePage>

## Decline member

<template #left>

### <Badge type="post" text="POST" /> /api/user/access/decline

Decline the request from a member wanting to join the team. Only admins/owners can access this endpoint.

### Payload

```json
{
  "email": "KSJaay@lunalytics.xyz"
}
```

### HTTP Response Codes

| Status Code | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| 200         | Success, declined request                                                             |
| 400         | Bad Request, email not provided                                                       |
| 401         | Unauthorized (Missing `access_token` cookie, API Token, or user isn't an admin/owner) |
| 403         | User is unverified                                                                    |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  -H "Authorization:API Token"
  --data '{"email":"KSJaay@lunalytics.xyz"}'
    "https://lunalytics.xyz/api/user/access/decline"
```

```js [axios]
axios('/api/user/access/decline', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    email: 'KSJaay@lunalytics.xyz',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Approve member

<template #left>

### <Badge type="post" text="POST" /> /api/user/access/approve

Approve the request from a member wanting to join the team. Only admins/owners can access this endpoint.

### Payload

```json
{
  "email": "KSJaay@lunalytics.xyz"
}
```

### HTTP Response Codes

| Status Code | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| 200         | Success, approved request                                                             |
| 400         | Bad Request, email not provided                                                       |
| 401         | Unauthorized (Missing `access_token` cookie, API Token, or user isn't an admin/owner) |
| 403         | User is unverified                                                                    |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  -H "Authorization:API Token"
  --data '{"email":"KSJaay@lunalytics.xyz"}'
    "https://lunalytics.xyz/api/user/access/approve"
```

```js [axios]
axios('/api/user/access/approve', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    email: 'KSJaay@lunalytics.xyz',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Remove Member

<template #left>

### <Badge type="post" text="POST" /> /api/user/access/remove

Remove the user from the team. Only admins/owners can access this endpoint.

### Payload

```json
{
  "email": "KSJaay@lunalytics.xyz"
}
```

### HTTP Response Codes

| Status Code | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| 200         | Success, removed user                                                                 |
| 400         | Bad Request, email not provided                                                       |
| 401         | Unauthorized (Missing `access_token` cookie, API Token, or user isn't an admin/owner) |
| 403         | User is unverified                                                                    |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  -H "Authorization:API Token"
  --data '{"email":"KSJaay@lunalytics.xyz"}'
    "https://lunalytics.xyz/api/user/access/remove"
```

```js [axios]
axios('/api/user/access/remove', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    email: 'KSJaay@lunalytics.xyz',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Update User Permissions

<template #left>

### <Badge type="post" text="POST" /> /api/user/permission/update

Update the permission of a user. Only admins/owners can access this endpoint. Admins are not allowed to change the permission of other users to admin or change their own permission to admin.

### Payload

```json
{
  "email": "KSJaay@lunalytics.xyz",
  "permission": 2
}
```

### HTTP Response Codes

| Status Code | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| 200         | Success, updated user permissions                                                     |
| 400         | Bad Request, email not provided or invalid permission                                 |
| 401         | Unauthorized (Missing `access_token` cookie, API Token, or user isn't an admin/owner) |
| 403         | User is unverified                                                                    |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  -H "Authorization:API Token"
  --data '{"email":"KSJaay@lunalytics.xyz", "permission": 1}'
    "https://lunalytics.xyz/api/user/permission/update"
```

```js [axios]
axios('/api/user/permission/update', {
  method: 'POST',
  headers: {
    Authorization: 'API Token',
    'Content-Type': 'application/json',
  },
  data: {
    email: 'KSJaay@lunalytics.xyz',
    permission: 1,
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Transfer Ownership

<template #left>

### <Badge type="post" text="POST" /> /api/user/transfer/ownership

Transfer the ownership of to another user. Only the owner can access this endpoint, and the owners role will then be updated to a guest. This action is irreversible.

### Payload

```json
{
  "email": "KSJaay@lunalytics.xyz"
}
```

### HTTP Response Codes

| Status Code | Description                                                                |
| ----------- | -------------------------------------------------------------------------- |
| 200         | Success, ownership has been transferred                                    |
| 400         | Bad Request, email not provided, user doesn't exist, or invalid permission |
| 401         | Unauthorized (Missing `access_token` cookie, or user isn't an admin/owner) |
| 403         | User is unverified                                                         |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
  --data '{"email":"KSJaay@lunalytics.xyz"}'
    "https://lunalytics.xyz/api/user/transfer/ownership"
```

```js [axios]
axios('/api/user/transfer/ownership', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: {
    email: 'KSJaay@lunalytics.xyz',
  },
});
```

:::

</template>
</DividePage>

<DividePage>

## Delete Account

<template #left>

### <Badge type="post" text="POST" /> /api/user/delete/account

Delete the users account, user won't be able to do this unless they have transferred their ownership.

### HTTP Response Codes

| Status Code | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| 200         | Success, delete your account                                        |
| 401         | Unauthorized (Missing `access_token` cookie, or user doesn't exist) |
| 403         | User has ownership                                                  |

</template>

<template #right>

::: code-group

```[cURL]
curl -X POST
  -H "Content-Type:application/json"
    "https://lunalytics.xyz/api/user/delete/account"
```

```js [axios]
axios('/api/user/delete/account', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

:::

</template>
</DividePage>
