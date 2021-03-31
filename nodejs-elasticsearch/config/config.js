module.exports = {
    ipGrpcProviderTestNet: '209.97.169.71:7845',
    dbConfigTestNet: {
        connectionLimit: 10,
        host: "178.128.51.251", //"localhost",// //process.env.DB_HOST,
        user:  "meydev", //process.env.DB_USER,
        password: "meydev@#2021", //"abc123", // //process.env.DB_PASS,
        database: "devapiblockchain", //"xvnd", // //process.env.DB_DBNAME
        system_address: "meey.system",
        predict: "mey"
    },
    ipGrpcProviderMainNet:  '188.166.255.217:7845',
    dbConfigMainNet: {
        connectionLimit: 10,
        host: "128.199.241.255", //"localhost",// //process.env.DB_HOST,
        user: "meypro", //process.env.DB_USER,
        password: "Meypro@#2021+", //"abc123", // //process.env.DB_PASS,
        database: "apiblockchain", //"xvnd", // //process.env.DB_DBNAME
        system_address: "meey.system",
        predict: "mey"
    }
};