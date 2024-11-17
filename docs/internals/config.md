---
aside: false
---

# Config

Configurations are used to set up the server and database. The configurations are stored in a JSON file called `config.json` in the root directory of the project.

## Config variables

| Key           | Type    | Default                        | Reqiured | Description                                                          |
| ------------- | ------- | ------------------------------ | -------- | -------------------------------------------------------------------- |
| cors          | String  | []                             | false    | Comma separated list of domains to allow CORS requests from          |
| database      | Object  | {"name": "lunalytics"}         | false    | Name of the database to use                                          |
| jwtSecret     | String  | Random UUID                    | false    | Secret key used to sign/verify JWT tokens                            |
| isDemo        | boolean | false                          | false    | Set to `enabled` to enable demo mode                                 |
| migrationType | String  | "automatic"                    | false    | Type of migration to run. Can be either "automatic" or "manual"      |
| port          | Number  | 2308                           | false    | Port to run the server on                                            |
| version       | String  | Current version of npm package | false    | Version of Lunalytics, used to apply migrations scripts for database |

### Example config.json

```json
{
  "jwtSecret": "lunalyticsJwtSecretKeyHerePlease",
  "port": 2308,
  "database": { "name": "lunalytics" },
  "isDemo": false,
  "cors": ["http://localhost:3000", "http://localhost:8080"],
  "version": "0.6.0"
}
```
