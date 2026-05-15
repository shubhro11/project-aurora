const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const chatController = require("../controllers/chat.controller")


const router = express.Router()

/* POST /api/chat/ */
router.post("/newChat", authMiddleware.authUser, chatController.createChat)


/* GET /api/chat/ */
router.get("/getChats", authMiddleware.authUser, chatController.getChats)


/* DELETE /delete/:id */
router.delete("/delete-chat/:id", authMiddleware.authUser, chatController.deleteChat)

/* GET /api/chat/message/:id */
router.get("/message/:id", authMiddleware.authUser, chatController.getMessages)


module.exports = router