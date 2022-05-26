console.log(process.env.DB_DIALECT_DEV)


export default {
  development: {
    dialect: process.env.DB_DIALECT_DEV,
    database: process.env.DB_NAME_DEV,
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    host: process.env.DB_HOST_DEV,
    // @ts-ignore
    port: parseInt(process.env.DB_PORT_DEV),
    logging: false
  },
  test: {
    dialect: process.env.DB_DIALECT_TEST,
    database: process.env.DB_NAME_TEST,
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    host: process.env.DB_HOST_TEST,
    // @ts-ignore
    port: parseInt(process.env.DB_PORT_TEST)
  },
  production: {
    dialect: process.env.DB_DIALECT_PROD,
    database: process.env.DB_NAME_PROD,
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    host: process.env.DB_HOST_PROD,
    // @ts-ignore
    port: parseInt(process.env.DB_PORT_PROD)
  }
}
