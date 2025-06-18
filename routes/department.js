const express = require("express");
const {
    addDepartmentData,
    getDepartmentData,
    updateDepartmentData,
    deleteDepartmentData
} = require("../controller/department");

const router = express.Router();

router.post("/savedepartment", addDepartmentData);
router.get("/getdepartment", getDepartmentData);
router.put("/updatedepartment/:id", updateDepartmentData);
router.delete("/deletedepartment/:id", deleteDepartmentData);

module.exports = router;