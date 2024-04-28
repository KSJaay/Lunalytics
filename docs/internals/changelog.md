# Previous updates

## v0.4.1

### Fixes sign/register errors/adds reset password script

Pretty quick update, adds a new script to reset a user's password based on email. Currently, it's a command but may look into sending emails to the user instead in the future.

### Update

- Register page now shows errors when email, username, or password formats are incorrect
- Register page now shows an error if the email is already registered
- Signin page now shows errors when email, or password formats are incorrect
- Signin page now shows errors when email doesn't exist
- Signin page now shows errors when email exists but password is incorrect

### Features

- A user's password can now be reset using `npm run reset:password`

## v0.4.0

### Adds TCP monitoring and new UI for adding/editing monitors

### New features

- Monitor TCP connections
- New UX for adding/editing monitors
- Moved to multiple pages for adding/editing monitor instead of one single page
- Added lastCheck and nextCheck for monitor which will be used in the future
- Added cleanPartialMonitor, cleanMonitor, cleanCertificate, and cleanHeartbeat functions to reduce size of monitors, certificates, and heartbeats
- Added port and type to schema
- Adds migration script for this update

### Updates

- Moved check tcp and http functions into the tools folder for better organisation
- Updated css to better support mobile/tablet devices
- Updates how migration scripts work (no longer set to automatic by default)
- CSS classNames clean ups

## v0.3.12

### Removes .env, adds setup script and load env script

PR to clean up some stuff, along with adding a setup script and load env. This also means this application is no longer in unstable, I've tested everything and it seems to be looking good.

### New features:

- Adds setup script using `inquirer`
- Adds loadEnv script

### Updates

- Updates `README` to include features, how to setup application, requirements and other information.
- Fixes issue with `New` button showing on homepage for all users
- Adds element types for `Dropdown.Item`
- Updates password regex
- Fixes issue with `uptimePercentage` and `averageHeartbeatLatency` updating for monitors

## v0.3.11

### Adds new system for heartbeats and better graph system

### Summary

We're close to being ready for release, everything seems to be working nicely. Hopefully, within the next few updates we should be ready to release 🤞🏽

### New Features

- Cronjobs to check average latency every 5 minutes and 1 hour
- Menu with options to change ping graph to show latest, 1 day, 1 week, or 1 month heartbeats

### Updates

- Adds `PRAGMA foreign_keys` to delete records in heartbeats, and certs when a monitor gets deleted.
- Removes needing `.env` for users to use the application
- Moves cors to development only
- Removed monitorId from heartbeats

## v0.3.10

### Cleans up css and adds some support for mobile

Cleans up css and adds some support for mobile. Mobile support still needs a lot of work but this update cleans up a few of the issues.

## v0.3.9

A### dds context providers and new designs for homepage

### Features

- A MUCH nicer menu on the homepage
- Ability to search/filter monitors
- New layouts available for the homepage
- You can now edit monitor information
- Added context provider for localStorage
- Added new designs button
- New icons

### Updates

- Moved modals into their own folder in components
- Cleaned up propTypes
- Updated some endpoints to return status code instead of redirects
- Updated system to redirect owner to the dashboard instead of the verify page

## v0.3.8

### Updates global store and better heartbeat tracking

Updates the global store to use `Map` instead of objects and arrays. Along with adding `nextCheck` to all the monitors so calls to the server are a little bit more in sync with the heartbeat check. Still needs some improvements but it's working pretty well right now.

## v0.3.7

### Adds new dropdown menu design/logic

While the old dropdown menu worked, there were a few issues with it as clicking outside it wouldn't close the menu, and some random UX issues that occurred. This PR updates the menu to a nicer design, along with some extra features. It also closes down when the user now clicks outside of the dropdown menu.

## v0.3.6

### Adds propTypes and displayName for all components

propTypes now throw errors when they have not been provided, also removed `react-refresh/only-export-components` as components are exported using `mobx observer` and this was showing warnings for those components. Added some custom propType shapes for `userPropType`, `monitorPropType`, `fullMonitorPropType`, `heartbeatPropType`, `certPropType`, and `colorPropType`.

Added `displayName` for better debugging issues.

## v0.3.5

### Adds useContextStore and useTeamStore

Created a new function for `useContextStore` that returns `useContext(ContextStore)` which should clean up the codebase a little bit, along with a new team store that stores the `team` on the manage team page in settings. This means the team is being updated correctly when an admin updates a user's permissions or denies/approves them instead of needing to refresh.

## v0.3.4

### Moves to /auth endpoints and adds hooks/handlers

Cleaning up the code base and moved to /auth endpoints for register and login as we no longer use a form and have CORS issues. Also, added handlers and hooks for register/login to clean up the code base and make it a lot easier to read the code.

## v0.3.3

### Updates register/signin pages

The project is getting to a point where the production build is almost ready. While there are still a few more changes that need to be made, this update changes the register/login page to a new style. Along with updating some config files to prepare for production builds.

### Updates:

- Changes registration from one page to three pages
- Updates the UX for loginpage
- Removed username from register/login journey/database
- Removed redirects from serverside as it was causing issues
- Adds error message to the TextInput
- Removes auth form component
- Adds markdown for information about endpoints

