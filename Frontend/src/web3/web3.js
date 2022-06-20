import Web3Modal from 'web3modal';
import Web3 from 'web3/dist/web3.min.js';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';
import { create } from 'ipfs-http-client';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from "../config";
import store from "../store";
import { setChainID, setWalletAddr, setBalance, setWeb3 } from '../store/actions';
import api from '../core/api';
const factoryABI = config.factoryABI;
const factory_Addr = config.factoryContract;
const NftABI = config.NftABI;
const Nft_Addr = config.NftContract;
const BUSD_Addr = config.BUSDAddress;
const BUSD_ABI = config.BUSD_ABI;
const Treasury_Addr = config.TreasuryAddress;
const TOTAL_HOLDERS_URL = `https://api.covalenthq.com/v1/43114/tokens/${Nft_Addr}/token_holders/?quote-currency=USD&format=JSON&page-size=1000000000&key=ckey_4692876c71644fb1b93abfae7f9`;

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    show: true,
    network: "binance", // optional
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: config.INFURA_ID, // required
          network: "binance",
          rpc: {
            56: config.mainNetUrl,
          },
        },
      },
    }, // required
    theme: "dark",
  });
}

let provider = null;
let web3Provider = null;

export const loadWeb3 = async () => {
  try {
    // await web3Modal.updateTheme({
    //   background: "#4f5d21",
    //   main: "rgb(199, 199, 199)",
    //   secondary: "rgb(136, 136, 136)",
    //   border: "rgba(195, 195, 195, 0.14)",
    //   hover: "rgb(16, 26, 32)"
    // });
    // web3Modal.show = true;
    let web3 = new Web3(config.mainNetUrl);
    store.dispatch(setWeb3(web3));
    // await web3Modal.clearCachedProvider();
    if (web3Modal.cachedProvider) {
      await connectWallet();
    }
  } catch (error) {
    console.log('[Load Web3 error] = ', error);
  }
}

export const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  const web3 = new Web3(config.mainNetUrl);
  store.dispatch(setWeb3(web3));
  store.dispatch(setChainID(''));
  store.dispatch(setWalletAddr(''));
  store.dispatch(setBalance({
    bnbBalance: '',
    busdBalance: ''
  }));
}

export const checkNetwork = async () => {
  if (web3Provider) {
    const network = await web3Provider.getNetwork();
    store.dispatch(setChainID(network.chainId));
    return checkNetworkById(network.chainId);
  }
}

export const checkNetworkById = async (chainId) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return false;
  if (web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId)) {
    await changeNetwork();
    return false;
  } else {
    return true;
  }
}

const changeNetwork = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3.utils.toHex(config.chainId) }],
    });
    await getBalanceOfAccount();
  }
  catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: web3.utils.toHex(config.chainId),
              chainName: 'BSC',
              rpcUrls: [config.mainNetUrl] /* ... */,
            },
          ],
        });
        return {
          success: true,
          message: "switching succeed"
        }
      } catch (addError) {
        return {
          success: false,
          message: "Switching failed." + addError.message
        }
      }
    }
  }
}

export const connectWallet = async () => {
  try {
    provider = await web3Modal.connect();
    let web3 = new Web3(provider);
    store.dispatch(setWeb3(web3));
    web3Provider = new providers.Web3Provider(provider);

    await checkNetwork();
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();

    if (account !== undefined) {
      store.dispatch(setWalletAddr(account));
    }

    await getBalanceOfAccount();
    provider.on("accountsChanged", async function (accounts) {
      if (accounts[0] !== undefined) {
        store.dispatch(setWalletAddr(accounts[0]));
        await getBalanceOfAccount();
      } else {
        store.dispatch(setWalletAddr(''));
      }
    });

    provider.on('chainChanged', async function (chainId) {
      store.dispatch(setChainID(chainId));
      if (web3.utils.toHex(chainId) === web3.utils.toHex(config.chainId)) {
        provider = await web3Modal.connect();
        web3 = new Web3(provider);
        web3Provider = new providers.Web3Provider(provider);
        store.dispatch(setWeb3(web3));
      }
    });

    provider.on('disconnect', function (error) {
      store.dispatch(setWalletAddr(''));
    });
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      address: "",
      status: "Something went wrong: " + err.message,
    };
  }
};


