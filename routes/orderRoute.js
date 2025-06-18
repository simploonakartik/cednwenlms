const express = require("express");
const { AddNeworder, GetNeworder, DeleteNeworder, updateorder } = require("../controller/orderController")
const router = express.Router();

router.post("/order", AddNeworder);
router.get("/getOrder", GetNeworder);
router.delete("/deleteOrder/:id", DeleteNeworder);
router.put("/updateOrder/:id", updateorder);

module.exports = router;