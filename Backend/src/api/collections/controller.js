const db = require("../../db");
const Collection = db.Collection;
const Follows = db.Follow;
const Users = db.User;
const Notify = db.Notify;
const fs = require('fs');
const fsPromises = fs.promises;
const env = require("../../../env");
const upload_path = env.upload_path;
const Items = db.Item;

var ObjectId = require('mongodb').ObjectID;

exports.create = async (req, res) => {

    console.log("creting collection 00");

    console.log("req.body = ", req.body);

    var reqItem = req.body;
    const collection = new Collection({
        name: reqItem.collectionName,
        logoURL: reqItem.collectionLogoURL,
        featuredURL: reqItem.collectionFeaturedURL,
        bannerURL: reqItem.collectionBannerURL,
        description: reqItem.collectionDescription,
        category: reqItem.collectionCategory,
        price: reqItem.price,
        owner: ObjectId(reqItem.owner)
    });

    Collection.find({ name: reqItem.collectionName }, async function (err, docs) {
        if (err) {
            //return  res.status(501).send({ success: false, message: "Internal Server Error." });
        }
        if (docs.length > 0) {
            return res.status(501).send({ success: false, message: "Collection name is duplicated." });
        } else {
            await fsPromises.mkdir(process.cwd() + upload_path + reqItem.collectionName, { recursive: true })
                .then(async function () {
                    console.log('Directory created successfully');

                    await collection
                        .save()
                        .then(async (data) => {
                            console.log("Creating new collection succeed.");

                            const new_notify = new Notify(
                                {
                                    url: "/collectionItems/" + data.collection_id,
                                    imgUrl: data.logoURL,
                                    subTitle: "New collection is created.",
                                    description: "Collection " + data.name + " is created",
                                    date: new Date(),
                                    readers: [],
                                    target_ids: [],
                                    Type: 2
                                });
                            await new_notify.save(function (err) {
                                if (!err) {

                                }
                            });
                            return res.status(200).send(
                                { success: true, data, message: "New collection successfully created." }
                            );
                        })
                        .catch((err) => {
                            return res.status(500).send({
                                success: false,
                                message: err.message || "Some error occurred while creating the collection.",
                            });
                        });
                }
                ).catch(async function (err) {
                    console.log('failed to create directory. ', err);
                    let errno = err.errno;
                    if (errno === -4075) {
                        console.log("Collection dir already exists");

                        await collection
                            .save()
                            .then(async (data) => {
                                console.log("Creating new collection succeed.");
                                const new_notify = new Notify(
                                    {
                                        url: "/collectionItems/" + data.collection_id,
                                        imgUrl: data.logoURL,
                                        subTitle: "New collection is created.",
                                        description: "Collection " + data.name + " is created",
                                        date: new Date(),
                                        readers: [],
                                        target_ids: [],
                                        Type: 2
                                    });
                                await new_notify.save(function (err) {
                                    if (!err) {

                                    }
                                });
                                return res.status(200).send(
                                    { success: true, data, message: "New collection successfully created." }
                                );
                            }).catch((err) => {
                                return res.status(500).send({
                                    success: false,
                                    message: err.message || "Some error occurred while creating the collection.",
                                });
                            });
                    }
                });
        }
    })
}

exports.getDetail = (req, res) => {
    // console.log("req.body.id  : ", req.body.id);
    Collection.findOne({ _id: new ObjectId(req.body.id) })
        .populate("owner")
        .populate("items")
        .then((docs) => {
            if (docs !== null && docs !== undefined) {
                // console.log("found a collection : ", docs);
                return res.status(200).send({ success: true, data: docs, message: "success" });
            }
            else return res.status(404).send({ success: false, data: [], message: "Can't find such asset." });
        })
        .catch((err) => {
            console.log("Collection doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
}

exports.update = async (req, res) => {
    try {
        await Collection.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    ...req.body
                },
                $currentDate: {
                    ends: true,
                }
            },
            { upsert: true }
        );
    } catch (err) {
        console.log("Updating collection : " + err.message);
        return res.status(500).send({ success: false, message: "Internal server Error" });
    }
    console.log("Updating collection : succeed.");
    return res.status(200).json({ success: true, message: "Successfully Update a Collection" })

}

