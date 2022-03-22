const express = require('express');
const router = express.Router();
const follows = require("./controller");

router.post('/toggle_follow', follows.toggleFollow); 
router.post('/get_follows', follows.getFollows);
router.post('/get_followings', follows.getFollowings);
router.post('/get_isExists', follows.isExists);
//delete_follow

module.exports = router;