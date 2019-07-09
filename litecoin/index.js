const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const crypto = require('crypto');
const LITECOIN = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
};

exports.generateWallet = function(){
    let mnemonic = bip39.generateMnemonic();
    let hashedMnemonic = hashSeed(mnemonic);
    let seed = bip39.mnemonicToSeedSync(hashedMnemonic);
    let hdMaster = bitcoin.bip32.fromSeed(seed, LITECOIN);
    let mainNode = hdMaster.deriveHardened(44).deriveHardened(2).deriveHardened(0);
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

    let hdMaster = bitcoin.bip32.fromBase58(rootKey, LITECOIN);
    let childrenNode = hdMaster.deriveHardened(44).deriveHardened(2).deriveHardened(0).derive(0).derive(childrenIndex);
    return {
        publicKey: childrenNode.publicKey.toString('hex'), //+
        privateKey: childrenNode.toWIF(), //+
        address: getAddress(childrenNode)
    }
};

function getAddress(node) {
    return bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: LITECOIN
        }
    ).address;
}

function hashSeed(seed, times = 50000){
    for(let i = 0; i < times; i++){
        seed = crypto.createHmac('sha256', '').update(seed).digest('hex');
    }
    return seed;
}