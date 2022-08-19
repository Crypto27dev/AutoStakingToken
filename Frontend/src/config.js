const factory_abi = require("./web3/factory.json");
const nft_abi = require("./web3/nft.json");
const usdc_abi = require("./web3/usdc.json");
const usdt_abi = require("./web3/usdt.json");
const hodl_abi = require("./web3/hodl.json");

var config = {
    chainId: 56, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    ipfsUrl: 'https://ipfs.infura.io/ipfs/',
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    // mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    mainNetUrl: 'https://bsc-dataseed.binance.org/',
    factoryContract : "0xdb622bDC8Bf5b8109bDFB059836743c17f21C307",
    factoryABI : factory_abi,
    NftContract: "0xc7531036b08bAbbb7fD810CA656b40515733C1D4",
    NftABI: nft_abi,
    USDCAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDC_ABI: usdc_abi,
    USDTAddress: '0x55d398326f99059ff775485246999027b3197955',
    USDT_ABI: usdt_abi,
    TreasuryAddress: '0x3E5B36d93e8b0CEAdF33BFD4394a0D7d5576811C',
    INFURA_ID: '7b09f04ee8704e8e87a2b969dabd2bfb',
    HODLAddress: '0x558fB21A11F4181a76A75090b6f3B6a450395c99',
    HODL_ABI: hodl_abi
}

export default config;
