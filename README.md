# Roll For Init
A character creator and interactive character sheet web application for the 5e ruleset of the most popular TTRPG in the world. See it live at [rollforinit.herokuapp.com](https://rollforinit.herokuapp.com)! Due to the nature of the hosting, you may need to refresh a few minutes after the initial load to get the full site.

## Demo
Want to see what it's all about? Please see the demo here!

[Demo](https://youtu.be/M_4BxkHDhsE)

## To Run

To run this application, create a file secret.env in the root directory following the guide below. Ensure MONGODB_URI_RULESET is populated with the ruleset from the [5e-database](https://github.com/Roll-For-Init/5e-database). Then, in the root directory, simply run:
```
npm install
npm run start
```

### Required Environment Variables
- JWT_SECRET
  - A secret code such as a uuid.
- REDIS_URL
  - Redis URI and protocol (similar to MONGODB_URI) for 5e-srd-api. 
  - No need to run local redis-server.
- MONGODB_URI
  - Production database for user data
- MONGODB_URI_DEV
  - Development database for user data
- MONGODB_URI_RULESET
  - Database for ruleset data (read-only)

### Additional Environment Variables
- PORT
  - Main port for the web application, defaults to 8080
- PORT_API
  - Separate port for the API, defaults to 3005
- NODE_ENV
  - Set to 'production' if you are building for deployment
  - Set to 'development' if you are developing
- LEGACY_WATCH=1
  - Try adding this flag if you cannot get nodemon to update on changes
- SILENCE_WEBPACK=1
  - Add this flag if you want to silence webpack output

## GitHub Ettiquette

- Commit new features to SEPARATE BRANCHES. Never commit to master.
- Pull often and frequently.
- Ensure that your commits are frequent and descriptive.

## Built With

- [MongoDB](https://github.com/mongodb/mongo) - Database used.
- [React](https://github.com/facebook/react) - Frontend JavaScript library.
- [Express](https://github.com/expressjs/express) -Server/routing API for web app.
- [Node](https://github.com/nodejs/node) - Backend JS runtime.
- [Webpack](https://github.com/webpack/webpack) - JS bundler for performance and ease of deployment.
- [Sass](https://github.com/sass/sass) - Used for easier CSS styling.
- [Bootstrap](https://github.com/twbs/bootstrap) - Frontend framework for website elements and styling.
- [Bagelbits' 5e SRD API](https://github.com/5e-bits/5e-srd-api) - API of the 5e ruleset, minorly altered for this project.
- [Bradley Windybank's MERN stack template](https://github.com/bradwindy/mern-stack-template) - Starter project for the beginning of development.
