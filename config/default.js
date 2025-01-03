module.exports = {
    auth: {
        argon:{
            saltLength:16,
            hashLength:32,
            timeCost:6,
            memoryCost:2**17,
        },
        jwt: {
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
            expirationInterval: 60 * 60 * 1000 * 24, // ms (1 hour)
            issuer: 'delaware.hogent.be', // gaf de token uit
            audience: 'delaware.hogent.be', //
          },
          
    },
    cors: {
        origins: ["https://staffer-n8bk.onrender.com"],
        maxAge: 3 * 60 * 60,
      },
      log: {
        level: "info",
        disabled: false,
      },
    };