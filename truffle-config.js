const HDWalletProvider = require("@truffle/hdwallet-provider");
const secretMainnet = require("./secret.mainnet.json");
const secretTestnet = require("./secret.testnet.json");

module.exports = {
    // Uncommenting the defaults below
    // provides for an easier quick-start with Ganache.
    // You can also follow this format for other networks;
    // see <http://truffleframework.com/docs/advanced/configuration>
    // for more details on how to specify configuration options!
    //
    networks: {
        testnet: {
            provider: () =>
                new HDWalletProvider(
                    secretTestnet.mnemonic,
                    `https://rinkeby.infura.io/v3/${secretTestnet.infura_api_key}`
                ),
            network_id: 4,
            confirmations: 0,
            timeoutBlocks: 500,
            skipDryRun: true,
        },
        mainnet: {
            provider: () =>
                new HDWalletProvider(
                    secretMainnet.mnemonic,
                    `https://mainnet.infura.io/v3/${secretMainnet.infura_api_key}`
                ),
            network_id: 1,
            confirmations: 0,
            timeoutBlocks: 500,
            skipDryRun: false,
        },
    },
    compilers: {
        solc: {
            version: "0.8.0",
        },
    },
};
