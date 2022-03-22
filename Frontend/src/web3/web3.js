import Web3 from 'web3/dist/web3.min.js';
import config from "../config";
import store from "../store";
import { setChainID, setWalletAddr, setBalance } from '../store/actions';
import { Toast } from '../utils';
const hundredContractABI = config.hundredContractAbi;
const hundredContractAddress = config.hundredContractAddress;

export const ipfsAddress = "https://ipfs.infura.io/ipfs/";
export const loadWeb3 = async () => 
{
  if (window.ethereum) 
  {
    window.web3 = new Web3(window.ethereum);
    window.web3.eth.handleRevert = true
  } 
  else if (window.web3) 
  {
    window.web3 = new Web3(Web3.givenProvider);
    window.web3.eth.handleRevert = true
  } 
  else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
    return;
  }
  if (window.ethereum) {
    window.ethereum.on('chainChanged', function (chainId) {
      checkNetworkById(chainId);

    });
    window.web3.eth.getChainId().then((chainId) => {
      checkNetworkById(chainId);
    })
    window.ethereum.on('disconnect', function(error  /*:ProviderRpcError*/) {
      store.dispatch(setWalletAddr(0));
    });
    window.ethereum.on('accountsChanged', function(accounts /*: Array<string>*/) {
       console.log("wallet "+accounts[0]+" is connected");
       if(accounts[0]   !== undefined) {
        store.dispatch(setWalletAddr(accounts[0]));
       }
    });
  }
};

export const checkNetwork = async () => {
  if (window.web3) {
    const chainId = await window.web3.eth.getChainId();
    return checkNetworkById(chainId);
  }
}

export const checkNetworkById = async (chainId) => {
  if (window.web3.utils.toHex(chainId) !== window.web3.utils.toHex(config.chainId)) {
    await changeNetwork();      
  }
  const cid = await window.web3.eth.getChainId();
  store.dispatch(setChainID(cid));
  return (window.web3.utils.toHex(cid) === window.web3.utils.toHex(config.chainId) )
}

const changeNetwork = async () => 
{
  try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: window.web3.utils.toHex(config.chainId) }],
      });
    } 
  catch (switchError) 
    {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) 
      {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: window.web3.utils.toHex(config.chainId),
                chainName: 'Avalanche',
                rpcUrls: [config.mainNetUrl] /* ... */,
              },
            ],
          });
          return {
            success : true,
            message : "switching succeed"
          }
        } catch (addError) {          
          return {
            success : false,
            message : "Switching failed." + addError.message
          }
        }
      }
    }
}

export const signString = async (data) => 
{
  var address = data;
  var msgHash = window.web3.utils.keccak256(data);
  var signedString = "";
  await window.web3.eth.sign(msgHash, address, function (err, result) 
  {
    if (err) return console.error(err)
    signedString = result;
  })
  return signedString;
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        success: true,
        status: "Metamask successfuly connected.",
        address: addressArray[0],
      };
      checkNetwork();
      return obj;
    } catch (err) {
      return {
        success: false,
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  }
  else {
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

export const updateBalanceOfAccount = async () => 
{
  const web3 = window.web3;
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

export const compareWalllet = (first, second) => 
{
  if (!first || !second) {
    return false;
  }
  if (first.toUpperCase() === second.toUpperCase()) {
    return true;
  }
  return false;
}

const parseErrorMsg = (errMsg) =>
{  
  var returStr  = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if(startPos >= 0)
  {
    let subStr = errMsg.substring(startPos+4, errMsg.length)
    let endPos = subStr.indexOf("\"");
    if(endPos >= 0)
    {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  }else returStr = errMsg;
  return returStr;
}

export const singleMintOnSale = async (currentAddr, itemId, auctionInterval, auctionPrice, kind = 0) => 
{
  /*
  Single Sell :  singleMintOnSale(string memory _tokenHash, uint _interval, uint _startPrice, uint24 _royalty, uint8 _kind)
  */
  
  const web3 = window.web3;  
  if(auctionInterval === undefined || auctionInterval <=0 || auctionInterval === null)
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
  try 
  {
    let item_price = web3.utils.toWei(auctionPrice !== null ? auctionPrice.toString() : '0', 'ether');
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0', 'ether');
    
    await window.contract.methods.singleMintOnSale(itemId, auctionInterval, item_price, kind).send({ from: currentAddr});

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

export const batchMintOnSale = async (currentAddr, itemIds = [], auctionInterval, auctionPrice, kind = 0) => 
{
  /*
  Batch Sell :  batchMintOnSale(string memory _tokenHash, uint _interval, uint _startPrice, uint24 _royalty, uint8 _kind)
  */
  
  const web3 = window.web3;  
  if(auctionInterval === undefined || auctionInterval <=0 || auctionInterval === null)
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
  try 
  {
    let item_price = web3.utils.toWei(auctionPrice !== null ? auctionPrice.toString() : '0', 'ether');
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0', 'ether');    
    await window.contract.methods.batchMintOnSale(itemIds, auctionInterval, item_price, kind).send({ from: currentAddr});

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

export const destroySale = async (currentAddr, tokenId) => 
{
  /*
  Cancel Sale : destroySale(string memory _tokenHash)
  */ 
  try 
  {
    window.contract = await new window.web3.eth.Contract(hundredContractABI, hundredContractAddress);
    var destroySale = window.contract.methods.destroySale(tokenId);
    let gasFee = await destroySale.estimateGas({ from: currentAddr });
    // console.log("before getBalance");
    var balanceOfUser = await window.web3.eth.getBalance(currentAddr);
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
    await destroySale.send({ from: currentAddr});
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

export const buyNow = async (currentAddr, tokenId, price) =>
{
  /*
  acceptOrEndBid(string memory _tokenHash)
  */  

  try 
  {
    window.contract = await new window.web3.eth.Contract(hundredContractABI, hundredContractAddress);
    let item_price = window.web3.utils.toWei(price !== null ? price.toString() : '0', 'ether');
    //alert("tokenHash = " +  tokenId + ", price=" + item_price);
    var buyNow = window.contract.methods.buyNow(tokenId);
    let gasFee = await buyNow.estimateGas({ from: currentAddr, value: item_price});
    // console.log("before getBalance");
    var balanceOfUser = await window.web3.eth.getBalance(currentAddr);
    var gasPrice = 30 * (10 ** 9);

    if (balanceOfUser <= gasFee * gasPrice) 
    {
      Toast.fire({
        icon: 'error',
        title: 'Insufficient balance.'
      });
      return;
    }
    await buyNow.send({ from: currentAddr, value: item_price});

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