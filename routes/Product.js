const express = require('express');
const router = express.Router();
const { PostproductDataControl, GetprductDataControl, PutproductDataControl, DeleteproductDataControl } =require( "../controller/Product")
router.post("/postProduct", PostproductDataControl);
router.get("/getProduct", GetprductDataControl);
router.put("/updateProduct/:id", PutproductDataControl);
router.delete("/deleteProduct/:id", DeleteproductDataControl);

module.exports = router;