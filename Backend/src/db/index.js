const dbConfig = require('./config');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.User = require("./users.model")(mongoose);
db.Item = require("./items.model")(mongoose);
db.Collection = require("./collections.model")(mongoose);
db.Bid = require('./bids.model')(mongoose);
db.Sale = require('./sales.model')(mongoose);
db.Follow = require("./follow.model")(mongoose);
db.Notify = require("./notify.model")(mongoose);

module.exports = db;
