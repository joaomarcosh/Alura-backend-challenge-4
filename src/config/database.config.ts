export default {
  test: {
    type: process.env.TEST_DB_TYPE as any,
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT, 10) || 5432,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    database: process.env.TEST_DB_NAME,
    dropSchema: true,
    synchronize: true,
  },
  development: {
    type: process.env.DEV_DB_TYPE,
    host: process.env.DEV_DB_HOST,
    port: parseInt(process.env.DEV_DB_PORT, 10) || 5432,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASS,
    database: process.env.DEV_DB_NAME,
    dropSchema: true,
    synchronize: true,
  },
  production: {
    type: process.env.PROD_DB_TYPE,
    host: process.env.PROD_DB_HOST,
    port: parseInt(process.env.PROD_DB_PORT, 10) || 5432,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASS,
    database: process.env.PROD_DB_NAME,
    dropSchema: false,
    synchronize: false,
  } 
};

