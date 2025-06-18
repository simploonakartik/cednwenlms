const express = require("express");
const { AddInvoice, GetInvoice, DeleteInvoice, updateInvoice } = require("../controller/InvoiceController")
const router = express.Router();

router.post("/newinvoice", AddInvoice);
router.get("/getinvoice", GetInvoice);
router.delete("/deleteinvoice/:id", DeleteInvoice);
router.put("/updateinvoice/:id", updateInvoice);

module.exports = router;  