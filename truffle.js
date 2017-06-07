var HDWalletProvider = require("truffle-hdwallet-provider");

/* TODO
 *  Insert here your 12 words mnemonic key
 */
const mnemonic = '..';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 4709176,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "localhost",
      port: 8546,
      network_id: 3
    },
    kovan: {
      host: 'localhost',
      port: 8545,
      gasLimit: 409176,
      gas: 4709176,
      network_id: 42,
      from: '0x00E0B33cDb3AF8B55CD8467d6d13BC0Ba8035acF'
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io"),
      network_id: 4
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
      network_id: 3
    }
  }
};
