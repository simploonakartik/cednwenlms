const express = require("express");
const {proposalSave,proposalGet,proposalDelete} = require("../controller/proposalAll.js");
const router = express.Router();

router.post("/newproposalall", proposalSave);
router.get("/getproposalall", proposalGet)
router.delete("/deleteProposal/:id",proposalDelete)

module.exports = router;
   