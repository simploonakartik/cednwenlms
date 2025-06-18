const express = require("express");
const {
    addDcrData,
    getDcrData,
    updateDecrData,
    deleteDcrData
} = require("../controller/dcrController");

const router = express.Router();

router.post("/saveddcr", addDcrData);
router.get("/getdcr", getDcrData);
router.put("/updatedcr/:id", updateDecrData);
router.delete("/deletedcr/:id", deleteDcrData);

module.exports = router;