<div align="center">
  <img src="https://raw.githubusercontent.com/KSJaay/Lunalytics/main/public/LogoWithName.png" width="300px" alt="Lunalytics logo" />
</div>

<h2 align="center">Open source monitoring tool built with Node.js & React</h2>
<div align="center">
  <a href="https://lunalytics.xyz">Documentation</a> ·
  <a href="https://demo.lunalytics.xyz">Try live demo</a> ·
  <a href="https://roadmap.lunalytics.xyz">Roadmap</a> ·
  <a href="https://discord.gg/HkpDnUdf4u">Discord</a>
</div>

![Demo](https://raw.githubusercontent.com/KSJaay/Lunalytics/refs/heads/main/docs/public/demo.gif)

## 📔 Features

- Easy to self-host
- Monitor uptime for HTTP(s)/TCP/PING/JSON Query/
- Support for multiple users
- Fully customisable status/dashboard pages
- Incident management
- Advance role based access control
- Clean and easy to use UX/UI
- Customizable user profiles/themes/colors
- Single sign on support (SSO)
  - Custom (Authentik, Authelia, Keycloak, etc...)
  - Discord
  - Google
  - GitHub
  - Slack
  - Twitch
- Support for notifications
  - Discord
  - Home Assistant
  - Slack
  - Telegram
  - Webhook
  - More to come...

## 🚀 Getting Started

> [!CAUTION]
>
> This project is under active development and still in beta, things may randomly break. But I'll do my best to fix them as soon as possible.

#### Docker

```bash
docker run -d \
  -p 2308:2308 \
  -v /path/to/data:/app/data \
  -v /path/to/logs:/app/logs \
  ksjaay/lunalytics:latest
```

#### Docker Compose

```yaml
# docker-compose.yml
services:
  lunalytics:
    image: ksjaay/lunalytics:latest
    container_name: lunalytics
    ports:
      - '2308:2308'
    volumes:
      - ./path/to/data:/app/data
      - ./path/to/logs:/app/logs
```

#### Requirements

Make sure you have the following applications installed before starting:

- [Nodejs](https://nodejs.org/en/download/) (v22.14.0 or higher)
- Npm or [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Git](https://git-scm.com/)

#### Clone application

```bash
git clone https://github.com/KSJaay/Lunalytics.git
cd Lunalytics
```

#### Setup application

```bash
# Setup application
npm run setup

# Start application using scripts
npm run start

# Alternatively start application using
node server/index.js
```

Lunalytics will be accessible on https://localhost:2308

#### Using pm2 to run application in the background

```bash
# Install pm2 globally
npm install pm2 -g

# Start the server
pm2 start server/index.js --name Lunalytics

# Or start the server using script
pm2 start npm --name "Lunalytics" -- run start

# Optional
pm2 save
pm2 startup

## Monitoring console output
pm2 monit
```

## 🎯 Roadmap

- [x] Custom status pages
- [x] Better design for compact mode
- [x] API keys for users
- [x] Better role based access control
- [ ] Move to Oauth2 for authentication
  - [x] Moved to session based system, but not full Oauth2
- [ ] Add support for multiple databases
  - [x] Add support for PostgreSQL
  - [x] Add support for SQLite
  - [ ] Add support for MongoDB
- [ ] Allow session management (Track/logout from sessions)
- [ ] Add support for more notification services

## ⭐ Help us grow

- Add a star to the project if you like it!
- [AlternativeTo](https://alternativeto.net/software/lunalytics/about/)

## 📖 Backstory

There's a lot of monitoring applications out there and I personally love using uptime-kuma. But, one of the main issues with Uptime-kuma is the ability to share with my friends/colleagues. And for the services that do allow me to share with others, they either have an outdated UI from the 90s or are so expensive I can't justify paying for it.

So I've decided to create my own application that's focused on a developer first experience with support for multiple users.

## Contributors

No longer just me :D

<a href="https://github.com/KSJaay/Lunalytics/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=KSJaay/Lunalytics" />
</a>

## License

See the [LICENSE](https://github.com/KSJaay/Lunalytics/blob/main/LICENSE) file for licensing information.
