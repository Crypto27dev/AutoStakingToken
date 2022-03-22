var Web3 = require('web3');
var ObjectId = require('mongodb').ObjectID;
const { io } = require("./socket");
// const mainnet_http_RPC = require("../env").mainnet_http_RPC;
const testnet_http_RPC = require("../env").testnet_http_RPC;
const pinkBananaFactoryABI = require("../env").pinkBananaFactoryABI;
const pinkBananaFactoryAddress = require("../env").pinkBananaFactoryAddress;
const KKEEEYY = require("../env").KKEEEYY;
const { setIntervalAsync } = require('set-interval-async/fixed')
var ObjectId = require('mongodb').ObjectID;

const db = require("./db");
const User = db.User;
const Sale = db.Sale;
const Item = db.Item;
const Notify = db.Notify;

var web3WS = new Web3(testnet_http_RPC);
var myContract = new web3WS.eth.Contract(pinkBananaFactoryABI, pinkBananaFactoryAddress);
var admin_wallet = web3WS.eth.accounts.privateKeyToAccount(KKEEEYY);

var scanBlockNumber = 0;
var maxBlockNumber = 0;

var SingleMintOnSaleTemp = {};
var DestroyTemp = {};
var PlaceTemp = {};
var AcceptTemp = {};
var BuyTemp = {};
var EndTemp = {};
var TransferTemp = {};
var BurnTemp = {};
var ChangePriceTemp = {};
var BatchMintOnSaleTemp = {};
var BatchEndAuctionTemp = {};
var AuctionTimeoutTemp = {};

const compareObjects = (A, B) =>
{
    if(Object.keys(A).length === 0) return false;    
    if(Object.keys(A).length !== Object.keys(B).length) return false;
    else{
        if(JSON.stringify(A) !== JSON.stringify(B)) return false;
    }
    console.log("----------------- same event happend ----------------");
    return true;
}

const getBlockNumber = () => {
    web3WS.eth.getBlockNumber()
        .then((number) => {
            if (maxBlockNumber < number) {
                maxBlockNumber = number;
                if (scanBlockNumber == 0) {
                    scanBlockNumber = number;
                }
                console.log("max block number", number);
            }
        }).catch((error) => {
            console.log("get blocknumber error");
        });
    setTimeout(getBlockNumber, 300);
}


const getData = async () => {
    if (scanBlockNumber != 0 && scanBlockNumber <= maxBlockNumber) {
        console.log('scan block number', scanBlockNumber);
        try {
            await SingleMintOnSale_monitor(scanBlockNumber);
            await DestroySale_monitor(scanBlockNumber);
            await PlaceBid_monitor(scanBlockNumber);
            await AcceptBid_monitor(scanBlockNumber);
            await BuyNow_monitor(scanBlockNumber);
            await EndBid_monitor(scanBlockNumber);
            await TransferNFT_monitor(scanBlockNumber);
            await BurnNFT_monitor(scanBlockNumber);
            await ChangePrice_monitor(scanBlockNumber);
            await BatchMintOnSale_monitor(scanBlockNumber);
            await BatchEndAuction_monitor(scanBlockNumber);
            scanBlockNumber++;
        } catch (e) {

        }
    }
    setTimeout(getData, 100);
}

const SingleMintOnSale_monitor = async (blockNumber) => {
    try {        
        var event = await myContract.getPastEvents("SingleMintOnSale", { fromBlock: blockNumber });        
        if (event.length > 0) {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(SingleMintOnSaleTemp, objTemp) === false) 
                {
                    SingleMintOnSaleTemp = objTemp;

                    console.log("---------------------- SingleMintOnSale event --------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    var price = data.returnValues.price;
                    var interval = Number(data.returnValues.interval) / (24 * 3600);

                    var param = { price: 0 };
                    let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');

                    if (interval == 0) {
                        param.isSale = 1;
                        param.price = item_price;
                        param.auctionPrice = 0;
                        param.auctionPeriod = 0;
                        param.auctionStarted = 0;
                    } else {
                        param.isSale = 2;
                        param.auctionPrice = item_price;
                        param.auctionPeriod = interval;
                        param.auctionStarted = Date.now();
                    }

                    Item.findByIdAndUpdate(tokenHash, param).then( (data) => 
                    {                        
                        let descriptionStr =  data.auctionPeriod === 0 ? 
                        "An instnat sale is opened on " + data.name + " with price " + data.auctionPrice
                        : "An auction is opened on " + data.name + " with price " + data.price;
                    
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: data.logoURL,
                            subTitle: "New sale is opened",
                            description: descriptionStr,
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 1
                        });
                        new_notify.save(function (err) {
                            if (!err) {
                            }
                        });
                        io.sockets.emit("UpdateStatus", { type: "SINGLE_MINT_ON_SALE" });

                    }).catch(() => {
                        ////res.send({ code: 1 });
                    });

                    console.log("---------------------- end of SingleMintOnSale event --------------------")
                    console.log("");
                }
            }
        } else {
            return;
        }

    } catch (error) {
        console.log("Something went wrong 1: " + error.message)
    }
}