exports.getHotCollections = (req, res) => {
    var limit = req.body.limit ? req.body.limit : 3;

    Collection.aggregate([

        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "items",
                localField: "items",
                foreignField: "_id",
                as: "item_info"
            }
        },
        {
            $unwind: "$item_info"
        },
        {
            $group: {
                _id: "$_id",
                like_count: {
                    $sum: {
                        $size: "$item_info.likes"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "collections",
                localField: "_id",
                foreignField: "_id",
                as: "collection_info"
            }
        },
        {
            $unwind: "$collection_info"
        },
        {
            $lookup: {
                from: "items",
                localField: "collection_info.items",
                foreignField: "_id",
                as: "items_list"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "collection_info.owner",
                foreignField: "_id",
                as: "creator_info"
            }
        },

        {
            $unwind: "$creator_info"
        },
        { $limit: limit },
        { $sort: { like_count: -1 } }
    ]).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch(() => {
        return res.send({ code: 1, data: [] });
    });

}

exports.getCollectionList = async (req, res) => {

    var category = req.body.category ? req.body.category : 0;
    var date = req.body.date ? req.body.date : 0;
    var start = req.body.start;
    var limit = req.body.limit;
    var creator = req.body.creator ? req.body.creator : 0;
    var likes = req.body.likes ? req.body.likes : 0;
    var price = req.body.price ? req.body.price : 0;
    var range = req.body.range ? req.body.range : [];
    var search = req.body.search ? req.body.search : "";
    var collection_id = req.body.collection_id ? req.body.collection_id : 0;
    var metadatas = req.body.metadata ? req.body.metadata : [];
    var type = req.body.type ? req.body.type : [];
    var chain = req.body.chain ? req.body.chain : [];

    var creatorFilter = { $match: {} };
    var categoryFilter = { $match: {} };
    var querySort = { $sort: {} };
    var rangeFilter = { $match: {} };
    var searchFilter = { $match: {} };
    var collectionFilter = { $match: {} };
    var metadataFilter = { $match: {} };
    var typeFilter = { $match: {} };
    var chainFilter = { $match: {} };

    if (search != "") {
        searchFilter = {
            $match: {
                "item_info.name": {
                    $regex: `.*${search}.*`,
                    $options: 'i'
                }
            }
        }
    }


    if (creator == 1) {
        //verified users list
        var userlist = await Users.find({ verified: true });
        var list = [];
        for (var i = 0; i < userlist.length; i++) {
            list.push(userlist[i]._id);
        }
        creatorFilter = { $match: { "item_info.creator": { "$in": list } } };
    }

    if (category != 0) {
        categoryFilter = {
            $match: { category: category }
        }
    }
    if (date == 0) {
        querySort.$sort["item_info.createdAt"] = -1;
    } else if (date == 1) {
        querySort.$sort["item_info.createdAt"] = 1;
    }

    if (likes == 0) {
        querySort.$sort["likes"] = -1;
    } else if (likes == 1) {
        querySort.$sort["likes"] = 1;
    }

    if (price == 0) {
        querySort.$sort["item_info.price"] = -1;
    } else if (price == 1) {
        querySort.$sort["item_info.price"] = 1;
    }
    if (range.length > 0) {
        let rangeData = {};
        if (range[0] > 0)
            rangeData.$gte = range[0];
        else
            rangeData.$gt = 0;
        if (range[1] > 0)
            rangeData.$lte = range[1];
        if (range[0] > 0 || range[1] > 0) {
            rangeFilter = { $match: { $or: [{ "item_info.price": rangeData }, { "item_info.auctionPrice": rangeData }] } };
        }
    }

    if (collection_id != 0) {
        collectionFilter = { $match: { "_id": ObjectId(collection_id) } };
    }

    if (metadatas.length > 0) {
        var list = [];
        for (var i = 0; i < metadatas.length; i++) {
            list.push({
                "item_info.metaData": { $regex: new RegExp(metadatas[i], "g") }
            });
        }

        metadataFilter = {
            $match: {
                "$or": list
            }
        }
    }

    if (type.length > 0) {
        var typeArr = [];
        type.map((item) => { typeArr.push({ "item_info.isSale": (item + 1) }) }); // isSale = 1: Buy now, 2: auction 3: ??
        typeFilter = { $match: { $or: typeArr } };
    }

    if (chain.length > 0) {
        var chainArr = [];
        chain.map((item) => { chainArr.push({ "item_info.chain": item }) });
        chainFilter = { $match: { $or: chainArr } };
    }
    Collection.aggregate([
        collectionFilter,
        categoryFilter,
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "items",
                localField: "items",
                foreignField: "_id",
                as: "item_info"
            }
        },
        {
            $unwind: "$item_info"
        },
        {
            $lookup: {
                from: 'users',
                localField: "item_info.creator",
                foreignField: "_id",
                as: "creator_info"
            }
        },
        {
            $unwind: "$creator_info"
        },
        {
            $lookup: {
                from: "users",
                localField: "item_info.owner",
                foreignField: "_id",
                as: "owner_info"
            }
        },
        {
            $unwind: "$owner_info"
        },
        {
            $project: {
                "item_info": 1,
                "creator_info": 1,
                "owner_info": 1,
                "likes": { $size: "$item_info.likes" }
            }
        },
        chainFilter,
        typeFilter,
        searchFilter,
        metadataFilter,
        rangeFilter,
        creatorFilter,
        querySort,
        {
            $skip: Number(start * limit)
        },
        {
            $limit: Number(limit)
        }
    ]).then((data) => {
        return res.send({ code: 0, list: data });
    }).catch((error) => {
        return res.send({ code: 1 });
    });

    // Collection
    //     .find(matchParams)
    //     // .find({collection_id: {category : 1}})
    //     .sort({ createdAt: req.body.date == 0 ? -1 : 0 })
    //     .skip(start).limit(last - start)
    //     .then((data) => {
    //         return res.send({ code: 0, data: data });
    //     }).catch((error) => {
    //         return res.send({ code: 1 });
    //     })
}
exports.getCollectionRank = async (req, res) => {

    console.log("sort param", req.body);
    var dif_time = req.body.time;
    var category = req.body.category;
    if (category > 0) {
        Items.aggregate([
            {
                $match: {
                    updatedAt: {
                        $gte: new Date(new Date().getTime() - 1000 * 86400 * dif_time)
                    }
                }
            },
            {
                $group: {
                    _id: "$collection_id",
                    totalPrice: {

                        $sum: "$price"
                    }
                }
            },
            {
                $lookup: {
                    from: "collections",
                    localField: "_id",
                    foreignField: "_id",
                    as: "collection_info"
                }
            },
            {
                $unwind: "$collection_info"
            },
            {
                $unwind: "$collection_info.items"
            },
            {
                $match: {
                    "collection_info.category": category
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "collection_info.items",
                    foreignField: "_id",
                    as: "item_info"
                }
            },
            {
                $unwind: "$item_info"
            },
            {
                $project: {
                    col_id: "$_id",
                    totalPrice: 1,
                    assets: {
                        $sum: 1
                    },
                    collection_info: 1,
                    owner_id: "$item_info.owner"
                }
            },
            {
                $group: {

                    _id: ["$owner_id", "$col_id"],
                    assets: {
                        $sum: "$assets"
                    },
                    owner_cnt: {
                        $sum: 1
                    },
                    totalPrice: {
                        "$first": "$totalPrice"
                    },
                    collection_info: {
                        "$first": "$collection_info"
                    }
                }
            },
            {
                $project: {
                    _id: "$collection_info._id",
                    assets: 1,
                    owner_cnt: 1,
                    totalPrice: 1,
                    collection_info: 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    assets: {
                        $sum: "$assets"
                    },
                    cnt: {
                        $sum: 1
                    },
                    totalPrice: {
                        "$first": "$totalPrice"
                    },
                    collection_info: {
                        "$first": "$collection_info"
                    }
                }
            },
            {
                $sort: {
                    "totalPrice": - 1
                }
            }
        ]).then((data) => {
            return res.send({ code: 0, list: data });
        }).catch((error) => {
            console.log(error);
            return res.send({ code: 1 });
        });
    }
    else {
        Items.aggregate([
            {
                $match: {
                    updatedAt: {
                        $gte: new Date(new Date().getTime() - 1000 * 86400 * dif_time)
                    }
                }
            },
            {
                $group: {
                    _id: "$collection_id",
                    totalPrice: {

                        $sum: "$price"
                    }
                }
            },
            {
                $lookup: {
                    from: "collections",
                    localField: "_id",
                    foreignField: "_id",
                    as: "collection_info"
                }
            },
            {
                $unwind: "$collection_info"
            },
            {
                $unwind: "$collection_info.items"
            },
            {
                $lookup: {
                    from: "items",
                    localField: "collection_info.items",
                    foreignField: "_id",
                    as: "item_info"
                }
            },
            {
                $unwind: "$item_info"
            },
            {
                $project: {
                    col_id: "$_id",
                    totalPrice: 1,
                    assets: {
                        $sum: 1
                    },
                    collection_info: 1,
                    owner_id: "$item_info.owner"
                }
            },
            {
                $group: {

                    _id: ["$owner_id", "$col_id"],
                    assets: {
                        $sum: "$assets"
                    },
                    owner_cnt: {
                        $sum: 1
                    },
                    totalPrice: {
                        "$first": "$totalPrice"
                    },
                    collection_info: {
                        "$first": "$collection_info"
                    }
                }
            },
            {
                $project: {
                    _id: "$collection_info._id",
                    assets: 1,
                    owner_cnt: 1,
                    totalPrice: 1,
                    collection_info: 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    assets: {
                        $sum: "$assets"
                    },
                    cnt: {
                        $sum: 1
                    },
                    totalPrice: {
                        "$first": "$totalPrice"
                    },
                    collection_info: {
                        "$first": "$collection_info"
                    }
                }
            },
            {
                $sort: {
                    "totalPrice": - 1
                }
            }
        ]).then((data) => {
            return res.send({ code: 0, list: data });
        }).catch((error) => {
            console.log(error);
            return res.send({ code: 1 });
        });
    }

    // Collection
    //     .find(matchParams)
    //     // .find({collection_id: {category : 1}})
    //     .sort({ createdAt: req.body.date == 0 ? -1 : 0 })
    //     .skip(start).limit(last - start)
    //     .then((data) => {
    //         return res.send({ code: 0, data: data });
    //     }).catch((error) => {
    //         return res.send({ code: 1 });
    //     })
}

