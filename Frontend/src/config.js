const factory_abi = require("./web3/factory.json");
const nft_abi = require("./web3/nft.json");
const usdc_abi = require("./web3/usdc.json");
const busd_abi = require("./web3/busd.json");

var config = {
    chainId: 56, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    ipfsUrl: 'https://ipfs.infura.io/ipfs/',
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    // mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    mainNetUrl: 'https://bsc-dataseed.binance.org/',
    factoryContract : "0xb56ae4951833a3722D7Df9D9546eb59333015dc6",
    factoryABI : factory_abi,
    NftContract: "0x9493be9A4810C1de2E9bBBEBD16C64db2A8993F4",
    NftABI: nft_abi,
    USDCAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDC_ABI: usdc_abi,
    BUSDAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    BUSD_ABI: busd_abi,
    TreasuryAddress: '0xEb899B87260618c777f3E51d3c5c531f21b71965',
    INFURA_ID: '7b09f04ee8704e8e87a2b969dabd2bfb'
}

export default config;