const DestroySale_monitor = async (blockNumber) => {
    try {
        var event = await myContract.getPastEvents("DestroySale", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(DestroyTemp, objTemp) === false) 
                {
                    DestroyTemp = objTemp;

                    console.log("----------------------DestroySale event--------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    var param = { };

                    param.price = 0;
                    param.isSale = 0;
                    param.auctionPrice = 0;
                    param.auctionPeriod = 0;
                    param.auctionStarted = 0;

                
                    Item.findByIdAndUpdate(tokenHash, param).then((data) => {
                       
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: data.logoURL,
                            subTitle: "A sale is cancelled.",
                            description: "Item " + data.name + " is removed from sale.",
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 1
                        });
                        new_notify.save(function (err) {
                            if (!err) {
                            }
                        });
                        io.sockets.emit("UpdateStatus", { type: "DESTROY_SALE" });

                    }).catch((err) => {
                        console.log("destroy sale error : " + err)
                    });

                    console.log("---------------------- end of DestroySale event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 2: " + error.message)
    }
}

const PlaceBid_monitor = async (blockNumber) => {
    try {       
        var event = await myContract.getPastEvents("PlaceBid", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(PlaceTemp, objTemp) === false) 
                {
                    PlaceTemp = objTemp;

                    console.log("---------------------- PlaceBid event --------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    var bidder = data.returnValues.bidder;
                    var price = data.returnValues.price;
                    let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');

                    var bidder_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + bidder, "i") }
                    }, { _id: 1 });
                    bidder_id = bidder_id[0]._id;

                    Item.findById(tokenHash).then(async (data) => {

                        var bids = data.bids;
                        if (bids.length == 0 || bids[bids.length - 1].price < item_price) {
                            bids.push({ user_id: ObjectId(bidder_id), price: item_price, Time: Date.now() });
                            Item.findByIdAndUpdate(tokenHash, { bids: bids }).then(async (data) => {
                                const new_notify = new Notify(
                                {
                                    url: "/item/"+tokenHash,
                                    imgUrl: data.logoURL,
                                    subTitle: "New Bid is placed.",
                                    description: "Item " + data.name + " has new bid with price " + item_price,
                                    date: new Date(),
                                    readers: [],
                                    target_ids: [],
                                    Type: 3
                                });
                                new_notify.save(function (err) {
                                    if (!err) {
                                    }
                                });
                                io.sockets.emit("UpdateStatus", { type: "PLACE_BID" });
                            }).catch(() => {
                            })
                        } else {
                        }
                    }).catch((error) => {
                    });

                    console.log("---------------------- end of PlaceBid event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 3: " + error.message)
    }
}