## v0.3.2

### Adds manifest and logos

Adds manifest and logos

## v0.3.1

### Adds basic verify page

Adds basic verify page

## v0.3.0

### Adds support for team members

This update has been a headache and in the works for a few days, there may be still a few bugs that I need to fix. But, this update is a big one for the future of this project. While monitoring is a great feature, there are a lot of monitoring projects that I could have used instead. The main aim of this project is to create a system that allows me to easily share my monitors/status with other people. And allow the ability for them to add/remove their monitors. This update adds the ability to add other users to the project who can manage the project or just as a viewer.

### New features

- Support multiple members
- Ability to change the permission for members
- Adds support for avatars (A little bit of customisation is always nice :D)
- Adds manage team page in settings showing current team members
- New members need to be verified before they can access monitors
- Adds the ability to approve members on the manage team page
- Fetches user on page load from api and stores in `ContextStore`

### New Endpoints

- `/api/user`
- `/api/user/update/username`
- `/api/user/update/avatar`
- `/api/user/team`
- `/api/user/access/decline`
- `/api/user/access/approve`
- `/api/user/access/remove`
- `/api/user/permission/update`

### Updates

- Moves from `userToken` to `access_token`
- Removes `user` cookie
- Users how have columns for `isVerified` and `permissions`
- Moves from inline route functions to middleware route functions
- Adds support for glassmorph for modal
- Renames AlertBox to Modal

## v0.2.4

### Adds user endpoints validation/changes graph height

The username wasn't being validated on the server side, so this PR adds that. Along with reworking how the graph heights work depending on different screen sizes.

## v0.2.3

### Moves endpoints to /api route for future updates

Pretty quick update, moves all the current endpoints to /api route to prepare for some future updates and make life a little easier instead of needing to update in the future.

### Changes:

- `/monitor/add` > `/api/monitor/add`
- `/monitor/delete` > `/api/monitor/delete`
- `/monitor/id` > `/api/monitor/id`
- `/user/monitors` > `/api/user/monitors`
- `/user/update` > `/api/user/update`

## v0.2.2

### Database/Cache overhaul

This update focuses on a total overhaul of the database./caching system. This was mainly to reduce the number of calls being made to the database along with cleaning up how heartbeats are being made/stored. It also updates the system used to

### Changes

- Moves from nanoid to uuid as the id is a little bit cleaner (even though it's longer)
- Logo color changes according to how many monitors are down
- 0 monitors down changes color to primary
- 1 or more monitors down changes color to yellow
- All monitors down will change color to red
- Graph color changes according to the theme
- Overhaul of all database queries and caching

### Bug fixes

- Issue where heartbeat requests were being sent out multiple times (within the same second)
- Settings page wasn't loading as theme was being sent as an object instead of a string
- Issue when adding a new monitor to the database and homepage shows nothing due to errors
- Issue with requesting monitor using ID and it throwing error 501 instead of 404
- Issue with monitors not returning an empty array when no monitors exists

## v0.2.1

### Fixes issues and cleans up codebase

Pretty small update, mainly fixing issues with css and variable names. Along with moving queries into their own files as the `queries.js` file was becoming too big. Lastly, reworked/optimised cache a little bit to make less calls to the database/endpoints.

The next update will mainly focus on an overhaul for cache and optimising the calls to services/database.

### New Logo :D

## v0.2.0

A### dds cert checks, confirmation message, notifications, themes, and time/data formats

### PRs:

This update is mainly a QOL (Quality of Life) update and a few new features. I've decided to move towards a `glassmorphism` style for some of the components. In the future, we'll make this an optional styling system, where users will be able to choose between solid, glassmorphism, and other options. I've also introduced sonner for toast notifications for confirmation and error messages, along with an alert box. Other features/updates are listed below.

### New features

Adds new cooler `dropdown` menu (Still needs work)
Adds `sonner` dependency for toast notifications
Adds `classnames` dependency for conditional classes
Adds `prop-types` dependency to keep track of component props
Adds `husky` dependency to check linting issues before committing
Adds a confirmation `alertbox` when deleting a monitor
Adds `moment` dependency to format time and assign timezones
Adds `hooks` for `themes/colors` and `date/time` formats (Not actually hooks, will make them nicer hooks in the future)
Adds new functions to check `cert status/information`
Adds cert checking to cached monitoring (on startup and then every 24 hours)

### Updates

Changes `scss variables` to `css variables` so they can be used without importing scss globals file
Fixes issue with not `tracking errors` for heartbeats
Moves all the dropdowns from settings to the new dropdown
Moves all the dropdowns from the add monitor to the new dropdown
Changes name for logger from `Logger` to `logger`
Updates `createURL` to append current query parameters

## v0.1.0

### Setups the initial application, login, and registration

This update adds the initial setup for this repository, along with the registration and login page.

### Framework/tools:

React
Vite
Express
SQLite
Knex
JWT

### Routes:

**Endpoint:** /register
**Method:** POST
**Body:** \{ email, username, password \}

**Endpoint:** /signin
**Method:** POST
**Body:** \{ username, password \}