const express = require("express");
const {AddNewproposal,GetNewproposal,DeleteNewproposal,updateproposal} = require("../controller/ProposalController") 
const router = express.Router();

router.post("/newproposal", AddNewproposal);
router.get("/getNewproposal", GetNewproposal);
router.delete("/deleteProposal/:id", DeleteNewproposal );
router.put("/updateproposal/:id", updateproposal );

module.exports = router;
         