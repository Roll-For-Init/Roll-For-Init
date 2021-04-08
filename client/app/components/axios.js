const axios = require('axios');
const { cacheURL, isCached } = require('../redux/actions');
const store = require('../redux/store').default;

axios.interceptors.request.use(req => requestHandler(req));
axios.interceptors.response.use(
  res => responseHandler(res),
  err => errorHandler(err)
);

const requestHandler = req => {
  if (req.method.toLowerCase() === 'get') {
    const data = store.dispatch(isCached(req.url));
    if (data) {
      req.headers.cached = true;
      req.data = data;
      return Promise.reject(req);
    }
  }
  return req;
};

const responseHandler = res => {
  if (res.config.method.toLowerCase() === 'get') {
    if (res.status === 200) {
      store.dispatch(cacheURL(res.config.url, res.data));
    }
  }
  return res;
};
const errorHandler = err => {
  console.log(err);
  return err;
};

module.exports = axios;
