const express= require('express')
const { protect } = require('../middlewares/authMiddleware');
const { sendMessages, allMessages } = require('../controllers/messageController');

const router= express.Router()

router.route("/").post(protect,sendMessages);
router.route("/:q").get(protect,allMessages);

module.exports= router