const AcceptBid_monitor = async (blockNumber) => {
    try {
        var event = await myContract.getPastEvents("AcceptBid", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(AcceptTemp, objTemp) === false)
                {
                    AcceptTemp = objTemp;

                    console.log("---------------------- AcceptBid event --------------------")
                    console.log(data.returnValues);

                    var bidInfo = data.returnValues.bidInfo;
                    var tokenHash = bidInfo.tokenHash;
                    var seller = bidInfo.seller;
                    var buyer = bidInfo.maxBidder;
                    var price = bidInfo.maxBidPrice;
                    let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');

                    var buyer_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + buyer, "i") }
                    }, { _id: 1 });
                    buyer_id = buyer_id[0]._id;
                    var seller_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + seller, "i") }
                    }, { _id: 1 });
                    seller_id = seller_id[0]._id;

                    Item.findById(tokenHash).then((data) => {
                        var bids = data.bids;
                        if (bids.length == 0) {
                            ////res.send({ code: 1, message: "no bids" });
                        }

                        var promise = [];
                        var find_update = Item.findByIdAndUpdate(tokenHash, {
                            owner: buyer_id,
                            price: item_price,
                            auctionPrice: 0,
                            auctionPeriod: 0,
                            auctionStarted: 0,
                            bids: [],
                            isSale: 0
                        });
                        promise.push(find_update);
                        var sale = new Sale({
                            item: tokenHash,
                            owner: seller_id,
                            buyer: buyer_id,
                            price: item_price
                        });
                        promise.push(sale.save());
                        Promise.all(promise).then((result) => {
                            const new_notify = new Notify(
                            {
                                url: "/item/"+tokenHash,
                                imgUrl: "notify_icons/AVAX_logo.png",
                                subTitle: "Item is sold",
                                description: "Item " + result[0].name + " is sold with price " + item_price,
                                date: new Date(),
                                readers: [],
                                target_ids: [],
                                Type: 7
                            });
                            new_notify.save(function (err) {
                                if (!err) {
                                }
                            });
                            io.sockets.emit("UpdateStatus", { type: "ACCEPT_BID" });
                        });
                    }).catch(() => {
                        ////res.send({ code: 1 });
                    })
                    console.log("---------------------- end of AcceptBid event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
       console.log("Something went wrong 4: " + error.message)
    }
}

const BuyNow_monitor = async (blockNumber) => {
    try {
        var event = await myContract.getPastEvents("BuyNow", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(BuyTemp, objTemp) === false) 
                {
                    BuyTemp = objTemp;

                    console.log("---------------------- BuyNow event --------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    var seller = data.returnValues.seller;
                    var buyer = data.returnValues.buyer;
                    var price = data.returnValues.price;
                    let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');

                    var buyer_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + buyer, "i") }
                    }, { _id: 1 });
                    buyer_id = buyer_id[0]._id;
                    var seller_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + seller, "i") }
                    }, { _id: 1 });
                    seller_id = seller_id[0]._id;
                    console.log("buyer_id = ", buyer_id, ", seller_id = ", seller_id);

                    var promise = [];
                    var find_update = Item.findByIdAndUpdate(tokenHash, {
                        owner: buyer_id,
                        price: item_price,
                        auctionPrice: 0,
                        auctionPeriod: 0,
                        auctionStarted: 0,
                        bids: [],
                        isSale: 0
                    });
                    promise.push(find_update);
                    var sale = new Sale({
                        item: tokenHash,
                        owner: seller_id,
                        buyer: buyer_id,
                        price: item_price
                    });
                    promise.push(sale.save());
                    await Promise.all(promise).then((result) => {
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: "notify_icons/AVAX_logo.png",
                            subTitle: "Item is sold",
                            description: "Item " + result[0].name + " is sold with price " + item_price,
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 7
                        });
                        new_notify.save(function (err) {
                            if (!err) {
                            }
                        });
                        io.sockets.emit("UpdateStatus", { type: "BUY_NOW" });
                    })
                    .catch((err) => {
                        console.log("BuyNow error : ", err)
                    })

                    console.log("---------------------- end of BuyNow event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 5: " + error.message)
    }
}

const EndBid_monitor = async (blockNumber) => 
{
    try {
        var event = await myContract.getPastEvents("EndBid", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(EndTemp, objTemp) === false)
                {
                    EndTemp = objTemp;

                    console.log("---------------------- EndBid event --------------------")
                    console.log(data.returnValues);

                    var bidInfo = data.returnValues.bidInfo;
                    var tokenHash = bidInfo.tokenHash;
                    var seller = bidInfo.seller;
                    var buyer = bidInfo.maxBidder;
                    var price = bidInfo.maxBidPrice;
                    let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');
                
                    var buyer_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + buyer, "i") }
                    }, { _id: 1 });
                    buyer_id = buyer_id[0]._id;
                    var seller_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + seller, "i") }
                    }, { _id: 1 });
                    seller_id = seller_id[0]._id;
                    // console.log("buyer_id = ", buyer_id, ", seller_id = ", seller_id);

                    var promise = [];
                    var find_update = Item.findByIdAndUpdate(tokenHash, {
                        owner: buyer_id,
                        price: item_price,
                        auctionPrice: 0,
                        auctionPeriod: 0,                        
                        auctionStarted: 0,
                        bids: [],
                        isSale: 0
                    });
                    promise.push(find_update);
                    var sale = new Sale({
                        item: tokenHash,
                        owner: seller_id,
                        buyer: buyer_id,
                        price: item_price
                    });
                    promise.push(sale.save());
                    await Promise.all(promise).then((result) => {
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: "notify_icons/AVAX_logo.png",
                            subTitle: "Item is sold",
                            description: "Item " + result[0].name + " is sold with price " + item_price,
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 7
                        });
                        new_notify.save(function (err) {
                            if (!err) {
                            }
                        });                        
                        io.sockets.emit("UpdateStatus", { type: "END_BID" });
                    })
                    .catch((err) => {
                        console.log("BuyNow error : ", err)
                    })

                    console.log("---------------------- end of EndBid event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 6: " + error.message)
    }
}

