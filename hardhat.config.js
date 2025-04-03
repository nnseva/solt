/**
 * hardhat cofig
 */

require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@atixlabs/hardhat-time-n-mine");

const ethers = require("ethers");

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one hardhat
   * will spin up a development blockchain for you when
   * run `develop` or `test`. You can ask a hardhat command to use a specific
   * network from the command line, e.g
   *
   * $ hardhat test --network <network-name>
   */

  networks: {
    // Useful for testing. The `hardhat` name is special, but not necessary and used by default
    //
    // development: {
    //  url: "127.0.0.1:8545",     // Localhost (default: none)
    //  network_id: "*",       // Any network (default: none)
    // }
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 10000000
  },

  solidity: {
    version: process.env.SOLC_VERSION || "0.8.29",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  }
};
