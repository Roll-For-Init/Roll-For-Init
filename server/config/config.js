const isDev = (process.env.NODE_ENV !== "production")
module.exports = {
  isDev: isDev,
  db: isDev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI
};
