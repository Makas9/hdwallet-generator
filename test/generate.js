const generator = require('../index.js');

let wallet = generator.bitcoin.generateWallet();

console.log(wallet); // generate main Bitcoin wallet

let generatedWallets = [];

for(let i = 0; i < 5; i++){
    generatedWallets.push(generator.bitcoin.generateKeyPair(i, wallet.rootKey)); // generate more addresses for Bitcoin wallet
}

console.log(generatedWallets);