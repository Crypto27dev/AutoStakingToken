const factory_abi = require("./web3/factory.json");
const nft_abi = require("./web3/nft.json");
const usdc_abi = require("./web3/usdc.json");
const usdt_abi = require("./web3/usdt.json");

var config = {
    chainId: 56, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    ipfsUrl: 'https://ipfs.infura.io/ipfs/',
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    // mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    mainNetUrl: 'https://bsc-dataseed.binance.org/',
    factoryContract : "0x2eBb49f9B5cE3C8Ae61056beff70d265145007eA",
    factoryABI : factory_abi,
    NftContract: "0xf18Aa4A33ac43Ca33ef1c54Aac2B3C0bE3E2720d",
    NftABI: nft_abi,
    USDCAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDC_ABI: usdc_abi,
    USDTAddress: '0x55d398326f99059ff775485246999027b3197955',
    USDT_ABI: usdt_abi,
    TreasuryAddress: '0x3E5B36d93e8b0CEAdF33BFD4394a0D7d5576811C',
    INFURA_ID: '7b09f04ee8704e8e87a2b969dabd2bfb'
}

export default config;
