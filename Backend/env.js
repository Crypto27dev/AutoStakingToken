const jwt_enc_key = "THIS IS THE AUTH TOKEN ENCTYPTION KEY";
const admin_address = "0xccccCCCCcccccCCCCCCccc";
const signIn_break_timeout =  24*60*60;   //24*60*60 equals with 24 hours
const upload_path = "/public/uploads/";
const mainnet_http_RPC = "https://api.avax.network/ext/bc/C/rpc";
const testnet_http_RPC =  "https://data-seed-prebsc-1-s2.binance.org:8545/";  //"https://api.avax-test.network/ext/bc/C/rpc";

const pinkBananaFactoryABI = require("./src/PinkBananFactory.json");
const pinkBananaFactoryAddress = "0x2DCd64389B3e6602B6D3eBc23c78f9942b1C90bA";

const KKEEEYY = "efe03abacb37cc1"+"4d14fcc0c1c"+"664a70b688"+"38240b8"+"e535d17"+"22dbe8bb7a4925"

module.exports  =  { 
	jwt_enc_key, 
	admin_address,
	signIn_break_timeout,
	upload_path,
	mainnet_http_RPC,
	testnet_http_RPC,
	pinkBananaFactoryABI,
	pinkBananaFactoryAddress,
    KKEEEYY
};
