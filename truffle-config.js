const HDWalletProvider = require("@truffle/hdwallet-provider");
const secret = require("./secret.json");
const secretTestnet = require("./secret.testnet.json");

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      provider: () =>
        new HDWalletProvider(secret.mnemonic, `http://localhost:8545`),
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard BSC port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          secretTestnet.mnemonic,
          `https://ropsten.infura.io/v3/${secretTestnet.infura_api_key}`
        ),
      network_id: 3,
      confirmations: 0,
      timeoutBlocks: 500,
      skipDryRun: true,
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          secret.mnemonic,
          `https://mainnet.infura.io/v3/${secret.infura_api_key}`
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
