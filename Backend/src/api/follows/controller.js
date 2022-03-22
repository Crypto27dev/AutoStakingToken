const db = require("../../db");
const Follow = db.Follow;
var ObjectId = require('mongodb').ObjectID;
var User = db.User;
var Item = db.Item;

exports.toggleFollow = (req, res) => {
    var my_id = req.body.my_id;
    var target_id = req.body.target_id;
    console.log("")
    console.log("[toggleFollow] req.body = ", req.body)
    console.log("")
    User.aggregate([
        {
            $match: {
                _id: ObjectId(target_id)
            }
        },
        {
            $project: {
                is_follow: {
                    $in: [ObjectId(my_id), "$follows"]
                }
            }
        }
    ]).then((data) => {

        if (data.length == 0 || !data[0].is_follow) {
            // push user 
            User.updateOne({
                _id: ObjectId(target_id)
            }, {
                $push: {
                    follows: ObjectId(my_id)
                }
            }).then(async () => {               
                let userInfo = await User.findOne({
                    _id: new ObjectId(target_id)
                }, { username: 1, avatar: 2 });
                if(!userInfo) return res.send({ code: 0 });
                // console.log("[toggleFollow] userInfo = ", userInfo)
                let descriptionStr = "A following is happend to "+ userInfo.username;
                const new_notify = new Notify(
                    {
                        url: "/profile/" + target_id,
                        imgUrl: userInfo.avatar,
                        subTitle: "Following is happend",
                        description: descriptionStr,
                        date: new Date(),
                        readers: [],
                        target_ids: [],
                        Type: 5
                    });
                new_notify.save(function (err) {
                    if (!err) {
                    }
                });
                return res.send({ code: 0 });
            }).catch(() => {
                return res.send({ code: 1 });
            });
        } else if (data.length > 0 && data[0].is_follow) {
            // pull user
            User.updateOne(
                {
                    _id: ObjectId(target_id)
                }, {
                $pull: {
                    follows: ObjectId(my_id)
                }
            }
            ).then(async () => {
                let userInfo = await User.findOne({
                    _id: new ObjectId(target_id)
                }, { username: 1, avatar: 2 });
                if(!userInfo) return res.send({ code: 0 });
                // console.log("[toggleFollow] userInfo = ", userInfo)
                let descriptionStr = "A following to "+userInfo.username+" is canceled";

                const new_notify = new Notify(
                    {
                        url: "/profile/" + target_id,
                        imgUrl: userInfo.avatar,
                        subTitle: "Unfollowing is happend",
                        description: descriptionStr,
                        date: new Date(),
                        readers: [],
                        target_ids: [],
                        Type: 5
                    });
                new_notify.save(function (err) {
                    if (!err) {
                    }
                });
                return res.send({ code: 0 });
            }).catch(() => {
                return res.send({ code: 1 });
            })
        }
    }).catch(() => {
        return res.send({ code: 1 })
    });

}

exports.getFollows = (req, res) => {

    var my_id = req.body.my_id;
    var resultObjectArry = []; var j;

    // console.log("[getFollows] my_id = ", my_id);

    User.findOne({ _id: new ObjectId(my_id) })
        .then(async (docs) => {
            // console.log("[getFollows]  docs ", docs);

            // console.log("docs.follows = ", docs.follows);
            let j;
            for (j = 0; j < docs.follows.length; j++) {
                var resultObject = {};
                await User.findOne({ _id: new ObjectId(docs.follows[j]) })
                    .then(async (docs) => {
                        // console.log(" secondary docs = ", docs);
                        let targetsFollowers = 0; let targetGallery = [];

                        resultObject.name = docs.username;
                        resultObject.avatar = docs.avatar;
                        resultObject.url = docs.customURL;
                        resultObject.id = docs._id;

                        await User.find({ follows: new ObjectId(docs._id) })
                            .then((data) => {
                                if (data !== null) targetsFollowers = data.length;
                                else targetsFollowers = 0;                                
                            })
                            .catch((err) => { targetsFollowers = 0; })
                        resultObject.counter = targetsFollowers;

                        await Item.find({ owner: new ObjectId(docs._id) })
                            .skip(0).limit(5)
                            .then((data) => {
                                if (data.length === 0) targetGallery = [];
                                else for (i = 0; i < data.length; i++)
                                    targetGallery.push(data[i].logoURL);
                            })
                            .catch((err) => {
                                targetGallery = [];
                            })
                        resultObject.gallery = targetGallery;

                    })
                    .catch((err) => {
                        resultObject = {};
                    })
                resultObjectArry.push(resultObject);                
            }
            return res.status(200).send({ success: true, data: resultObjectArry, message: "success" });
        })
        .catch((err) => {
            // console.log("Follow doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })

}

exports.getFollowings = (req, res) => {
    var my_id = req.body.my_id;
    var resultObjectArry = []; var j;
    // console.log("[getFollowings] my_id = ", my_id);

    User.find({ follows: new ObjectId(my_id) })
        .then(async (docs) => {
            // console.log("[getFollowings]  docs ", docs);

            if (docs.length > 0) {
                // console.log("docs.length = ", docs.length);
                for (j = 0; j < docs.length; j++) {
                    var resultObject = {};
                    await User.findOne({ _id: new ObjectId(docs[j]._id) })
                        .then(async (docs) => {
                            // console.log(" secondary docs = ", docs);
                            let targetsFollowers = 0; let targetGallery = [];

                            resultObject.name = docs.username;
                            resultObject.avatar = docs.avatar;
                            resultObject.url = docs.customURL;
                            resultObject.id = docs._id;

                            await User.find({ follows: new ObjectId(docs._id) })
                                .then((data) => {
                                    if (data !== null) targetsFollowers = data.length;
                                    else targetsFollowers = 0;
                                })
                                .catch((err) => { targetsFollowers = 0; })
                            resultObject.counter = targetsFollowers;

                            await Item.find({ owner: new ObjectId(docs._id) })
                                .skip(0).limit(5)
                                .then((data) => {
                                    if (data.length === 0) targetGallery = [];
                                    else for (i = 0; i < data.length; i++)
                                        targetGallery.push(data[i].logoURL);
                                })
                                .catch((err) => {
                                    targetGallery = [];
                                })
                            resultObject.gallery = targetGallery;

                        })
                        .catch((err) => {
                            resultObject = {};
                        })
                    resultObjectArry.push(resultObject);
                }
                return res.status(200).send({ success: true, data: resultObjectArry, message: "success" });
            }
            else return res.status(200).send({ success: true, data: [], message: "success" });
        })
        .catch((err) => {
            console.log("Follow doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
    return;
}





exports.isExists = (req, res) => {
    var user_id = req.body.user_id;
    var target_id = req.body.target_id;
    
    User.find({ _id: new ObjectId(target_id), follows: new ObjectId(user_id)})
        .then(async (docs) => {       
            // console.log("docs = ", docs);
            if ( docs.length > 0 )
                return res.status(200).send({
                    success: true, data: true, message: "Pair exists"
                })
            else {
                return res.status(200).send({
                    success: true, data: false, message: "No such pair"
                })
            }
        })
        .catch((err) => {
            return res.status(200).send({
                success: false, message: "Internal server error"
            })
        })
    
    return;
}
