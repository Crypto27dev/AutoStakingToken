var abi = require("./web3/hundredFactory.json");
var config = {
    chainId: 4, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    ipfsUrl: 'https://ipfs.infura.io/ipfs/',
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    // mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    mainNetUrl: 'https://rinkeby.infura.io/v3/',
    avaxUsdtPair: "0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256",
    hundredContractAddress : "0x4790c1929D61B9032fB9cc3A995F71DD91243c31",
    hundredContractAbi : abi
}

export default config;
