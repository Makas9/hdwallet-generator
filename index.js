const bitcoin = require('./bitcoin/index.js');
const litecoin = require('./litecoin/index.js');
const ethereum = require('./ethereum/index.js');
const stellar = require('./stellar/index.js'); // use memo instead of HD wallets

module.exports = {
    bitcoin: bitcoin,
    litecoin: litecoin,
    ethereum: ethereum,
    stellar: stellar
};