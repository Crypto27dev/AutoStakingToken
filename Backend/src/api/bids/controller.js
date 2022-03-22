const db = require("../../db");
const Bid = db.Bid;
const Item = db.Item;
const Sale = db.Sale;

var ObjectId = require('mongodb').ObjectID;

exports.setBid = (req, res) => {
    var item_id = req.body.item_id;
    var user_id = req.body.user_id;
    var price = req.body.price;
    Item.findById(item_id).then((data) => {

        var bids = data.bids;
        if (bids.length == 0 || bids[bids.length - 1].price < price) {
            bids.push({ user_id: ObjectId(user_id), price: price, Time: Date.now() });
            Item.findByIdAndUpdate(item_id, { bids: bids }).then((data) => {
                return res.send({ code: 0, data: data });
            }).catch(() => {
                return res.send({ code: 1, data: [], message: "update error" });
            })
        } else {
            return res.send({ code: 1, data: [], message: "price must be higer than prev bid's" });
        }
    }).catch((error) => {
        return res.send({ code: 1, data: [], message: "find error" });
    });

}

exports.getHotBids = (req, res) => {
    var limit = req.body.limit ? Number(req.body.limit) : 3;
    Item.aggregate([{
        $unwind: "$bids"
    }, {
        $group: { _id: "$_id", maxValue: { $max: "$bids.price" } }
    },
    { $sort: { maxValue: -1 } },
    {
        $lookup: {
            from: "items",
            localField: "_id",
            foreignField: '_id',
            as: "info"
        }
    }]).limit(limit).then((data) => {
        return res.send({ code: 0, list: data });
    }).catch((error) => {
        return res.send({ code: 1, list: [] });
    });
}

exports.acceptBid = (req, res) => {
    var item_id = req.body.item_id;
    Item.findById(item_id).then((data) => {

        var bids = data.bids;
        if (bids.length == 0) {
            return res.send({ code: 1, message: "no bids" });
        }
        var price = bids[bids.length - 1].price;
        var owner = data.owner;
        var buyer = bids[bids.length - 1].user_id;

        var promise = [];
        var find_update = Item.findByIdAndUpdate(item_id, {
            owner: buyer,
            price: price,
            auctionPrice: 0,
            auctionPeriod: 0,
            bids: [],
            isSale: 0
        });
        promise.push(find_update);        
        var sale = new Sale({
            item: item_id,
            owner: owner,
            buyer: buyer,
            price: price
        });
        promise.push(sale.save());
        Promise.all(promise).then((result)=>{
            return res.send({code: 0, data: result});
        });
    }).catch(() => {
        return res.send({ code: 1 });
    })

}