module.exports = {
    mode: 'development',
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            gas: 50000000,
            network_id: "*" // Match any network id
        }
    }
};