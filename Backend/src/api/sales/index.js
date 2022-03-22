const express = require('express');
const router = express.Router();
const sales = require("./controller");

router.post('/buy', sales.buy);

module.exports = router;