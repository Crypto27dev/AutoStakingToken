import Web3Modal from 'web3modal';
import Web3 from 'web3/dist/web3.min.js';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';
import { create } from 'ipfs-http-client';
import config from "../config";
import store from "../store";
import { setChainID, setWalletAddr, setBalance, setWeb3 } from '../store/actions';
import { Toast } from '../utils';
import api from '../core/api';
const hundredContractABI = config.hundredContractAbi;
const hundredContractAddress = config.hundredContractAddress;
const USDCABI = config.USDCAbi;
const USDCAddress = config.USDCAddress;

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    show: true,
    network: "rinkeby", // optional
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: config.INFURA_ID, // required
          network: "rinkeby",
          // rpc: {
          //   4: config.mainNetUrl,
          // },
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
    usdcBalance: ''
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
              chainName: 'Avalanche',
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
    let avaxBalance = await web3.eth.getBalance(accounts[0]);
    avaxBalance = web3.utils.fromWei(avaxBalance);
    // const UsdcContract = new web3.eth.Contract(USDCABI, USDCAddress);
    // let usdcBalance = await UsdcContract.methods.balanceOf(accounts[0]).call();
    // usdcBalance = web3.utils.fromWei(usdcBalance, 'mwei');

    store.dispatch(setBalance({
      avaxBalance
    }));
    return {
      success: true,
      usdcBalance: avaxBalance
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
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return false;
  }
  try {
    let accounts = await web3.eth.getAccounts();
    const owner = await window.contract.methods.owner().call();

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
  return returStr;
}

export const getNFTCardInfos = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  console.log('[getNFTCardInfos] = ', web3);
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    const cardInfos = await window.contract.methods.getNFTCardInfos().call();
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

export const getAvaxPrice = async (usdc) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return 0;
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return 0;
  }
  try {
    const avaxPerUSDC = await window.contract.methods.ONE_USDC_AVAX().call();
    const avaxPrice = Number(avaxPerUSDC) * Number(usdc);
    let avaxWei = web3.utils.fromWei(avaxPrice.toString(), 'ether');
    return avaxWei;
  } catch (error) {
    return 0;
  }
}

export const getAllNFTInfos = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const nftInfos = await window.contract.methods.getAllNFTInfos().call({ from: accounts[0] });
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

export const getRewardAmountByNFT = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    const rewardAmount = await window.contract.methods.getRewardAmountByNFT().call();
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
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let item_price = web3.utils.toWei(auctionPrice !== null ? auctionPrice.toString() : '0', 'ether');
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0', 'ether');

    await window.contract.methods.singleMintOnSale(itemId, auctionInterval, item_price, kind).send({ from: currentAddr });

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
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let item_price = web3.utils.toWei(auctionPrice !== null ? auctionPrice.toString() : '0', 'ether');
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0', 'ether');    
    await window.contract.methods.batchMintOnSale(itemIds, auctionInterval, item_price, kind).send({ from: currentAddr });

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
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
    var destroySale = window.contract.methods.destroySale(tokenId);
    let gasFee = await destroySale.estimateGas({ from: currentAddr });
    // console.log("before getBalance");
    var balanceOfUser = await web3.eth.getBalance(currentAddr);
    var gasPrice = 30 * (10 ** 9);

    if (balanceOfUser <= gasFee * gasPrice) {
      Toast.fire({
        icon: 'error',
        title: 'Insufficient balance.'
      });
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

export const buyNow = async (currentAddr, tokenId, price) => {
  /*
  acceptOrEndBid(string memory _tokenHash)
  */
  const web3 = store.getState().auth.web3;
  if (!web3) return;
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
    let item_price = web3.utils.toWei(price !== null ? price.toString() : '0', 'ether');
    //alert("tokenHash = " +  tokenId + ", price=" + item_price);
    var buyNow = window.contract.methods.buyNow(tokenId);
    let gasFee = await buyNow.estimateGas({ from: currentAddr, value: item_price });
    // console.log("before getBalance");
    var balanceOfUser = await web3.eth.getBalance(currentAddr);
    var gasPrice = 30 * (10 ** 9);

    if (balanceOfUser <= gasFee * gasPrice) {
      Toast.fire({
        icon: 'error',
        title: 'Insufficient balance.'
      });
      return;
    }
    await buyNow.send({ from: currentAddr, value: item_price });

    Toast.fire({
      icon: 'error',
      title: 'Succeed in purchasing a NFT.'
    });
    updateBalanceOfAccount();

  } catch (error) {
    Toast.fire({
      icon: 'error',
      title: parseErrorMsg(error.message)
    });
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
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
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
    const tx = await window.contract.methods.addNFTCardInfo(nft.symbol, imageURI, nft.priceUSDC, 0, nft.supply).send({ from: accounts[0] });

    return {
      success: true,
      tx
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 2: " + error.message
    };
  }
}

export const setNFTCardInfo = async (id, imgUri, nft) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let accounts = await web3.eth.getAccounts();
    const tx = await window.contract.methods.setNFTCardInfo(id, nft.symbol, imgUri, nft.priceUSDC, 0, nft.supply).send({ from: accounts[0] });
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

export const mintNfts = async (id, count, avax) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let item_price = web3.utils.toWei(avax.toString(), 'ether');
    let accounts = await web3.eth.getAccounts();
    const tx = await window.contract.methods.mintNFTs(id, count).send({ from: accounts[0], value: item_price * count });
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

export const claimByNft = async (id) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let accounts = await web3.eth.getAccounts();
    const tx = await window.contract.methods.claimByNFT(Number(id)).send({ from: accounts[0] });
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
  try {
    window.contract = await new web3.eth.Contract(hundredContractABI, hundredContractAddress);
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong 1: " + error.message,
    };
  }
  try {
    let accounts = await web3.eth.getAccounts();
    const tx = await window.contract.methods.claimAll().send({ from: accounts[0] });
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

export const createSale = async(id, interval, price, kind) => {
  
}