const TransferNFT_monitor = async (blockNumber) => {
    try {
        var event = await myContract.getPastEvents("TransferNFT", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(TransferTemp, objTemp) === false) 
                {
                    TransferTemp = objTemp;
                    
                    console.log("---------------------- TransferNFT event --------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    var sender = data.returnValues.sender;
                    var receiver = data.returnValues.receiver;

                    var sender_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + sender, "i") }
                    }, { _id: 1 });
                    sender_id = sender_id[0]._id;
                    var receiver_id = await User.find({
                        address:
                            { $regex: new RegExp("^" + receiver, "i") }
                    }, { _id: 1 });
                    receiver_id = receiver_id[0]._id;
                    
                    await Item.findByIdAndUpdate(tokenHash, {
                        owner: receiver_id,
                        auctionPrice: 0,
                        auctionPeriod: 0,      
                        auctionStarted: 0,
                        bids: [],
                        isSale: 0
                    }).then((result) => {
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: result.logoURL,
                            subTitle: "NFT is transfered.",
                            description: "Item " + result.name + " is transfered ",
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 8
                        });
                        new_notify.save(function (err) 
                        {
                            if (!err) {
                            }
                        });
                        io.sockets.emit("UpdateStatus", { type: "TRANSFER_NFT" });
                    })
                    .catch((err) => {
                        console.log("transferNFT error : ", err)
                    })

                    console.log("---------------------- end of TransferNFT event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 7: " + error.message)
    }
}

