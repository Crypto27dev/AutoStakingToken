const express = require('express');
const router = express.Router();
const users = require("./controller");

// router.get('/', users.findAll);
router.put('/:id', users.update);
router.post('/create', users.create);
router.post('/findOne', users.getDetailById);
router.delete('/', users.delete);
router.post("/login", users.login);

router.post('/get_popular_user_list', users.getPopularUserList);
router.post('/set_fav_item', users.setFav);

router.post('/get_upload_user', users.getUploadUser);
router.post('/put_sale', users.putSale);
router.post('/remove_sale', users.removeSale);



module.exports = router;