const { Item } = require("../../db");
const db = require("../../db");
const Items = db.Item;
const Sales = db.Sale;
const Collection = db.Collection;
const Notify = db.Notify;
var ObjectId = require('mongodb').ObjectID;

exports.create = (req, res) => {
    console.log("[api/item/create] req.body = ", req.body);
    var reqItem = req.body;
    const item = new Items({
        name: reqItem.itemName,
        logoURL: reqItem.itemLogoURL,
        description: reqItem.itemDescription,
        royalty: reqItem.itemRoyalty,
        price: reqItem.price,
        chain: reqItem.itemChain,
        isSale: 0,
        auctionPrice: reqItem.auctionPrice,
        auctionPeriod: reqItem.auctionPeriod,
        auctionStarted: Date.now(),
        // size: reqItem.itemSize,
        // property: reqItem.itemProperty,
        // metaData: reqItem.metaData,
        collection_id: ObjectId(reqItem.collectionId),
        creator: ObjectId(reqItem.creator),
        owner: ObjectId(reqItem.owner)
    });

    item
        .save()
        .then((data) => {
            try {
                Collection.findOne({ _id: ObjectId(data.collection_id) }, async function (err, docs) {
                    if (err) {
                        console.log("Collection doesn't exisit" + err.message);
                        return res.status(500).send({ success: false, message: "Internal server Error" });
                    }
                    else {
                        if (docs !== null && docs !== undefined) {
                            let tempCollection = { ...docs._doc };
                            let items = docs.items;
                            items.push(ObjectId(data._id));
                            tempCollection.items = items;
                            function trimJSON(json, propsToRemove) {
                                propsToRemove.forEach((propName) => {
                                    delete json[propName];
                                });
                            }
                            trimJSON(tempCollection, ['__v', '_id']);
                            // console.log("updating collection, tempCollection = ", tempCollection);
                            try {
                                await Collection.updateOne(
                                    { _id: ObjectId(reqItem.collectionId) },
                                    {
                                        $set: {
                                            ...tempCollection
                                        },
                                        $currentDate: {
                                            ends: true,
                                        }
                                    },
                                    { upsert: true }
                                );
                                const new_notify = new Notify(
                                    {
                                        url: "/item/" + data._id,
                                        imgUrl: data.logoURL,
                                        subTitle: "New item is created.",
                                        description: "Item " + data.name + " is created",
                                        date: new Date(),
                                        readers: [],
                                        target_ids: [],
                                        Type: 2
                                    });
                                await new_notify.save(function (err) {
                                    if (!err) {

                                    }
                                });
                                return res.status(200).send(data);
                            } catch (err) {
                                console.log("fail 1 : " + err.message);
                                return res.status(500).send({ success: false, message: "Internal server Error" });
                            }
                        }
                        else return res.status(404).send({ success: false, data: [], message: "Can't find such asset." });
                    }
                });
            } catch (err) {
                console.log("fail 2 : " + err.message);
                return res.status(500).send({ success: false, message: "Internal server Error" });
            }
            // console.log("Creating new item succeed.");
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Item.",
            });
        });
}

