module.exports = {

    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        }
    },
    // networks: {
    //   development: {
    //      host: "okexchaintest.okexcn.com",
    //      port: 26659,
    //      network_id: "*"
    //   }
    // },

    compilers: {
        solc: {
            version: "0.6.12"
        }
    }
};
