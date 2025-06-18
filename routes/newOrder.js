const express = require("express");
const { AddNeworder, GetNeworder, DeleteNeworder, updateorder } = require("../controller/newOrder")
const router = express.Router();
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        // Remove spaces and special characters
        const cleanFileName = file.originalname.replace(/\s+/g, "_").replace(/[()]/g, "");
        cb(null, `${Date.now()}-${cleanFileName}`);
    },
});
  
const upload = multer({ storage: storage });

// Modify route to handle multiple files
router.post("/newOrder", upload.fields([{ name: 'Invoice', maxCount: 1 }, { name: 'Certificate', maxCount: 1 }]), AddNeworder);
router.get("/getNewOrder", GetNeworder);
router.delete("/deleteOrder/:id", DeleteNeworder);
router.put("/updateOrder/:id",upload.fields([{ name: 'Invoice', maxCount: 1 }, { name: 'Certificate', maxCount: 1 }]), updateorder);

module.exports = router;  