exports.getCategoryCollections = (req, res) => {
    const categoryId = req.body.categoryId;
    const page = req.body.page;
    const limit = req.body.limit;

    Collection.find({ category: categoryId })
        .skip(page * limit).limit(limit)
        .then((docs) => {
            return res.status(200).send({ success: true, data: docs, message: "success" });
        })
        .catch((err) => {
            console.log("Hot collection doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
}

exports.getUserCollectionList = (req, res) => {
    const userId = req.body.userId;
    const page = req.body.page;
    const limit = req.body.limit;

    Collection.find({ owner: ObjectId(userId) })
        .populate("owner")
        .skip(page * limit).limit(limit)
        .then((docs) => {
            return res.status(200).send({ success: true, data: docs, message: "success" });
        })
        .catch((err) => {
            console.log("Hot collection doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
}

exports.getNewCollectionList = (req, res) => {
    Collection
        .find()
        .populate("owner")
        .sort({ createdAt: -1 })
        .limit(4)
        .then((data) => {
            return res.send({ success: true, data: data });
        })
        .catch(() => {
            return res.send({ success: false });
        });
}

exports.getCollectionNames = (req, res) => {
    var name = req.body.name ? req.body.name : "";
    var limit = req.body.limit ? req.body.limit : 10;

    Collection.find({ name: { $regex: new RegExp("^" + name, "i") } }, { "_id": 1, "name": 1 })
        .sort({ createdAt: -1 })
        // .sort({ name: 1 })
        .skip(0)
        .limit(limit)
        .then((data) => {
            return res.send({ code: 0, list: data });
        }).catch(() => {
            return res.send({ code: 0, list: [] });
        })
}


exports.getCollectionMetadatas = (req, res) => {
    var id = req.body.id;
    Collection.find({ _id: ObjectId(id) }, { metaData: 1 }).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch(() => {
        return res.send({ code: 1, data: data });
    })
}