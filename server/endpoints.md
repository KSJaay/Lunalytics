### Endpoint: /register

**Method:** POST

**Request body:**

| Key      | Type   |
| -------- | ------ |
| email    | String |
| username | String |
| password | String |

**Response:**

| Status | Message              | Body                                                                 |
| ------ | -------------------- | -------------------------------------------------------------------- |
| 401    | Unauthorized         |                                                                      |
| 409    | Conflict             | {message: 'Another user already exists with this email or username'} |
| 422    | Unprocessable Entity | [Register errors](#auth-errors)                                      |
| 302    | Redirect to `/`      |                                                                      |
| 200    | OK                   |                                                                      |

**Conditions:**

- Response status `302` only occurs when the user is the first user to register (assigned as owner)

### Endpoint: /auth/login

**Method:** POST

**Request body:**

| Key      | Type   |
| -------- | ------ |
| email    | String |
| password | String |

**Response:**

| Status | Message              | Body                                        |
| ------ | -------------------- | ------------------------------------------- |
| 401    | Unauthorized         | [Invalid credentials](#invalid-credentials) |
| 418    | I'm a teapot         |                                             |
| 422    | Unprocessable Entity | [Login errors](#login-errors)               |
| 200    | OK                   |                                             |

**Conditions:**

- Response status `302` to `/verify` only occurs when the user is not verified
- Response status `302` to `/` only occurs when the user is verified

### Endpoint: /auth/logout

**Method:** GET

**Response:**

Status code 302 with redirect to /login

### Endpoint: /api/monitor/add

**Method:** POST

**Request body:**

| Key            | Type    |
| -------------- | ------- |
| name           | String  |
| url            | String  |
| method         | String  |
| interval       | Integer |
| retryInterval  | Integer |
| requestTimeout | Integer |

**Response:**

| Status | Message              | Body                                                                                                                                        |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 401    | Unauthorized         | [Invalid credentials](#invalid-monitor-credentials)                                                                                         |
| 422    | Unprocessable Entity | [Monitor Errors](#invalid-monitor-information)                                                                                              |
| 200    | OK                   | {...[Monitor Object](#monitor-object), cert: [Certificate Object](#certificate-object), heartbeats: [Heartbeat Object](#heartbeat-object) } |

### Endpoint: /api/monitor/delete

**Method:** GET

**Request query:**

| Key       | Type   |
| --------- | ------ |
| monitorId | String |

**Response:**

| Status | Message      | Body                                                |
| ------ | ------------ | --------------------------------------------------- |
| 401    | Unauthorized | [Invalid credentials](#invalid-monitor-credentials) |
| 200    | OK           |                                                     |

### Endpoint: /api/monitor/id

**Method:** GET

**Request query:**

| Key       | Type   |
| --------- | ------ |
| monitorId | String |

**Response:**

| Status | Message              | Body                                                                                                                                        |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Bad Request          | {error: 'No monitorId provided'}                                                                                                            |
| 401    | Unauthorized         | [Invalid credentials](#invalid-monitor-credentials)                                                                                         |
| 422    | Unprocessable Entity | {message: 'Monitor does not exist'}                                                                                                         |
| 200    | OK                   | {...[Monitor Object](#monitor-object), cert: [Certificate Object](#certificate-object), heartbeats: [Heartbeat Object](#heartbeat-object) } |

### Endpoint: /api/user

**Method:** GET

**Response:**

| Status | Message                            | Body                        |
| ------ | ---------------------------------- | --------------------------- |
| 401    | User doesn't exist/isn't logged in |                             |
| 403    | User is unverified                 |                             |
| 200    | OK                                 | [User Obejct](#user-object) |

### Endpoint: /auth/user/exists

**Method:** POST

**Request body:**

| Key   | Type   |
| ----- | ------ |
| email | String |

**Response:**

| Status | Message                            | Body    |
| ------ | ---------------------------------- | ------- |
| 400    | Email not provided                 |         |
| 401    | User doesn't exist/isn't logged in |         |
| 403    | User is unverified                 |         |
| 200    | OK                                 | boolean |

### Endpoint: /api/user/monitors

**Method:** POST

**Response:**

| Status | Message                            | Body                                                                                                                                               |
| ------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 401    | User doesn't exist/isn't logged in |                                                                                                                                                    |
| 403    | User is unverified                 |                                                                                                                                                    |
| 200    | OK                                 | Array[{...[Monitor Object](#monitor-object), cert: [Certificate Object](#certificate-object), heartbeats: [Heartbeat Object](#heartbeat-object) }] |

### Endpoint: /api/user/usernmae

**Method:** POST

**Request body:**

| Key         | Type   |
| ----------- | ------ |
| displayName | String |

**Response:**

| Status | Message                            | Body                                     |
| ------ | ---------------------------------- | ---------------------------------------- |
| 400    | Invalid display name               | [Invalid Display Name](#username-errors) |
| 401    | User doesn't exist/isn't logged in |                                          |
| 403    | User is unverified                 |                                          |
| 200    | OK                                 | Empty                                    |

### Endpoint: /api/user/avatar

**Method:** POST

**Request body:**

| Key    | Type   |
| ------ | ------ |
| avatar | String |

**Response:**

| Status | Message                            | Body  |
| ------ | ---------------------------------- | ----- |
| 401    | User doesn't exist/isn't logged in |       |
| 403    | User is unverified                 |       |
| 200    | OK                                 | Empty |

### Endpoint: /api/user/team

**Method:** POST

**Request body:**

| Key    | Type   |
| ------ | ------ |
| avatar | String |

**Response:**

| Status | Message                            | Body                                                                         |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| 400    | Invalid avatar                     | {message: 'Avatar must be a valid Imgur URL or one of the default avatars.'} |
| 401    | User doesn't exist/isn't logged in |                                                                              |
| 403    | User is unverified                 |                                                                              |
| 200    | OK                                 | Array[[Member](#member-object)]                                              |

### Endpoint: /api/user/access/decline

**Method:** POST

**Request body:**

| Key   | Type   |
| ----- | ------ |
| email | String |

**Response:**

| Status | Message            | Body                                             |
| ------ | ------------------ | ------------------------------------------------ |
| 400    | Email not provided |                                                  |
| 401    | Unauthorized       | [Invalid credentials](#invalid-user-credentials) |
| 403    | User is unverified |                                                  |
| 200    | OK                 |                                                  |

### Endpoint: /api/user/access/approve

**Method:** POST

**Request body:**

| Key   | Type   |
| ----- | ------ |
| email | String |

**Response:**

| Status | Message            | Body                                             |
| ------ | ------------------ | ------------------------------------------------ |
| 400    | Email not provided |                                                  |
| 401    | Unauthorized       | [Invalid credentials](#invalid-user-credentials) |
| 403    | User is unverified |                                                  |
| 200    | OK                 |                                                  |

### Endpoint: /api/user/access/remove

**Method:** POST

**Request body:**

| Key   | Type   |
| ----- | ------ |
| email | String |

**Response:**

| Status | Message            | Body                                             |
| ------ | ------------------ | ------------------------------------------------ |
| 400    | Email not provided |                                                  |
| 401    | Unauthorized       | [Invalid credentials](#invalid-user-credentials) |
| 403    | User is unverified |                                                  |
| 200    | OK                 |                                                  |

### Endpoint: /api/user/permission/update

**Method:** POST

**Request body:**

| Key        | Type    |
| ---------- | ------- |
| email      | String  |
| permission | Integer |

**Response:**

| Status | Message            | Body                                             |
| ------ | ------------------ | ------------------------------------------------ |
| 400    | Bad Request        | [Invalid Permission](#invalid-permission)        |
| 401    | Unauthorized       | [Invalid credentials](#invalid-user-credentials) |
| 403    | User is unverified |                                                  |
| 200    | OK                 |                                                  |

## Register Errors

#### Email errors

| Type           | Response                                                 |
| -------------- | -------------------------------------------------------- |
| Invalid length | { email: 'Email must be between 3 and 254 characters.' } |
| Invalid format | { email: 'Email is not valid' }                          |
| No email       | { email: 'No email provided' }                           |

#### Password errors

| Type           | Response                                                      |
| -------------- | ------------------------------------------------------------- |
| Invalid length | { password: 'Password must be between 8 and 64 characters.' } |
| Invalid format | { password: 'Password is not valid' }                         |

#### Username errors

| Type           | Response                                                                             |
| -------------- | ------------------------------------------------------------------------------------ |
| Invalid length | { username: 'Username must be between 3 and 32 characters.' }                        |
| Invalid format | { username: 'Username can only contain letters, numbers, underscores, and dashes.' } |

## Login Errors

#### Invalid credentials

| Type             | Response                               |
| ---------------- | -------------------------------------- |
| Invalid email    | { message: 'User does not exist' }     |
| Invalid password | { message: 'Password does not match' } |

#### Email errors

| Type           | Response                                                 |
| -------------- | -------------------------------------------------------- |
| Invalid length | { email: 'Email must be between 3 and 254 characters.' } |
| Invalid format | { email: 'Email is not valid' }                          |
| No email       | { email: 'No email provided' }                           |

#### Password errors

| Type           | Response                                                      |
| -------------- | ------------------------------------------------------------- |
| Invalid length | { password: 'Password must be between 8 and 64 characters.' } |
| Invalid format | { password: 'Password is not valid' }                         |

## Monitor Errors

### Invalid Monitor Credentials

| Status code | Reason                                        |
| ----------- | --------------------------------------------- |
| 401         | Invalid access_token                          |
| 401         | Invalid user                                  |
| 401         | User doesn't have permissions to edit monitor |

### Invalid Monitor Information

| Type                        | Reason                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| Invalid Name                | {message: 'Please enter a valid name. Only letters, numbers and - are allowed.'}                         |
| Invalid URL                 | {message: 'Please enter a valid URL.'}                                                                   |
| Invalid Method              | {message: 'Please select a valid method.'}                                                               |
| Invalid Interval            | {message: 'Please enter a valid interval.'}                                                              |
| Invalid Interval time       | {message: 'Please enter a valid interval. Interval should be between 20 and 600 seconds.'}               |
| Invalid retryInterval       | {message: 'Please enter a valid retry interval.'}                                                        |
| Invalid retryInterval time  | {message: 'Please enter a valid retry interval. Retry interval should be between 20 and 600 seconds.'}   |
| Invalid requestTimeout      | {message: 'Please enter a valid request timeout.'}                                                       |
| Invalid requestTimeout time | {message: 'Please enter a valid request timeout. Request timeout should be between 20 and 600 seconds.'} |

## Invalid User Credentials

| Status code | Reason                                        |
| ----------- | --------------------------------------------- |
| 401         | Invalid access_token                          |
| 401         | Invalid user                                  |
| 401         | User doesn't have permissions to update users |

## Invalid Permission

| Type                              | Message                                              |
| --------------------------------- | ---------------------------------------------------- |
| Unauthorized to change permission | {message: 'You cannot change this user permission.'} |
| Invalid permission type           | Empty                                                |
| Invalid email                     | Empty                                                |

## Monitor Object

| Key                | Type    |
| ------------------ | ------- |
| id                 | Integer |
| monitorId          | String  |
| name               | String  |
| url                | String  |
| interval           | Integer |
| retryInterval      | Integer |
| requestTimeout     | Integer |
| method             | String  |
| headers            | String  |
| body               | String  |
| valid_status_codes | String  |
| email              | String  |
| nextCheck          | Number  |

## Certificate Object

| Key           | Type      |
| ------------- | --------- |
| id            | Integer   |
| monitorId     | String    |
| isValid       | Boolean   |
| issuer        | String    |
| validFrom     | Timestamp |
| validTill     | Timestamp |
| validOn       | String    |
| daysRemaining | Integer   |

## Heartbeat Object

| Key       | Type      |
| --------- | --------- |
| id        | Integer   |
| monitorId | String    |
| status    | Integer   |
| latency   | Integer   |
| date      | Timestamp |
| isDown    | Boolean   |
| message   | String    |

## User Object

| Key         | Type    |
| ----------- | ------- |
| displayName | String  |
| avatar      | String  |
| email       | String  |
| isVerified  | Boolean |
| permission  | Integer |
| canEdit     | Boolean |
| canManage   | Boolean |

## Member Object

| Key         | Type      |
| ----------- | --------- |
| email       | String    |
| displayName | String    |
| avatar      | String    |
| isVerified  | Boolean   |
| permission  | Integer   |
| createdAt   | Timestamp |

## Default response for all endpoints:

| Status Code | Type                                          |
| ----------- | --------------------------------------------- |
| 401         | Forbidden access when access_token is invalid |
| 403         | User is unverified                            |
| 404         | Page not found                                |
| 500         | Internal server error                         |
