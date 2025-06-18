const express = require("express");
const {
    manageroleDataController1,
    manageroleDataController2,
    manageroleDataController3,
    manageroleDataController4
} = require("../controller/manageroleController");

const router = express.Router();

router.post("/manageroledata", manageroleDataController1);
router.get("/manageroledata", manageroleDataController2);
router.put("/manageroledata/:id", manageroleDataController3);
router.delete("/manageroledata/:id", manageroleDataController4);

module.exports = router;