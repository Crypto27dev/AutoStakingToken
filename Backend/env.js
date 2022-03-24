const jwt_enc_key = "THIS IS THE AUTH TOKEN ENCTYPTION KEY";
const admin_address = "0xccccCCCCcccccCCCCCCccc";
const signIn_break_timeout =  24*60*60;   //24*60*60 equals with 24 hours
const upload_path = "/public/uploads/";
const mainnet_http_RPC = "https://api.avax.network/ext/bc/C/rpc";
const testnet_http_RPC =  "https://data-seed-prebsc-1-s2.binance.org:8545/";  //"https://api.avax-test.network/ext/bc/C/rpc";

const hundredFactoryABI = require("./src/PinkBananFactory.json");
const hundredFactoryAddress = "0x4790c1929D61B9032fB9cc3A995F71DD91243c31";

const KKEEEYY = "efe03abacb37cc1"+"4d14fcc0c1c"+"664a70b688"+"38240b8"+"e535d17"+"22dbe8bb7a4925"

module.exports  =  { 
	jwt_enc_key, 
	admin_address,
	signIn_break_timeout,
	upload_path,
	mainnet_http_RPC,
	testnet_http_RPC,
	hundredFactoryABI,
	hundredFactoryAddress,
    KKEEEYY
};
