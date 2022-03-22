const express = require('express');
const router = express.Router();
const notifies = require("./controller");

router.post('/', notifies.CreateNotify);
router.post('/markAllAsRead', notifies.markAllAsRead);
router.post('/filtering', notifies.getNotifiesByFilter);
// router.get('/', notifies.FindNotify);
router.post('/getlist', notifies.getNotifiesByLimit);
// router.get('/:id', notifies.FindOneNotify);
router.put('/:id', notifies.UpdateNotify);
router.delete('/:id', notifies.DeleteNotify);

module.exports = router;