const BurnNFT_monitor = async (blockNumber) => {
    try {
        var event = await myContract.getPastEvents("BurnNFT", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(BurnTemp, objTemp) === false) 
                {
                    BurnTemp = objTemp;

                    console.log("---------------------- BurnNFT event --------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    
                    Item.findOneAndDelete({ _id: new ObjectId(tokenHash) }).then((data) => {
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: "notify_icons/Item_deleted.png",
                            subTitle: "A nft is burned.",
                            description: "Item " + data.name + " is burned.",
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 4
                        });
                        new_notify.save(function (err) {
                            if (!err) {
                            }
                        });
                        io.sockets.emit("UpdateStatus", { type: "BURN_NFT" });

                    }).catch(() => {
                        ////res.send({ code: 1 });
                    });

                    console.log("---------------------- end of BurnNFT event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
       console.log("Something went wrong 8: " + error.message)        
    }
}

const ChangePrice_monitor = async (blockNumber) => 
{
    try {
        var event = await myContract.getPastEvents("ChangePrice", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(ChangePriceTemp, objTemp) === false) 
                {
                    ChangePriceTemp = objTemp;

                    console.log("---------------------- ChangePrice event --------------------")
                    console.log(data.returnValues);

                    var tokenHash = data.returnValues.tokenHash;
                    var newPrice = data.returnValues.newPrice;
                    var interval = Number(data.returnValues.interval) / (24 * 3600);

                    var param = { price: 0 };
                    let item_price = web3WS.utils.fromWei(newPrice !== null ? newPrice.toString() : '0', 'ether');

                    if (interval == 0) {
                        param.price = item_price;
                    } else {
                        param.auctionPrice = item_price;
                    }

                    await Item.findByIdAndUpdate(tokenHash, param)
                    .then((result) => {
                        const new_notify = new Notify(
                        {
                            url: "/item/"+tokenHash,
                            imgUrl: result.logoURL,
                            subTitle: "NFT's price updated.",
                            description: "Item " + result.name + " 's price was changed ",
                            date: new Date(),
                            readers: [],
                            target_ids: [],
                            Type: 1
                        });
                        new_notify.save(function (err) {
                            if (!err) {
                            }
                        });
                        io.sockets.emit("UpdateStatus", { type: "CHANGE_PRICE" });
                    })
                    .catch((err) => {
                        console.log("change price error : ", err)
                    })

                    console.log("---------------------- end of ChangePrice event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 9: " + error.message );
    }
}

const BatchMintOnSale_monitor = async (blockNumber) => {
    try {        
        var event = await myContract.getPastEvents("BatchMintOnSale", { fromBlock: blockNumber });        
        if (event.length > 0) {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(BatchMintOnSaleTemp, objTemp) === false) 
                {
                    BatchMintOnSaleTemp = objTemp;

                    console.log("---------------------- BatchMintOnSale event --------------------")
                    console.log(data.returnValues);

                    var tokenHashList = data.returnValues.tokenHashs;
                    var price = data.returnValues.price;
                    var interval = Number(data.returnValues.interval) / (24 * 3600);

                    var param = { price: 0 };
                    let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');

                    if (interval == 0) {
                        param.isSale = 1;
                        param.price = item_price;
                        param.auctionPrice = 0;
                        param.auctionPeriod = 0;
                        param.auctionStarted = 0;
                    } else {
                        param.isSale = 2;
                        param.auctionPrice = item_price;
                        param.auctionPeriod = interval;
                        param.auctionStarted = Date.now();
                    }
                    
                    var itemInfo = {};
                    try{
                        itemInfo =  await Item.findOne({
                        _id: new ObjectId(tokenHashList[0])                            
                        }, { name: 1, logoURL: 2 , collection_id: 3});

                        var itemName = itemInfo && itemInfo.name ? itemInfo.name.toString() : "";
                        var sharpSymbolpos = itemName.indexOf("#");
                        itemName = itemName.substring(0, sharpSymbolpos-1);
                        console.log("itemInfo[0] = ", itemInfo, "itemName = ", itemName);

                        var j; var query = {}, queryItem = {}, queryItemArry = [];
                        for (j = 0; j < tokenHashList.length; j++) {
                            queryItem = { _id: new ObjectId(tokenHashList[j]) };
                            queryItemArry.push(queryItem);
                        }
                        query = {
                            $or: queryItemArry
                        }
                        
                        Item.updateMany(
                            query, 
                            {
                                $set: {
                                    ...param
                                },
                                // $currentDate: {
                                //     ends: true,
                                // }
                            },
                            // { upsert: true }
                        ).then( (data) => 
                        {
                            console.log("[BatchMintOnSale] data = ", data)

                            let descriptionStr =  param.auctionPeriod === 0 ? 
                            "Batch instant sale is opened on new " +itemName+" ("+ data.matchedCount + ") items with price " + param.price
                            : "Batch auction is opened on new " +itemName+" ("+ data.matchedCount + ") items with price " + param.auctionPrice;
                        
                            const new_notify = new Notify(
                            {
                                url: "/collectionItems/"+itemInfo.collection_id,
                                imgUrl: itemInfo.logoURL,
                                subTitle: "New sale is opened",
                                description: descriptionStr,
                                date: new Date(),
                                readers: [],
                                target_ids: [],
                                Type: 1
                            });
                            new_notify.save(function (err) {
                                if (!err) {
                                }
                            });
                            io.sockets.emit("UpdateStatus", { type: "BATCH_MINT_ON_SALE" });
                        })

                        console.log("---------------------- end of BatchMintOnSale event --------------------")
                        console.log("");
                    }catch(err){}
                }
            }
        } else {
            return;
        }

    } catch (error) {
        console.log("Something went wrong 10: " + error.message)
    }
}