export const getBalanceOfAccount = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    let bnbBalance = await web3.eth.getBalance(accounts[0]);
    bnbBalance = web3.utils.fromWei(bnbBalance);

    const BUSDContract = await new web3.eth.Contract(BUSD_ABI, BUSD_Addr);
    let busdBalance = await BUSDContract.methods.balanceOf(accounts[0]).call();
    busdBalance = web3.utils.fromWei(busdBalance);

    store.dispatch(setBalance({
      bnbBalance,
      busdBalance
    }));
    return {
      success: true,
      bnbBalance,
      busdBalance
    }
  } catch (error) {
    console.log('[Get Balance] = ', error);
    return {
      success: false,
      result: "Something went wrong: "
    }
  }
}

export const isOwner = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return false;
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const owner = await factoryContract.methods.owner().call();

    if (compareWalllet(accounts[0], owner)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const signString = async (data) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return;
  var address = data;
  var msgHash = web3.utils.keccak256(data);
  var signedString = "";
  await web3.eth.sign(msgHash, address, function (err, result) {
    if (err) return console.error(err)
    signedString = result;
  })
  return signedString;
}

export const getValidWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          success: true,
          address: addressArray[0],
          status: "Fill in the text-field above.",
        };
      } else {
        return {
          success: false,
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        success: false,
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  } else {
    return {
      success: false,
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual BSC wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const updateBalanceOfAccount = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    let accountBalance = await web3.eth.getBalance(accounts[0]);
    accountBalance = web3.utils.fromWei(accountBalance);
    store.dispatch(setBalance(accountBalance));
    return {
      success: true,
      balance: accountBalance
    }
  } catch (error) {
    return {
      success: false,
      balance: 0,
      result: "Something went wrong: " + error.message
    }
  }
}

export const compareWalllet = (first, second) => {
  if (!first || !second) {
    return false;
  }
  if (first.toUpperCase() === second.toUpperCase()) {
    return true;
  }
  return false;
}

const parseErrorMsg = (errMsg) => {
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length)
    let endPos = subStr.indexOf("\"");
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  if (returStr.indexOf("insufficient funds") > 0) {
    returStr = 'Insufficient funds for the transaction.'
  }
  return returStr;
}

export const getBNBPrice = async (busd) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return 0;
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    const busdInBNB = await factoryContract.methods.ONE_BUSD_IN_BNB().call();
    const bnbPrice = Number(busdInBNB) * Number(busd);
    let bnbWei = web3.utils.fromWei(bnbPrice.toString());
    return bnbWei;
  } catch (error) {
    return 0;
  }
}