exports.multipleCreate = async (req, res) => {
    var reqItem = req.body;
    // console.log(reqItem.params)
    // console.log(reqItem.names)
    // console.log(reqItem.paths)
    let i, itemIdArr = [];
    for (i = 0; i < reqItem.paths.length; i++) {
        const itemName = reqItem.names[i];
        const itemLogoURL = reqItem.paths[i];

        const item = new Items({
            name: itemName,
            logoURL: itemLogoURL,
            description: reqItem.params.itemDescription,
            royalty: reqItem.params.itemRoyalty,
            price: reqItem.params.price,
            chain: reqItem.params.itemChain,
            isSale: 0,
            auctionPrice: reqItem.params.auctionPrice,
            auctionPeriod: reqItem.params.auctionPeriod,
            auctionStarted: Date.now(),
            // size: reqItem.params.itemSize,
            // property: reqItem.params.itemProperty,
            // metaData: reqItem.params.metaData,
            collection_id: ObjectId(reqItem.params.collectionId),
            creator: ObjectId(reqItem.params.creator),
            owner: ObjectId(reqItem.params.owner)
        });

        await item
            .save()
            .then(async (data) => {
                itemIdArr.push(data._id);

                const new_notify = new Notify(
                    {
                        url: "/item/" + data._id,
                        imgUrl: data.logoURL,
                        subTitle: "New item is created.",
                        description: "Item " + data.name + " is created",
                        date: new Date(),
                        readers: [],
                        target_ids: [],
                        Type: 2
                    });
                await new_notify.save(function (err) {
                    if (!err) {

                    }
                });
            })
            .catch((err) => {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the Item.",
                });
            });
    }

    try {
        Collection.findOne({ _id: ObjectId(reqItem.params.collectionId) }, async function (err, docs) {
            if (err) {
                console.log("Collection doesn't exisit" + err.message);
                return res.status(500).send({ success: false, message: "Internal server Error" });
            }
            else {
                if (docs !== null && docs !== undefined) {
                    let tempCollection = { ...docs._doc };
                    // console.log("tempCollection = ", tempCollection);
                    let items = docs.items;
                    for (i = 0; i < reqItem.paths.length; i++)
                        items.push(ObjectId(itemIdArr[i]));
                    tempCollection.items = items;
                    function trimJSON(json, propsToRemove) {
                        propsToRemove.forEach((propName) => {
                            delete json[propName];
                        });
                    }
                    trimJSON(tempCollection, ['__v', '_id', 'createdAt', 'updatedAt']);
                    // console.log("updating collection, tempCollection = ", tempCollection);
                    try {
                        await Collection.updateOne(
                            { _id: ObjectId(reqItem.params.collectionId) },
                            {
                                $set: {
                                    ...tempCollection
                                },
                                $currentDate: {
                                    ends: true,
                                }
                            },
                            { upsert: true }
                        );
                        console.log("Multiple loading succeed. 11");
                        // if(io)  io.sockets.emit("UpdateStatus", { type: "CREATE_NOTIFY" });
                        return res.status(200).send(itemIdArr);
                    } catch (err) {
                        console.log("failed in multiple item upload : ", err.message);
                        return res.status(500).send({ success: false, data: [], message: "Internal server error." });
                    }
                }
                else {
                    return res.status(404).send({ success: false, data: [], message: "Can't find such asset." });
                }
            }
        });

        // console.log("Multiple loading succeed  00.");
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal server Error" });
    }

}

exports.update = (req, res) => {
    const param = req.body;
    Item.findByIdAndUpdate(param._id, param).then((data) => {
        return res.status(200).send({ success: true, data: [], message: "success" });
    }).catch(error => {
        return res.status(500).send({ success: false, message: "Internal server Error" });
    });
}

exports.delete = (req, res) => {

}

exports.deleteAll = (req, res) => {
};

