const express = require('express');
const router = express.Router();
const { PostuserDataControl, GetuserDataControl, PutuserDataControl, DeleteuserDataControl } =require( "../controller/UserContrl")
router.post("/postUser", PostuserDataControl);
router.get("/getUser", GetuserDataControl);
router.put("/updateUser/:id", PutuserDataControl);
router.delete("/deleteUser/:id", DeleteuserDataControl);

module.exports = router;