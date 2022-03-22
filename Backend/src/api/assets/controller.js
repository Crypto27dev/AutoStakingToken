const db = require("../../db");
const Asset = db.Asset;

exports.create = (req, res) => {
    var reqItem = req.body;
    reqItem.itemId = reqItem.itemId == "" ? 0 : reqItem.itemId;
    const item = new Asset({
        name: reqItem.itemName,
        logoURL: reqItem.itemLogoURL,
        bannerURL: "",
        description: reqItem.itemDescription,
        royalty: Number(reqItem.itemRoyalty),
        size: Number(reqItem.itemSize),
        property: reqItem.itemProperty,
    });
    // console.log(reqItem);
    item
        .save()
        .then((data) => {
            return res.send(data);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
        });
}

exports.update = (req, res) => {
}

exports.delete = (req, res) => {
}

exports.deleteAll = (req, res) => {
};

exports.get = (req, res) => {
	Assets.findOne({ _id: req.params.id }, function (err, docs) {
		// console.log("err : " + err);
		if (err) {
			console.log("Author doesn't exisit" + err.message);
			return res.status(500).send({ success: false, message: "Internal server Error" });
		}
		else {
			if (docs !== null && docs !== undefined) return res.status(200).send({ success: true, data: docs, message: "success" });
			else return res.status(404).send({ success: false, data: [], message: "Can't find such asset." });
		}
	});
};


exports.getBannerList = (req, res) => {
    
    Assets.find({sort: {createAt: -1}}).limit(req.body.limit)
    .then((data) => {
        return res.send(data);
    })
    .catch((err) => {
        return res.status(500).send({
            message:
                err.message || "Some error occured while retrieving tutorials.",
        });
    });    
}


exports.findOne = (req, res) => {
    const id = req.body.id;
    Assets.findOne({_id: id}).
    then((data) => {
        if (!data) {
            return res.status(404)
            .send({message: "Not found Asset"});
        } else {
            return res.send(data);
        }
    }).catch((err) => {
        return res.status(500)
        .send({message: "Error retrieving Assets with id = " + id});
    });
}