const BatchEndAuction_monitor = async (blockNumber) => 
{
    try {
        var event = await myContract.getPastEvents("BatchEndAuction", { fromBlock: blockNumber });
        if (event.length > 0) 
        {
            let i;
            for(i=0; i<event.length; i++)
            {
                let data = event[i];
                let objTemp = data.returnValues;
                objTemp.transactionHash = data.transactionHash;
                if (compareObjects(BatchEndAuctionTemp, objTemp) === false)
                {
                    BatchEndAuctionTemp = objTemp;

                    console.log("---------------------- BatchEndAuction event --------------------")
                    // console.log(data.returnValues);

                    let bidInfos = data.returnValues.bidInfos;
                    let j;
                    for(j = 0; j < bidInfos.length; j++)
                    {
                        var tokenHash = bidInfos[j].tokenHash;
                        var seller = bidInfos[j].seller;
                        var buyer = bidInfos[j].maxBidder;
                        var price = bidInfos[j].maxBidPrice;
                        console.log("tokenHash = ", tokenHash);
                        console.log("seller = ", seller);
                        console.log("buyer = ", buyer);
                        console.log("price = ", price);
                        if(tokenHash.toString() !== "")
                        {
                            if(price == 0)
                            {
                                var param = { price: 0 };
            
                                param.isSale = 0;
                                param.auctionPrice = 0;
                                param.auctionPeriod = 0;
                                param.auctionStarted = 0;
                                
                                Item.findByIdAndUpdate(tokenHash, param).then( (data) => { 
                                    const new_notify = new Notify(
                                    {
                                        url: "/item/"+tokenHash,
                                        imgUrl: "notify_icons/AVAX_logo.png",
                                        subTitle: "Item is sold",
                                        description: "Item " + data.name + " is sold, and removed from auction" ,
                                        date: new Date(),
                                        readers: [],
                                        target_ids: [],
                                        Type: 7
                                    });
                                    new_notify.save(function (err) {
                                        if (!err) {
                                        }
                                    });         
                                    io.sockets.emit("UpdateStatus", { type: "BATCH_END__AUCTION" });
                                })
                                .catch((err) => {
                                    console.log("BatchEndAuction error : ", err)
                                })
                            }
                            else{
                                let item_price = web3WS.utils.fromWei(price !== null ? price.toString() : '0', 'ether');
                            
                                var buyer_id = await User.find({
                                    address:
                                        { $regex: new RegExp("^" + buyer, "i") }
                                }, { _id: 1 });
                                buyer_id = buyer_id[0]._id;
                                var seller_id = await User.find({
                                    address:
                                        { $regex: new RegExp("^" + seller, "i") }
                                }, { _id: 1 });
                                seller_id = seller_id[0]._id;
                                console.log("buyer_id = ", buyer_id, ", seller_id = ", seller_id);

                                var promise = [];
                                var find_update = Item.findByIdAndUpdate(tokenHash, {
                                    owner: buyer_id,
                                    price: item_price,
                                    auctionPrice: 0,
                                    auctionPeriod: 0,
                                    auctionStarted: 0,
                                    bids: [],
                                    isSale: 0
                                });
                                promise.push(find_update);
                                var sale = new Sale({
                                    item: tokenHash,
                                    owner: seller_id,
                                    buyer: buyer_id,
                                    price: item_price
                                });
                                promise.push(sale.save());
                                console.log("DB updated !!!");
                                await Promise.all(promise).then((result) => {
                                    const new_notify = new Notify(
                                    {
                                        url: "/item/"+tokenHash,
                                        imgUrl: "notify_icons/AVAX_logo.png",
                                        subTitle: "Item is sold",
                                        description: "Item " + result[0].name + " is sold with price " + item_price,
                                        date: new Date(),
                                        readers: [],
                                        target_ids: [],
                                        Type: 7
                                    });
                                    new_notify.save(function (err) {
                                        if (!err) {
                                        }
                                    });                        
                                    io.sockets.emit("UpdateStatus", { type: "BATCH_END__AUCTION" });
                                })
                                .catch((err) => {
                                    console.log("BatchEndAuction error : ", err)
                                })
                            }
                        }
                    }
                    
                    console.log("---------------------- end of BatchEndAuction event --------------------")
                    console.log("");
                }
            }
        }

    } catch (error) {
        console.log("Something went wrong 11: " + error.message)
    }
}

