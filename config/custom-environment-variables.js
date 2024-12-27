module.exports = {
    env: "NODE_ENV",
    port: "PORT",
    database: {
      client: "DATABASE_CLIENT",
      host: "DATABASE_HOST",
      port: "DATABASE_PORT",
      name: "DATABASE_NAME",
      username: "DATABASE_USER",
      password: "DATABASE_PASSWORD",
    },
    auth: {
      jwt: {
        secret: 'AUTH_JWT_SECRET',
      },
    },
  };