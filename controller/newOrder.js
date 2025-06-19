const OrderData = require("../models/newOrder");

const AddNeworder = async (req, res) => {
  try {

    const baseURL = "http://localhost:5000/uploads/";

    const Invoice = req.files?.Invoice ? `${baseURL}${req.files.Invoice[0].filename}` : null;
    const Certificate = req.files?.Certificate ? `${baseURL}${req.files.Certificate[0].filename}` : null;


    const { ClientName, QuotationNumber, PONumber, PODate, OPSId, OPSDate, SalesEngineer, fullName, emailId, rows, Note, Terms, InvoiceNote, CertificateNote } = req.body;
    const parsedRows = JSON.parse(rows);

    const newOrder = new OrderData({
      ClientName,
      QuotationNumber,
      PONumber,
      PODate,
      OPSId,
      OPSDate,
      SalesEngineer,
      fullName,
      emailId,
      rows: parsedRows,
      Note,
      Terms,
      InvoiceNote,
      Invoice,
      CertificateNote,
      Certificate
    });

    const savedProposalData = await newOrder.save();
    const baseUrl = "http://localhost:5000/uploads/";
    res.status(201).json({
      message: "Order created successfully!",
      data: {
        Invoice: Invoice ? `${baseUrl}${Invoice}` : null,
        Certificate: Certificate ? `${baseUrl}${Certificate}` : null,
      },
    });
  } catch (error) {
    console.error("Error in saving order:", error);
    res.status(500).json({ message: "An error occurred while saving the order." });
  }
};



const GetNeworder = async (req, res) => {
  try {
    const response = await OrderData.find();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const updateorder = async (req, res) => {
  try {
    const { id } = req.params;
    const { InvoiceNote, CertificateNote } = req.body;
    const baseURL = "http://localhost:5000/uploads/";
    const Invoice = req.files?.Invoice ? `${baseURL}${req.files.Invoice[0].filename}` : null;
    const Certificate = req.files?.Certificate ? `${baseURL}${req.files.Certificate[0].filename} ` : null;
    const updatedadminProduct = await OrderData.findByIdAndUpdate(
      id, {
        InvoiceNote,  
        CertificateNote, 
      Invoice: Invoice || undefined,
      Certificate: Certificate || undefined
    },
      { new: true }
    );
    res.status(200).json(updatedadminProduct);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Server error");
  }
};

const DeleteNeworder = async (req, res) => {
  try {
    const id = req.params.id;
    await OrderData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  AddNeworder,
  GetNeworder,
  DeleteNeworder,
  updateorder,
};
