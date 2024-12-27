module.exports = {
    port: 9000,
    log: {
      level: "info",
      disabled: false,
    },
    cors: {
      origins: ["http://localhost:5173",],
      maxAge: 3 * 60 * 60,
    },
    // database: {   //uncomment voor production
    //   client: "mysql2",
    //   host: "vichogent.be",
    //   port: 40058,
    //   name: "SDP2_2324_DB_A04",
    //   username: "SDP2-2324-A04",
    //   password: "anyname",
    // },
    database: {
      client: "mysql2",
      host: "localhost",
      port: 3306,
      name: "staffer",
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
  