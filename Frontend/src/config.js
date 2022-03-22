var abi = require("./web3/hundredFactory.json");
var config = {
    chainId: 97, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    ipfsUrl: 'https://ipfs.infura.io/ipfs/',
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    avaxUsdtPair: "0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256",
    hundredContractAddress : "0x2DCd64389B3e6602B6D3eBc23c78f9942b1C90bA",
    hundredContractAbi : abi
}

export default config;
