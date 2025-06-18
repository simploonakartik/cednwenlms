const express = require("express");
const { AddwonData, GetwonData, DeletewonData, updatewonData } = require("../controller/wonDataController")
const router = express.Router();
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({  
    destination: function (req, file, cb) {
        return cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});
  
const upload = multer({ storage: storage });

// Modify route to handle multiple files
router.post("/wonData", AddwonData);
router.get("/getwonData", GetwonData);
router.delete("/deletewonData/:id", DeletewonData);
router.put("/updatewonData/:id",upload.fields([{ name: 'Invoice', maxCount: 1 }, { name: 'Certificate', maxCount: 1 }]), updatewonData);

module.exports = router;