<div align="center">
  <img src="https://raw.githubusercontent.com/KSJaay/Lunalytics/main/public/LogoWithName.png" width="150px" alt="Lunalytics logo" />
</div>

<h2 align="center">Open source monitoring tool built with Node.js</h2>

## ⭐ Features

- Easy to self-host
- Monitor uptime for HTTP(s)
- Support for multiple users
- Role based access control
- Clean and easy to use UX/UI
- Customizable themes/colors
- Customizable user profiles

## 🚀 Getting Started

#### Requirements

Make sure you have the following applications installed before starting:

- [Nodejs](https://nodejs.org/en/download/) (v20.9.0 or higher)
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

# Optional
pm2 save
pm2 startup

## Monitoring console output
pm2 monit
```

## 📖 Backstory

There's a lot of monitoring applications out there and I personally love using uptime-kuma. But, one of the main issues with Uptime-kuma is the ability to share with my friends/colleagues. And for the services that do allow me to share with others, they either have an outdated UI from the 90s or are so expensive I can't justify paying for it.

So I've decided to create my own application that's focused on a developer first experience for teams and individual users.

## License

See the [LICENSE](https://github.com/KSJaay/Lunalytics/blob/main/LICENSE) file for licensing information.
