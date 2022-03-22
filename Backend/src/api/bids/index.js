const express = require('express');
const router = express.Router();
const bids = require("./controller");

router.post('/set_bid', bids.setBid);
router.post('/get_hot_bids', bids.getHotBids);
router.post('/accept_bid', bids.acceptBid);

module.exports = router;