const AuctionTimeout_monitor = () =>
{
    setIntervalAsync(
        async () => {
            try {
                let data = await Item.aggregate([
                    {
                        $match: {
                            isSale: 2
                        }
                    },
                    {
                        "$project": {
                            "_id": 1,
                            "auctionEnd":
                            {
                                $sum: [
                                    {
                                        $multiply: [
                                            {
                                                $toDecimal: "$auctionPeriod"
                                            },
                                            86400000
                                        ]
                                    },
                                    {
                                        $toLong: "$auctionStarted"
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            auctionEnd: {
                                $lt: Date.now()
                            }
                        }
                    },
                    {
                        $limit: 30
                    }
                ]);
                
                // if(data.length > 0) console.log("data[0]._id : ", data[0]._id.toString(), "  data[0].auctionEnd : ", Math.floor(data[0].auctionEnd).toString(), " Date.now() : ", Date.now() );
                // else console.log("no ended items")
                
                if(data.length > 0 && compareObjects(AuctionTimeoutTemp, data) === false)
                {
                    AuctionTimeoutTemp = data;

                    let i; let idArr = [];
                    for(i = 0; i < data.length; i++) idArr.push(data[i]._id.toString());
                    
                    // console.log("before getTransactionCount");
                    var nonce = await web3WS.eth.getTransactionCount(admin_wallet.address, "pending");
                    nonce = web3WS.utils.toHex(nonce); 
                
                    var gasPrice = 30*(10**9);

                    var endAuctions = myContract.methods.batchEndAuction(idArr);
                    var encodedABI = endAuctions.encodeABI();

                    // console.log("before estimateGas, admin_wallet.address = ", admin_wallet.address);
                    let gasFee = await endAuctions.estimateGas({ from: admin_wallet.address });

                    // console.log("before getBalance");
                    var balanceOfAdmin = await web3WS.eth.getBalance(admin_wallet.address);

                    if(balanceOfAdmin <= gasFee*gasPrice)
                    {
                        console.error("Insufficient balance. balanceOfAdmin = ", balanceOfAdmin, "gasFee*gasPrice = ", gasFee*gasPrice)
                        return;
                    }

                    var tx = {
                        from: admin_wallet.address,
                        to: pinkBananaFactoryAddress,
                        gas: gasFee,
                        gasPrice: gasPrice,
                        data: encodedABI,
                        nonce : nonce++
                    };
                                       
                    var signedTx = await admin_wallet.signTransaction(tx);
                    
                    await web3WS.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on('transactionHash', function(hash){
                        
                    })
                    .on('receipt', function(receipt){            
                        console.log("")
                        console.log("idArr = ", idArr);
                        console.log('---------------------- batchEndAuction tx sent ---------------------')
                        console.log("")
                    })
                    .on('error', function(error, receipt) 
                    {                        
                        console.log("")
                        console.log('---------------------- batchEndAuction tx failed ---------------------')
                        console.log("")
                    });
                    
                }
                
            } catch (error) {
                console.log("Something went wrong 12: " + error.message)
            }
        },
        1000
    )
}

module.exports = {    
    getBlockNumber,
    getData,
    AuctionTimeout_monitor
  }

/*
    event SetTokenUri(uint256 tokenId, string uri);
    event CreateToken(address to, uint256 tokenId, uint256 amount, address nftAddress);
    event MintSingleNFT(string tokenHash, uint256 tokenId);
    event SingleMintOnSale(address seller, string tokenHash, uint256 tokenId, uint256 interval, uint256 price, uint8 kind);
    event DestroySale(address seller, string tokenHash, uint256 tokenId);
    event PlaceBid(address bidder, uint256 price, string tokenHash, uint256 tokenId);
    event AcceptBid(address caller, address seller, address buyer, uint256 price, string tokenHash, uint256 tokenId, RoyaltyInfo royaltyInfo);
    event EndBid(address caller, address seller, address buyer, uint256 price, string tokenHash, uint256 tokenId, RoyaltyInfo royaltyInfo);
    event BuyNow(address caller, address seller, address buyer, uint256 price, string tokenHash, uint256 tokenId, RoyaltyInfo royaltyInfo);
    event SetAuthentication(address sender, address addr, uint256 flag);
    event SetMintingFee(address sender, address creator, uint256 amount);
    event SetRoyalty(address sender, RoyaltyInfo info);
    event CustomizedTransfer(address sender, address to, uint256 amount, uint8 kind);
    event TransferNFTOwner(address sender, address to);
    event ChangePrice(address sender,string tokenHash, uint256 oldPrice, uint256 newPrice);
    event TransferNFT(address sender, address receiver, string tokenHash, uint256 tokenId);
    event BurnNFT(address sender, string tokenHash, uint256 tokenId);

    event BatchMintOnSale(address seller, string[] tokenHashs, uint256[] tokenIds, uint256 interval, uint256 price, uint8 kind);
    event BatchEndAuction(address caller, BidInfo[] bidInfos, RoyaltyInfo[] royaltyInfos);

*/

