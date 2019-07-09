# hdwallet-generator
Generates HD wallets for selected cryptocurrencies.

# Currently supported cryptocurrencies

- Bitcoin
- Ethereum
- Litecoin
- Stellar

# Usage

Use `generateWallet` to generate HD wallet and `generateKeyPair` to generate addresses.

```Javascript
const generator = require('hdwallet-generator');

let wallet = generator.bitcoin.generateWallet();

let generatedWallets = [];

for(let i = 0; i < 5; i++){
    generatedWallets.push(generator.bitcoin.generateKeyPair(i, wallet.rootKey));
}
```
