const express = require('express');
const router = express.Router();
const admin = require("./controller");



router.post('/get_users', admin.getUsers);
router.post('/update_user_info', admin.updateUserInfo);
module.exports = router;