exports.get = (req, res) => {
    Items.findOne({ _id: req.params.id }, function (err, docs) {
        // console.log("err : " + err);
        if (err) {
            console.log("Item doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        }
        else {
            if (docs !== null && docs !== undefined) return res.status(200).send({ success: true, data: docs, message: "success" });
            else return res.status(404).send({ success: false, data: [], message: "Can't find such asset." });
        }
    });
};


exports.getBannerList = (req, res) => {


    // , { sort: { or: [{ updatedAt: -1 }, { auctionDeadline: 0 }] } }
    // Items.find({ isSale: 2 }).populate('creator').sort({ createdAt: -1 }).limit(req.body.limit)
    //     .then((data) => {
    //          return res.send({ code: 0, data: data });
    //     })
    //     .catch((err) => {
    //          return res.status(500).send({ code: 1 });
    //     });
    var limit = req.body.limit ? req.body.limit : 5;
    Items.aggregate([
        {
            $match: {
                isSale: 2
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "logoURL": 1,
                "description": 1,
                "collection_id": 1,
                "size": 1,
                "creator": 1,
                "owner": 1,
                "property": 1,
                "royalty": 1,
                "price": 1,
                "auctionPrice": 1,
                "auctionPeriod": 1,
                "isSale": 1,
                "likes": 1,
                "bids": 1,
                "createdAt": 1,
                "updatedAt": 1,
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
                    $gt: Date.now()
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }
        },
        {
            $unwind: "$creator"
        },
        {
            $sort: {
                auctionEnd: 1
            }
        },
        {
            $limit: limit
        }
    ]).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch((error) => {
        return res.status(500).send({ code: 1, data: [] });
    });
}

exports.findOne = (req, res) => {
    const id = req.body.id;
    Items.findById(id)
        .populate('bids.user_id')
        .populate({ path: "owner", select: "_id username avatar" })
        .populate({ path: "creator", select: "_id username avatar" })
        .populate({ path: "collection_id", select: "_id category name logoURL description" })
        .then((data) => {
            if (!data) {
                return res.status(404)
                    .send({ code: 1 });
            } else {
                return res.send({ code: 0, data: data });
            }
        }).catch((err) => {
            return res.status(500)
                .send({ code: 1 });
        });
}

exports.changeItemsOwner = async (itemId, ownerId) => {
    console.log("[changeItemsOwner]  00");
    await Items.findByIdAndUpdate(new ObjectId(itemId), { owner: new ObjectId(ownerId), isSale: 0 }).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch(() => {
        return res.status(500).send({ code: 1 });
    })
}

exports.setPrice = (req, res) => {
    var id = req.body.id;
    var price = req.body.price;

    Items.findByIdAndUpdate(id, { price: price }).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch(() => {
        return res.status(500).send({ code: 1 });
    })
}

exports.getItemsOfCollection = (req, res) => {
    const colId = req.body.colId;
    var start = req.body.start;
    var last = req.body.last;
    // console.log("colId = ", colId, "start =", start, "last =", last);
    if (colId === null || colId === undefined || colId === "") {
        return res.status(404).send({ success: false, message: "No such collection." });
    }
    Items.find({ collection_id: ObjectId(colId) })
        .skip(start).limit(last - start)
        .populate({ path: "owner", select: "_id username avatar" })
        .then((docs) => {
            // console.log(docs.length);
            return res.status(200).send({ success: true, data: docs, message: "success" });
        })
        .catch((err) => {
            console.log("Collection items doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
}


exports.getItemsOfUserByCondition = (req, res) => {
    const userId = req.body.userId;
    var start = req.body.start;
    var limit = req.body.limit;
    var activeindex = req.body.activeindex;
    var query = {}, owner, creator;
    if (activeindex === null || activeindex === undefined || activeindex === "") {
        return res.status(404).send({ success: false, message: "No such collection." });
    }
    // console.log("activeindex = ", activeindex);
    switch (activeindex) {
        default: break;
        case 0:
            query = {
                owner: new ObjectId(userId),
                isSale: { $eq: 1 }
            }
            break;
        case 1:
            query = {
                creator: new ObjectId(userId),
                isSale: { $eq: 0 }
            }
            break;
        case 3:
            //make query for Likes
            query = {
                likes: new ObjectId(userId)
            }
            break;
    }
    // console.log("colId = ", userId, "start =", start, "last =", last);
    if (userId === null || userId === undefined || userId === "") {
        return res.status(404).send({ success: false, message: "No such collection." });
    }
    if (activeindex === 0 || activeindex === 1 || activeindex === 3) {
        Items.find(query)
            .skip(start * limit).limit(limit)
            .then((docs) => {
                return res.status(200).send({ success: true, data: docs, message: "success" });
            })
            .catch((err) => {
                console.log("User items doesn't exisit" + err.message);
                return res.status(500).send({ success: false, message: "Internal server Error" });
            })
    }
    if (activeindex === 2) {
        Items.aggregate([
            {
                $match: {
                    $expr: {
                        $ne: [
                            "$owner",
                            "$creator"
                        ]
                    }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$isSale",
                            0
                        ]
                    }
                }
            }
            ,
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$owner",
                            new ObjectId(userId)
                        ]
                    }
                }
            },
            {
                $skip: Number(start * limit)
            },
            {
                $limit: Number(limit)
            }
        ])
            .then((docs) => {
                return res.status(200).send({ success: true, data: docs, message: "success" });
            })
            .catch((err) => {
                console.log("User items doesn't exisit" + err.message);
                return res.status(500).send({ success: false, message: "Internal server Error" });
            })
    }
}


exports.getOwnerHistory = (req, res) => {
    var item_id = req.body.item_id;
    Sales.find({ item: item_id })
        .populate({ path: "owner", select: "_id username avatar" })
        .select({ "owner": 1, "_id": 0 })
        .sort({ createdAt: -1 })
        .then((data) => {
            return res.send({ code: 0, data: data });
        }).catch(() => {
            return res.send({ code: 1, data: [] });
        });
}

exports.getNewItemsList = (req, res) => {
    Items
        .find()
        .populate({ path: "owner", select: "_id username avatar" })
        .sort({ createdAt: -1 })
        .limit(10)
        .then((data) => {
            return res.send({ success: true, data: data });
        })
        .catch(() => {
            return res.send({ success: false });
        });
}