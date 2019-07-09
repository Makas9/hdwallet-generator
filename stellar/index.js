const stellar = require('stellar-hd-wallet');
const bip39 = require('bip39');
const crypto = require('crypto');

exports.generateWallet = function(){
    let mnemonic = bip39.generateMnemonic();
    let hashedMnemonic = hashSeed(mnemonic);
    let seed = bip39.mnemonicToSeedSync(hashedMnemonic);
    return {
        mnemonic: mnemonic,
        seed: seed.toString('hex')
    };
};

exports.generateKeyPair = function(childrenIndex, mnemonicSeed){
    if(childrenIndex === undefined || mnemonicSeed === undefined) throw new Error("You must define children index and mnemonic seed!");

    let wallet = stellar.fromSeed(mnemonicSeed);

    return {
        publicKey: wallet.getPublicKey(childrenIndex),
        privateKey: wallet.getSecret(childrenIndex),
        address: wallet.getPublicKey(childrenIndex)
    }
};

function hashSeed(seed, times = 50000){
    for(let i = 0; i < times; i++){
        seed = crypto.createHmac('sha256', '').update(seed).digest('hex');
    }
    return seed;
}