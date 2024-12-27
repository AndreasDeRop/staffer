module.exports = {
    port: 9000,
    log: {
      level: "info",
      disabled: true,
    },
    cors: {
      origins: ["http://localhost:5173",],
      maxAge: 3 * 60 * 60,
    },
    database: {
      client: "mysql2",
      host: "localhost",
      port: 3306,
      name: "stafferTest",
      username: "root",
      password: "root",
    },
    auth: {
      argon: {
        saltLength: 16,
        hashLength: 32,
        timeCost: 6,
        memoryCost: 2 ** 17,
      },
      jwt: {
        secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        expirationInterval: 24* 60 * 60 * 1000, // ms (24 hours)
        issuer: 'cyclehub.hogent.be',
        audience: 'cyclehub.hogent.be',
      },
    },
  };
  