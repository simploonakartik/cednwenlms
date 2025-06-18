const express = require("express");
const {
  loginController,
  userDataController1,
  userDataController2,
  userDataController3,
  userDataController4,
  cmDataController1,
  cmDataController2,
  cmDataController3,
  cmDataController4, 
} = require("../controller/userController");  
const router = express.Router();

router.post("/login", loginController);

router.post("/userdata", userDataController1);
router.get("/userdata", userDataController2);
router.put("/userdata/:id", userDataController3);
router.delete("/userdata/:id", userDataController4);

router.post("/cmdata", cmDataController1);
router.get("/cmdata", cmDataController2);
router.put("/cmdata/:id", cmDataController3);
router.delete("/cmdata/:id", cmDataController4);

module.exports = router;
    