export const getNFTCardInfos = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    const cardInfos = await factoryContract.methods.getNFTCardInfos().call();
    return {
      success: true,
      cardInfos
    };

  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const getAllNFTInfos = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const nftInfos = await factoryContract.methods.getAllNFTInfos().call({ from: accounts[0] });
    return {
      success: true,
      nftInfos
    };

  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const getAllSaleInfos = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    const cardInfos = await factoryContract.methods.getNFTCardInfos().call();
    const saleInfos = await factoryContract.methods.getAllSaleInfos().call();
    let nftInfos = [];
    for (let i = 0; i < saleInfos.length; i++) {
      const saleInfo = saleInfos[i];
      const index = await factoryContract.methods._getCIDFromID(saleInfo.tokenId).call();
      const card = cardInfos[index];
      const symbol = card.symbol;
      const price = card.priceBUSD;
      const imgUri = card.imgUri;
      const saleCost = web3.utils.fromWei(saleInfo.salePrice);
      const kindOfCoin = Number(saleInfo.kindOfCoin);
      const tokenId = saleInfo.tokenId;
      const createdTime = saleInfo.createdTime;
      const currentROI = saleInfo.currentROI;
      const currentOwner = saleInfo.currentOwner;
      const nft = { symbol, price, imgUri, saleCost, kindOfCoin, tokenId, createdTime, currentROI, currentOwner };
      nftInfos.push(nft);
    }

    return {
      success: true,
      nftInfos
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const getIndexByTokenID = async (tokenId) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    const id = await factoryContract.methods._allTokenIDToIndex(tokenId).call();
    return {
      success: true,
      id
    };

  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const getRewardAmountByNFT = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    const rewardAmount = await factoryContract.methods.getRewardAmountByNFT().call();
    return {
      success: true,
      rewardAmount
    };

  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const singleMintOnSale = async (currentAddr, itemId, auctionInterval, auctionPrice, kind = 0) => {
  /*
  Single Sell :  singleMintOnSale(string memory _tokenHash, uint _interval, uint _startPrice, uint24 _royalty, uint8 _kind)
  */

  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  if (auctionInterval === undefined || auctionInterval <= 0 || auctionInterval === null)
    auctionInterval = 0;

  console.log("before creating contract")
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);

  try {
    let item_price = web3.utils.toWei(auctionPrice !== null ? auctionPrice.toString() : '0');
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0');

    await factoryContract.methods.singleMintOnSale(itemId, auctionInterval, item_price, kind).send({ from: currentAddr });

    return {
      success: true,
      status: "Put on sale succeed"
    };

  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const batchMintOnSale = async (currentAddr, itemIds = [], auctionInterval, auctionPrice, kind = 0) => {
  /*
  Batch Sell :  batchMintOnSale(string memory _tokenHash, uint _interval, uint _startPrice, uint24 _royalty, uint8 _kind)
  */

  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  if (auctionInterval === undefined || auctionInterval <= 0 || auctionInterval === null)
    auctionInterval = 0;
  console.log("before creating contract")
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let item_price = web3.utils.toWei(auctionPrice !== null ? auctionPrice.toString() : '0');
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0');    
    await factoryContract.methods.batchMintOnSale(itemIds, auctionInterval, item_price, kind).send({ from: currentAddr });

    return {
      success: true,
      status: "Put on sale succeed"
    };

  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const destroySale = async (currentAddr, tokenId) => {
  /*
  Cancel Sale : destroySale(string memory _tokenHash)
  */
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
    var destroySale = factoryContract.methods.destroySale(tokenId);
    let gasFee = await destroySale.estimateGas({ from: currentAddr });
    var balanceOfUser = await web3.eth.getBalance(currentAddr);
    var gasPrice = 30 * (10 ** 9);

    if (balanceOfUser <= gasFee * gasPrice) {
      toast.error('Insufficient balance.');
      return {
        success: false
      };
    }
    await destroySale.send({ from: currentAddr });
    // updateUserBalanceAfterTrading(currentAddr);
    return {
      success: true
    };
  } catch (error) {
    console.log(error.message);
    return {
      success: false
    };
  }
}

export const buyNow = async (tokenId, price, kindOfCoin) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return;
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false, status: 'Please connect a wallet.' }
    let item_price = web3.utils.toWei(price.toString());
    const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
    const estimate = factoryContract.methods.buyNow(tokenId);
    let gasFee = 0;
    if (kindOfCoin === 0) {
      gasFee = await estimate.estimateGas({ from: accounts[0], value: item_price });
    } else {
      const BUSDContract = await new web3.eth.Contract(BUSD_ABI, BUSD_Addr);
      await BUSDContract.methods.approve(factory_Addr, item_price).send({ from: accounts[0] });
      gasFee = await estimate.estimateGas({ from: accounts[0] });
    }
    var balanceOfUser = await web3.eth.getBalance(accounts[0]);
    var gasPrice = 30 * (10 ** 9);

    if (balanceOfUser <= gasFee * gasPrice) {
      return {
        success: false,
        status: 'Insufficient balance.'
      };
    }
    if (kindOfCoin === 0) {
      await estimate.send({ from: accounts[0], value: item_price });
    } else {
      await estimate.send({ from: accounts[0] })
    }
    updateBalanceOfAccount();
    return {
      success: true
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      status: parseErrorMsg(error.message)
    };
  }
}

