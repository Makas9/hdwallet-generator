const ethereum = require('ethereumjs-util');
const bip39 = require('bip39');
const bip32 = require('bip32');
const crypto = require('crypto');

exports.generateWallet = function(){
    let mnemonic = bip39.generateMnemonic();
    let hashedMnemonic = hashSeed(mnemonic);
    let seed = bip39.mnemonicToSeedSync(hashedMnemonic);
    let hdMaster = bip32.fromSeed(seed);
    let mainNode = hdMaster.deriveHardened(44).deriveHardened(60).deriveHardened(0);
    return {
        mnemonic: mnemonic,
        seed: seed.toString('hex'),
        rootKey: hdMaster.toBase58(),
        accountExtPubKey: mainNode.neutered().toBase58(),
        accountExtPriKey: mainNode.toBase58()
    };
};

exports.generateKeyPair = function(childrenIndex, rootKey){
    if(childrenIndex === undefined || rootKey === undefined) throw new Error("You must define children index and mnemonic seed!");

    let hdMaster = bip32.fromBase58(rootKey);
    let childrenNode = hdMaster.deriveHardened(44).deriveHardened(60).deriveHardened(0).derive(0).derive(childrenIndex);

    return {
        publicKey: ethereum.toChecksumAddress(childrenNode.publicKey.toString('hex')),
        privateKey: ethereum.toChecksumAddress(childrenNode.privateKey.toString('hex')), //+
        address: getAddress(childrenNode)
    }
};

function getAddress(node) {
    const pubKey = ethereum.privateToPublic(node.privateKey);
    const addr = ethereum.publicToAddress(pubKey).toString('hex');
    return ethereum.toChecksumAddress(addr);
}

function hashSeed(seed, times = 50000){
    for(let i = 0; i < times; i++){
        seed = crypto.createHmac('sha256', '').update(seed).digest('hex');
    }
    return seed;
}