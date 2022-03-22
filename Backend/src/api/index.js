const express = require('express');

const users = require('./users');
const items = require('./items');
const admin = require('./admin');
const utils = require('./utils');
const bids = require('./bids');
const sales = require('./sales');
const collections = require('./collections');
const follows = require('./follows');
const notifies = require('./notifies');
const checkAuthentication = require('./private_router');

const router = express.Router();


router.use('/users', checkAuthentication, users);
router.use('/item',  checkAuthentication, items);
router.use('/admin',  checkAuthentication, admin);
router.use('/utils',  checkAuthentication, utils);
router.use('/bid', checkAuthentication, bids);
router.use('/sale',  checkAuthentication, sales);
router.use('/collection', checkAuthentication, collections);
router.use('/follow', checkAuthentication, follows);
router.use('/notify', checkAuthentication, notifies);



module.exports = router;