export const createNftFile = async (file, title, description) => {
  const client = create('https://ipfs.infura.io:5001/api/v0')
  try {
    const image_hash = await client.add(file);
    const metadata = JSON.stringify({
      name: title,
      description: description,
      image: api.ipfsUrl + image_hash.cid.toString()
    });
    const meta_hash = await client.add(metadata);
    const token_uri = api.ipfsUrl + meta_hash.cid.toString();
    return {
      success: true,
      image_uri: api.ipfsUrl + image_hash.cid.toString(),
      token_uri: token_uri
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error uploading file: ' + error
    }
  }
};

export const addNftCardInfo = async (nft, file) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  let tokenURI, imageURI;
  const result = await createNftFile(file, nft.symbol, '');
  if (result.success) {
    imageURI = result.image_uri;
    tokenURI = result.token_uri;
    console.log('[imageURI] = ', imageURI);
    console.log('[tokenURI] = ', tokenURI);
  }
  else {
    return {
      success: false,
      status: result.error,
    };
  }
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const price = Number(nft.priceBUSD);
    const estimate = factoryContract.methods.addNFTCardInfo(nft.symbol, imageURI, price, nft.supply);
    await estimate.estimateGas({ from: accounts[0] });
    const tx = await estimate.send({ from: accounts[0] });
    return {
      success: true,
      tx
    };
  } catch (error) {
    return {
      success: false,
      status: error.message
    };
  }
}

export const setNFTCardInfo = async (id, imgUri, nft) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const price = Number(nft.priceBUSD);
    const estimate = await factoryContract.methods.setNFTCardInfo(id, nft.symbol, imgUri, price, nft.supply);
    await estimate.estimateGas({ from: accounts[0] });
    const tx = await estimate.send({ from: accounts[0] });
    return {
      success: true,
      tx
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const mintNfts = async (id, count, bnb) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let item_price = web3.utils.toWei(bnb.toString());
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const estimate = factoryContract.methods.mintNFTs(id, count);
    await estimate.estimateGas({ from: accounts[0], value: item_price * count });

    const tx = await estimate.send({ from: accounts[0], value: item_price * count });
    return {
      success: true,
      tx
    };
  } catch (error) {
    console.log('[Mint Nfts] = ', parseErrorMsg(error.message))
    return {
      success: false,
      status: parseErrorMsg(error.message)
    };
  }
}

export const claimByNft = async (id) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const estimate = factoryContract.methods.claimByNFT(Number(id));
    await estimate.estimateGas({ from: accounts[0] });
    const tx = await estimate.send({ from: accounts[0] });
    return {
      success: true,
      tx
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const claimAll = async (id) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const estimate = factoryContract.methods.claimAll();
    await estimate.estimateGas({ from: accounts[0] });
    const tx = await estimate.send({ from: accounts[0] });
    return {
      success: true,
      tx
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const createSale = async (id, price, kind) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
  const NftContract = await new web3.eth.Contract(NftABI, Nft_Addr);
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    let item_price = web3.utils.toWei(price.toString());

    var estimate = NftContract.methods.setApprovalForAll(factory_Addr, true);
    await estimate.estimateGas({ from: accounts[0] });
    var tx = await estimate.send({ from: accounts[0] });

    estimate = factoryContract.methods.createSaleReal(id, item_price, kind);
    await estimate.estimateGas({ from: accounts[0] });
    tx = await estimate.send({ from: accounts[0] });
    return {
      success: true,
      tx
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: parseErrorMsg(error.message)
    };
  }
}

export const getTreasuryBalance = async () => {
  try {
    const web3 = store.getState().auth.web3;
    if (!web3) return { success: false }
    const balance = await web3.eth.getBalance(Treasury_Addr);
    const factoryContract = await new web3.eth.Contract(factoryABI, factory_Addr);
    const busdInBNB = await factoryContract.methods.ONE_BUSD_IN_BNB().call();
    const busd = web3.utils.fromWei(balance.toString()) / web3.utils.fromWei(busdInBNB.toString());
    return {
      success: true,
      balance: busd
    }
  } catch (error) {
    return {
      success: false,
      status: parseErrorMsg(error.message)
    }
  }
}

export const getNftHolders = async () => {
  try {
    const { data: response } = await axios.get(TOTAL_HOLDERS_URL);
    return response.data.items.length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}