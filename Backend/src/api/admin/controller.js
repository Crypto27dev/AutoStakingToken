const db = require("../../db");
const Users = db.User;

exports.getUsers = async (req, res) => {
    var page = req.body.page;
    var itemsByPage = req.body.itemsByPage;
    var promise = [];
    var query = {};
    if (req.body.keyword != '') {
        if (req.body.searchType == 0) {
            query = {username: new RegExp('.*' + req.body.keyword + '.*', "i")};
        } else if (req.body.searchType == 1) {
            query = {address: new RegExp('.*' + req.body.keyword + '.*', "i")};
        } else if (req.body.searchType == 2) {
            query = {socials: new RegExp('.*' + req.body.keyword + '.*', "i")};
        }
    }
    promise.push(Users.find(query).skip((page - 1) * itemsByPage).limit(itemsByPage));
    promise.push(Users.count(query));
    Promise.all(promise).then((result) => {
        return res.send({ count: result[1], data: result[0] });
    }).catch((err) => {
        return res.status(500).send({
            message: err.message || "some error occured while retrieving user data"
        });
    });
}

exports.updateUserInfo = (req, res) => {
    var _id = req.body._id;
    var verified = req.body.verified;
    Users.findByIdAndUpdate(
        _id,
        {
            verified: verified
        },
        { useFindAndModify: false }
    )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: `Cannot update User with id = ${_id}. Maybe User was not found.`,
                });
            } else return res.send({ message: "User was updated successfully" });
        })
        .catch((err) => {
            return res.status(500).send({
                message: "Error updating User with id = " + _id,
            });
        });
}






exports.create = (req, res) => {

    const user = new Users({
        address: "address",
        username: "user Name",
        customURL: "custom url",
        profilePhoto: "profile photo",
        userBio: "bio",
        websiteURL: "website",
    });

    user
        .save(user)
        .then((data) => {
            return res.send(data);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
        });
}

exports.findAll = (req, res) => {
    const address = req.query.address;
    var condition = { address: { $regex: new RegExp(address), $options: "i" } };

    Users.find(condition)
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
    const address = req.body.address;
    Users.findOne({ address: address })
        .then((data) => {
            if (!data) {
                return res
                    .status(404)
                    .send({ message: "Not found User with address " + adderss });
                
            } else {
                return res.send(data);
            }
        })
        .catch((err) => {
            // res.status(500)
            // .send({message: "Error retrieving User with address = " + address});
        });
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!",
        });
    }


    const id = req.body.id;
    const username = req.body.username;
    const customURL = req.body.customURL;
    const profilePhoto = req.body.profilePhoto;
    const userBio = req.body.userBio;
    const websiteURL = req.body.websiteURL;
    const url = req.protocol + '://' + req.get('host');


    Users.findByIdAndUpdate(
        id,
        {
            username: username,
            customURL: customURL,
            profilePhoto: profilePhoto,
            userBio: userBio,
            websiteURL: websiteURL,
            userImg: url + '/' + req.file.filename,
        },
        { useFindAndModify: false }
    )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: `Cannot update User with id = ${id}. Maybe User was not found.`,
                });
            } else return res.send({ message: "User was updated successfully" });
        })
        .catch((err) => {
            return res.status(500).send({
                message: "Error updating User with id = " + id,
            });
        });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Users.findByIdAndRemove(id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: `Cannot delete User with id = ${id}. Maybe User was not found.`,
                });
            } else {
                return res.send({
                    message: "User was deleted successfully!",
                });
            }
        })
        .catch((err) => {
            return res.status(500).send({
                message: "Could not delete User with id = " + id,
            });
        });
}


exports.deleteAll = (req, res) => {
    Users.deleteMany({})
        .then((data) => {
            return res.send({
                message: `${data.deletedCount} Users were deleted succesfully!`,
            });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Some error occurred while removing all Users.",
            });
        });
};
