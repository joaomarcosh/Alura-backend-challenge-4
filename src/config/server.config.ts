export default {
  test: { host: process.env.TEST_SERVER_HOST },
  development: { host: process.env.DEV_SERVER_HOST },
  production: { host: process.env.PROD_SERVER_HOST },
};
