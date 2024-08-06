# Previous updates

## v0.5.3

### Moving away from moment and compressing images

### Summary

Realised that moment wasn't the best library for date/time manipulation and that it was bloating the bundle size. I've decided to move away from moment and use dayjs instead. Along with that I've also compressed and resized all the default avatars. Each avatar was taking up around 1.5MB, they are now taking all nearly under 100KB. Along with that I've also changed the size from 1024x1024 to 512x512. Planning on compressing/resizing further possibly in the future.

### Updates

- Moved from moment to dayjs
- Compressed images

## v0.5.2

### Moves to router and finally adds error page

### Summary

This one is a pretty small update, as I found some issues while working on some future updates. This update fixes issues with auth and user endpoints not handling errors properly, this was mainly because endpoints weren't using try catch statement. Also, not sure why I was checking paths using if statements but that's now been moved to react router and we're going to be using that going forward.

### Updates

- Adds show password button to the login page
- Adds try catch statements to auth and user endpoints
- Delete `access_token` cookie when authorization middleware throws error
- Removes routes file for monitor
- Adds a cool error page that I thought I had added 3 months ago :)

## v0.5.1

### Fixes issue with certificates and moves utils to shared folder

### Summary

There was a lot of duplicate code for utils in the server and app folders. I've decided to create a shared folder which now has all of the code. While moving the files, some of the validators also needed to be reworked so that they can now be used in both the front and backend code. Also, had to fix some issues with certificates not being updated properly.

### Updates

- Moves all utils from app and server to shared folder
- Changes file paths from utils to shared folder
- Fixes issues with certificates not being updated properly
- Updates handlers to support updated validator responses

### Summary

There was an issue where certificates were not being saved to the database due to the value not being parsed as a string. This has been fixed now.

## v0.5.05

### Replaces Sonner with React-Toastify

### Summary

I've decided to replace Sonner with React-Toastify. Sonner looks really nice but the CSS has been causing issues, for some reason it doesn't get loadded into dist and when I build the application it doesn't get loaded properly.

### Updates

- Replaces Sonner with React-Toastify
- Fixes issue with TCP monitor add/edit not working properly

## v0.5.0

### Overhaul for settings page

### Summary

This has been a pretty big update, and took a lot longer than I thought it was going to. I decided to overhaul the whole settings page as it was pretty bad UX, and the mobile experience was pretty much unusable. The new UI now renders a different journey for PC and mobile. Both journeys now being a lot more user friendly and easier to use (at least in my opinion). While working on the settings page, I also decided to add a few new customisation features and fixed a few bugs I found.

### New Features

- Settings page overhaul
- Account management and personalisation moved to their own pages
- Users can now upload URls for avatars (Still able to select from preset avatars)
- Ability to change user password
- Ability to transfer ownership
- Ability to delete your account (Won't delete monitors you've setup)
- Added three new endpoints:
  - `/api/user/update/password`
  - `/api/user/transfer/ownership`
  - `/api/user/delete/account`
- Adds tooltip component
- `useGoBack` hook to go back a page

### Updates

- Added search bar to status code input
- Fixes issues with certs not being fetched on initial load
- Fixes issues with fetching certs crashes server
- Adds buttons with outlines only
- Adds icons to text input (left and right side)
- Reworks timezones files
- Adds new icons
- Setup test servers
- Fixes issues CSS with UX components
- Fixes issues with random issues on server side

## v0.4.7

### Fixes issues with sonner css not loading

### Summary

While testing production builds, I came across an issue where CSS for Sonner wasn't loading properly. I've decided to import the CSS from their Github repo as a temporary fix until repo owners fix the problem.

## v0.4.4

### Adds middleware for demo mode and kanban endpoint

I wanted to create a demo mode on the website that allows the user to log on without needing to create an account and be verified. Demo mode account has `viewer` permissions and is not able to edit any of the current information on the page. Along with that, I've also added a kanban endpoint for the docs, this isn't a fully customisable kanban endpoint but will still allow me to make it dynamic.

## v0.4.3

### Moving server to EcmaScript Modules (ESM)

### Summary

Moved all the server files from CommonJs to EcmaScript Modules. For anyone who doesn't know the difference between CommonJs and EcmaScript Modules (ESM), CommonJs is the legacy module system and esm is an update that uses new syntax for importing and exporting. The following are the main changes that `I` find the most important:

### Variable exports/imports:

- `module.exports.abc = 'abc';` >> `export const abc = 'abc'`
- `const { abc } = require('./abc')` >> `import { abc } from './.js'`

### Default exports/imports:

- `module.exports = 'xyz'` >> `export default 'xyz'`
- `const xyz = require('./xyz')` >> `import xyz from './xyz.js'`

### Multiple variables exports/imports:

- `module.export = { abc, xyz }` >> `export { abc, xyz }`
- `const mod = require('./vars')` >> `import * as mod = require('./vars.js')`

### Why esm instead of CommonJS

I could have stayed with CommonJs for this project, but for the sake of consistency and the ability to share files between the server and the app I wanted to move the server to esm. Now I will be able to create a shared folder that will store all the duplicate files between the server and app.

## v0.4.2

### Adds alert box and start of docs

Preparing for some future updates, this PR adds an alert box, some icons, and url support for avatars. Along with that, I've also started working on the documentation for Lunalytics, this will help users setup the application and also keep track of features.

### Update

- Adds some new icons
- Adds url support for urls for avatars
- Adds new alert messages
- Adds Vitepress for documentation
- Adds documentation for API endpoints (user and monitor)
- Adds documentation containing all previous updates

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
