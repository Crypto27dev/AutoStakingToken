const express = require('express');
const router = express.Router();
const collection = require("./controller");

// router.get('/', assets.findAll);
// router.post('/update', assets.update);
router.post('/', collection.create);
router.post('/detail', collection.getDetail);
router.put('/:id', collection.update);
// router.post('/findOne', collection.findOne);
// router.delete('/', collection.delete);

// router.get('/get_banner_list', collection.getBannerList);

router.post("/get_category_collections", collection.getCategoryCollections);
router.post("/get_hot_collections", collection.getHotCollections);
router.post("/getUserCollections", collection.getUserCollectionList);
router.post("/get_new_collection_list", collection.getNewCollectionList);

router.post("/get_collection_names", collection.getCollectionNames);
router.post("/get_collection_metadatas", collection.getCollectionMetadatas);

router.post("/get_collection_list", collection.getCollectionList);
router.post("/get_collection_rank", collection.getCollectionRank);


module.exports = router;
