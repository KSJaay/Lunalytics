# Configuration

## Setup Lunalytics

Configurations don't need to be setup before starting Lunalytics. But this it is HIGHLY recommended you run the setup script or create a `config.json` for security reasons. A script can be created by running the following command:

::: code-group

```bash [npm]
# Setup application
npm run setup
```

```bash [yarn]
# Setup application
yarn setup
```

```bash [pnpm]
# Setup application
pnpm setup

```

:::

The following values need to be added to the config.json file:

::: code-group

```json [config.json]
{
  "port": Number,
  "migrationType": String,
  "database": {
    "name": String
  },
  "version": String,
  "isDemo": Boolean
}
```

:::

### Port

Port needs to be a number between 1 and 65535. The application will be hosted on this port.

### JWT Secret Key

We use Json Web Tokens (JWT) to authenticate users. The JWT is signed using a secret key, and then stored in the users cookies. Any requests made to the API is verified using the JWT token (`session_token` cookie). We strongly recommend the JWT secret key being at least 64 bytes.

### Migration Type

Migration type can be one of the following:

- automatic
- manual

When migration type is set to `automatic`, the application will automatically run migrations, when the latest version is pulled from GitHub. When it is set to `manual`, the application will not run migrations. You can manually run migrations using the `npm run migrate` command.

### Database

Database is an Object that contains a name key with the name of the database. In the future this will be expanded with other database options.

### Version

Version is the current version of the application. This is used in the migrations script to determine which migrations to run. For example, if the version is `0.4.0` and the latest version is `0.5.0`, then migrations from `0.4.0` to `0.5.0` will be run.

### isDemo

isDemo is a boolean that is used to determine if the application is in demo mode. When it is in demo mode, users will not be required to log into the application and will be given access to the application as a `guest` user.
