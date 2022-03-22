const express = require('express');
const router = express.Router();
const items = require("./controller");

// router.get('/', items.findAll);
router.put('/update', items.update);
router.post('/create', items.create);
router.post('/multiple_create', items.multipleCreate);
// router.get('/:id', items.get);
// router.post('/findOne', items.findOne);
// router.delete('/', items.delete);

router.post('/get_items_of_user', items.getItemsOfUserByCondition);
router.post('/get_items_of_collection', items.getItemsOfCollection);
router.post('/get_banner_list', items.getBannerList);
router.post('/get_detail', items.findOne);
router.post("/get_new_items_list", items.getNewItemsList);

router.post('/set_price', items.setPrice);
router.post('/get_owner_history', items.getOwnerHistory);

module.exports = router;
