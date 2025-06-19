// Import necessary modules
const express = require("express");
const cors = require("cors");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const connectDB = require("./config/db");
const adminData = require("./models/adminDataModel");
const userData = require("./models/userDataModel");
// Initialize app and middleware
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
// Connect to the database
connectDB();

// Configure Multer for file uploads
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

// Google Cloud Storage configuration
const projectId = "clever-stone-447211-u3";
const keyFilename = "mykey.json";
const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket("cedwenlms");

/**
 * Upload an image file and save metadata to MongoDB
*/

app.post("/userdata", multer.single("imageUrl"), async (req, res) => {
  console.log("Received request at /upload");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate a unique file name
    const uniqueFileName = `${Date.now()}_${req.file.originalname}`;
    const blob = bucket.file(uniqueFileName);

    // Create a write stream for file upload
    const blobStream = blob.createWriteStream();

    blobStream.on("finish", async () => {
      console.log("File uploaded successfully");
      // Generate a signed URL valid for 1 year
      const [signedUrl] = await blob.getSignedUrl({
        action: "read",
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
      });

      // Save metadata to MongoDB
      const newAdminData = new userData({
        productName: req.body.productName,
        licenseType: req.body.licenseType,
        skuId: req.body.skuId,
        description: req.body.description,
        sellingPrice: req.body.sellingPrice,
        uploadFile: req.body.uploadFile,
        imageUrl: signedUrl,
      });
      await newAdminData.save();

      return res.status(200).json({
        message: "File uploaded and data saved successfully",
        imageUrl: signedUrl,
      });
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "File upload failed" });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error in /upload route:", error);
    return res
      .status(500)
      .json({ error: error.message || "An internal error occurred" });
  }
});
/**
 * Retrieve all files from the Google Cloud Storage bucket
 */
app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    console.log("Retrieved files successfully");
    return res.status(200).json(files);
  } catch (error) {
    console.error("Error retrieving files:", error);
    return res.status(500).json({ error: "Failed to retrieve files" });
  }
});
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/adminRoutes"));
app.use("/api", require("./routes/manageroles"));
app.use("/api", require("./routes/manageProposal"));
app.use("/api", require("./routes/proposalAllRoute"));
app.use("/api", require("./routes/newOrder"));
app.use("/api", require("./routes/orderRoute"));
app.use("/api", require("./routes/wonDataRoute"));
app.use("/api", require("./routes/department"))
app.use("/api", require("./routes/dcr"))
app.use("/api", require("./routes/manageInvoice"))
app.use("/api", require("./routes/UserRoute"))
app.use("/api", require("./routes/Product"))
// Start the server  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
