const express = require("express");
const {
    adminDataController1,
    adminDataController2,
    adminDataController3,
    adminDataController4
} = require("../controller/adminController");

const router = express.Router();

router.post("/adminData", adminDataController1);
router.get("/adminData", adminDataController2);
router.put("/adminData/:id", adminDataController3);
router.delete("/adminData/:id", adminDataController4);

module.exports = router;
