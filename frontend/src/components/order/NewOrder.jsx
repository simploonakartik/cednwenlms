import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
function NewOrder() {
  const [cmData, setCmData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedAddress1, setSelectedAddress1] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [staTe, setStaTe] = useState("");
  const [gstno, setGstno] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientID, setClientID] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gstNO, setGstNO] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [PAN, setPAN] = useState("")
  const [editingIndex, setEditingIndex] = useState(null);
  const [userCMdata, setUserCMdata] = useState();
  const [productData, setProductData] = useState([]);
  const [sellingprice, setSellingprice] = useState("");
  const [addProduct, setAddProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [skuId, setSkuId] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [file, setFile] = useState(null);
  const [certificatefile, setCertificatefile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [admindata, setAdmindata] = useState([])
  const [invoicefile, setInvoicefile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientType, setClientType] = useState("Existing Client");
  const [counter, setCounter] = useState(1);
  const [createdBy, setCreatedBy] = useState("");
  const [department, setDepartment] = useState("");
  const [pocSections, setPocSections] = useState([{ id: 1, Name: '', designation: '', email: '', phone: '', department: "" }]);
  const [departmentData, setDepartmentData] = useState([])
  const [userName, setUserName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [rows, setRows] = useState([
    {
      id: 1,
      SelectProducts: "",
      Quantity: 1,
      Rate: 0,
      Tax: 0,
      Amount: 0,
      CGST: 0,
      SGST: 0,
    },
  ]);

  const addNewRow = () => {
    const newRow = {
      id: rows.length + 1,
      SelectProducts: "",
      Quantity: 1,
      Rate: 0,
      Tax: 0,
      Amount: 0,
      CGST: 0,
      SGST: 0,
    };

    setRows([...rows, newRow]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      rows: [...(prevFormData.rows || []), newRow],
    }));
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName")
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  useEffect(() => {
    const storedJobRole = localStorage.getItem("jobrole")
    if (storedJobRole) {
      setJobRole(storedJobRole)
    }
  }, [])


  const [formData, setFormData] = useState({
    BillCompanyName: "",
    BillAddress: "",
    BillCity: "",
    BillState: "",
    BillPincode: "",
    ShipCompanyName: "",
    ShipAddress: "",
    ShipCity: "",
    ShipState: "",
    ShipPincode: "",
    QuotationNumber: "",
    PONumber: "",
    PODate: "",
    OPSId: "",
    OPSDate: "",
    SalesEngineer: "",
    fullName: "",
    emailId: "",
    rows: [],
    Note: "",
    Terms: "",
    ClientName: "",
    Certificate: "",
    Invoice: "",
    CertificateNote: "",
    InvoiceNote: ""
  });
 

  const handleSearch = () => { };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cmdata");
        setCmData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    setFormData({ ...formData, ClientName: e.target.value });
    const selectedCustomer = cmData.find(
      (customer) => customer.companyName === e.target.value
    );
    setSelectedAddress(selectedCustomer ? selectedCustomer.address1 : "");
    setSelectedAddress1(selectedCustomer ? selectedCustomer.address2 : "");
    setPinCode(selectedCustomer ? selectedCustomer.pincode : "");
    setStaTe(selectedCustomer ? selectedCustomer.state : "");
    setGstno(selectedCustomer ? selectedCustomer.gstNO : "");
    setFullName(selectedCustomer.fullName || "");
    setEmailId(selectedCustomer.emailId || "");
    setFormData((prevFormData) => ({
      ...prevFormData,
      fullName: selectedCustomer.fullName || "",
      emailId: selectedCustomer.emailId || "",
    }));
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,

      [name]: value,
    }));
  };

  const HandleChange = (e, index) => {
    const { name, value } = e.target;
    const firstTwoDigits = gstno.toString().slice(0, 2);
    if (value === "newProduct") {
      setAddProduct(true)
    }
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
    };

    if (name === "SelectProducts") {
      const selectedProduct = productData.find(
        (product) => product.productName === value
      );
      const price = selectedProduct ? selectedProduct.sellingPrice : "";
      const gst = selectedProduct ? selectedProduct.GST : "";
      updatedRows[index].Rate = price;
      updatedRows[index].Tax = gst;
    }
    if (firstTwoDigits === "29") {
      updatedRows[index].CGST = updatedRows[index].Tax / 2;
      updatedRows[index].SGST = updatedRows[index].Tax / 2;
    }
    // Recalculate the Amount field dynamically
    const Quantity = parseFloat(updatedRows[index].Quantity || 0);
    const Rate = parseFloat(updatedRows[index].Rate || 0);
    const Tax = parseFloat(updatedRows[index].Tax || 0);

    const amount = Quantity * Rate * (1 + Tax / 100) || 0;
    updatedRows[index].Amount = amount.toFixed();
    setRows(updatedRows);
    setFormData((prevFormData) => ({
      ...prevFormData,
      rows: updatedRows,
    }));
  };
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();    
    if (clientType === "New Client") {
      formDataObj.append("ClientName", companyName);
      formDataObj.append("fullName", fullName);
      formDataObj.append("emailId", emailId);
    } else {
      formDataObj.append("ClientName", formData.ClientName);
      formDataObj.append("fullName", formData.fullName);
      formDataObj.append("emailId", formData.emailId);
    }
    formDataObj.append("QuotationNumber", formData.QuotationNumber);
    formDataObj.append("PONumber", formData.PONumber);
    formDataObj.append("PODate", formData.PODate);
    formDataObj.append("OPSId", formData.OPSId);
    formDataObj.append("OPSDate", formData.OPSDate);
    formDataObj.append("SalesEngineer", formData.SalesEngineer);
    formDataObj.append("Note", formData.Note);
    formDataObj.append("Terms", formData.Terms);
    formDataObj.append("InvoiceNote", formData.InvoiceNote);
    formDataObj.append("CertificateNote", formData.CertificateNote);
    formDataObj.append("rows", JSON.stringify(formData.rows));

    if (invoicefile) {
      formDataObj.append("Invoice", invoicefile);
    }
    if (certificatefile) {
      formDataObj.append("Certificate", certificatefile);
    }
    try {
      if (clientType === "New Client") {
        const res = await axios.post("http://localhost:5000/api/cmdata", {
          companyName,
          clientID,
          fullName,
          emailId,
          phoneNumber,
          gstNO,
          address1,   
          address2,
          city,
          state,
          pincode,
          PAN,
          createdBy,
          department,
          pocSections,
        });
        setUserCMdata(res.data);
        const newCounter = counter + 1;
        setCounter(newCounter);
        localStorage.setItem("clientCounter", newCounter);
      }
      const response = await axios.post("http://localhost:5000/api/newOrder", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    
      setMessage("Order created successfully!");
      if (response.data.data) {
        setUploadedFileUrl(response.data.data.Certificate);
      }
      navigate("/orders")
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage("An error occurred while saving the data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/userdata");
        setProductData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      alert("No file selected");
    }
  };

  const handleaddProductSubmit = async (e) => {
    e.preventDefault();
    const postId = uuidv4();
    let newFile = null;
    if (file) {
      const blob = file.slice(0, file.size, "image/jpeg");
      newFile = new File([blob], `${postId}_post.jpeg`, {
        type: "image/jpeg",
      });
    }
    const formdata = new FormData();
    formdata.append("imageUrl", newFile);
    formdata.append("productName", productName);
    formdata.append("licenseType", licenseType);
    formdata.append("skuId", skuId);
    formdata.append("description", description);
    formdata.append("sellingPrice", sellingPrice);
    try {
      await axios.post("http://localhost:5000/userdata", formdata);
      setAddProduct(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const numberToWords = (num) => {
    if (num === 0) return "Zero Rupees";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    const convertBelowThousand = (n) => {
      let result = "";
      if (n > 99) {
        result += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n > 19) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        result += ones[n] + " ";
      }
      return result.trim();
    };

    let result = "";
    let scaleIndex = 0;

    while (num > 0) {
      const part = num % 1000;
      if (part > 0) {
        result = `${convertBelowThousand(part)} ${scales[scaleIndex]
          } ${result}`.trim();
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
    return `${result.trim()} Rupees`;
  };

  const handleDeleteRow = (index) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((_, i) => i !== index);

      setFormData((prevFormData) => ({
        ...prevFormData,
        rows: updatedRows,
      }));

      return updatedRows;
    });
  };


  const handleInvoiceFileChange = (e) => {
    setInvoicefile(e.target.files[0]);
  };
  const handleCertificateFileChange = (e) => {
    setCertificatefile(e.target.files[0]);
  };

  const handleInvoiceUpload = async () => {
    if (!invoicefile) {
      setMessage("Please choose a file to upload.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const formData = new FormData();
      formData.append("Invoice", invoicefile);
      const response = await axios.post(
        "http://localhost:5000/api/newOrder",
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );

      setMessage(`File uploaded successfully: ${response.data.file.filename}`);
    } catch (err) {
      setMessage("Error uploading file.");
    } finally {
      setLoading(false);
    }
  }
  const fetchadminData = async () => {
    try {
      const adminDataRes = await axios.get(
        "http://localhost:5000/api/adminData"
      );
      const userNames = adminDataRes.data.map(admin => admin.userName);
      setAdmindata(userNames);
    } catch (error) {
      console.log(error)
    }
  }
  // fetchadminData();
  useEffect(() => {
    fetchadminData();
  }, []);

  // Function to add a new POC section
  const addNewPocSection = () => {
    setPocSections([
      ...pocSections,
      { id: pocSections.length + 1, Name: '', designation: '', email: '', phone: '', department: "" },
    ]);
  };

  const handleChangeDCR = (event) => {
    setClientType(event.target.id);
  };
  // Handle input field changes dynamically
  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    setPocSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const fetchdepartmentData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getdepartment");
      setDepartmentData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchdepartmentData();
  }, []);

  useEffect(() => {
    const storedCounter = localStorage.getItem("clientCounter");
    if (storedCounter) {
      setCounter(parseInt(storedCounter, 10));
    }
  }, []);
  useEffect(() => {
    if (companyName) {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
      setClientID(`CEDWEN${currentYear}${currentMonth}${counter}`);
    }
  }, [companyName, counter])

  const handleRemovePoc = (id) => {
    const updatePocSection = pocSections.filter(section => section.id !== id);
    setPocSections(updatePocSection);
  }
  return (
    <div>
      <Sidebar />
      <main className="ml-60  flex-1 p-5 ">
        <Header name="New Order" />

        <section className="border  rounded-xl mt-5">
          <form onSubmit={handleFormSubmit}>
            <div className='px-5 py-3 text-sm max-xl:text-xs font-medium'>
              <h1 className='text-[#2A467A] font-semibold'>Client Type</h1>
              <div className='flex gap-5 pt-1'>
                <div className='flex justify-center items-center gap-1'>
                  <input type="radio"
                    id="New Client"
                    name="clientType"
                    onChange={handleChangeDCR}

                  />
                  <label className='font-normal' for="New Client">New Client</label>
                </div>

                <div className='flex justify-center items-center gap-1 '>
                  <input type="radio"
                    id="Existing Client"
                    name="clientType"
                    onChange={handleChangeDCR}
                    defaultChecked
                  />
                  <label className='font-normal' for="Existing Client">Existing Client</label>
                </div>
              </div>
            </div>
            {/* New client master form */}
            {clientType === "New Client" && (
              <form className="flex flex-col gap-5 max-h-screen px-4 py-4 max-xl:py-2 bg-[#E8E8E8]">
                <div className="grid grid-cols-5  max-xl:grid-cols-4 gap-x-6 max-xl:gap-x-3 gap-y-4 max-xl:gap-y-2">
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Client Name
                    </label>
                    <input
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      value={companyName}
                      placeholder="Simploona Technosoft"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Client ID
                    </label>
                    <input
                      onChange={(e) => setClientID(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      value={clientID}
                      placeholder="Generated Client ID"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Concern Person Name
                    </label>
                    <input
                      onChange={(e) => setFullName(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      // value={concernPerson}
                      value={fullName}
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Email ID
                    </label>
                    <input
                      onChange={(e) => setEmailId(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="email"
                      // required
                      value={emailId}
                      placeholder="info@simploona.com"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Phone No
                    </label>
                    <input
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="tel"
                      // required
                      value={phoneNumber}
                      placeholder="8460251074"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      GST No.
                    </label>
                    <input
                      onChange={(e) => setGstNO(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      value={gstNO}
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Address Line 1
                    </label>
                    <input
                      onChange={(e) => setAddress1(e.target.value)}
                      className="border  text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      value={address1}
                      placeholder="E426, Ganesh Glory 11, Nr. BSNL office, Jagatpur Road"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Address Line 2
                    </label>
                    <input
                      onChange={(e) => setAddress2(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      value={address2}
                      placeholder="E426, Ganesh Glory 11, Nr. BSNL office, Jagatpur Road"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      City
                    </label>
                    <input
                      onChange={(e) => setCity(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      value={city}
                      placeholder="Ahmedabad"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      State
                    </label>
                    <input
                      onChange={(e) => setState(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="text"
                      // required
                      value={state}
                      placeholder="Gujarat"
                    />
                  </div>

                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      Pincode
                    </label>
                    <input
                      onChange={(e) => setPincode(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="select"
                      // required
                      value={pincode}
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">
                      PAN
                    </label>
                    <input
                      onChange={(e) => setPAN(e.target.value)}
                      className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                      type="select"
                      // required
                      value={PAN}
                      placeholder="PAN Number"
                    />
                  </div>
                  <div>
                    <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs" for="created-by">Created By</label>
                    <select value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} className="border text-[#A1A7C4] px-3 py-[0.28rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]" name="pets" id="pet-select">
                      <option>--Select Option--</option>
                      {jobRole === "Super Admin" || jobRole === "Admin" ? (
                        admindata.map((user, index) => (
                          <option key={index} value={user}>
                            {user}
                          </option>
                        ))) : (
                        <option value={userName}>{userName}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <h3 className="text-[#2A467A] text-base max-xl:text-sm font-semibold">POC Details</h3>
                  <div className="flex flex-col gap-4">
                    {pocSections.map((section) => (
                      <div key={section.id} className="flex gap-4">
                        {/* Full Name Input */}
                        <div className="w-full">
                          <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">Full Name</label>
                          <input
                            type="text"
                            value={section.Name}
                            onChange={(e) => handleInputChange(e, section.id, 'Name')}
                            placeholder="Enter Full Name"
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                          />
                        </div>
                        {/* Email Input */}
                        <div className="w-full">
                          <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">Email ID</label>
                          <input
                            type="text"
                            value={section.email}
                            onChange={(e) => handleInputChange(e, section.id, 'email')}
                            placeholder="Enter Email id"
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                          />
                        </div>
                        {/* Phone Input */}
                        <div className="w-full">
                          <label className="font-normal  max-xl:font-medium text-[#202020] text-sm max-xl:text-xs">Phone No</label>
                          <input
                            type="text"
                            value={section.phone}
                            onChange={(e) => handleInputChange(e, section.id, 'phone')}
                            placeholder="Enter Phone no"
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                          />
                        </div>
                        {/* Designation Input */}
                        <div className="w-full">
                          <label className="font-normal max-xl:font-medium text-[#202020] max-xl:text-xs text-sm">Designation</label>
                          <input
                            type="text"
                            value={section.designation}
                            onChange={(e) => handleInputChange(e, section.id, 'designation')}
                            placeholder="Enter Designation"
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                          />
                        </div>
                        {/* Department Input */}
                        <div className="w-full">
                          <label className="font-normal max-xl:font-medium text-[#202020] text-sm max-xl:text-xs" htmlFor={`department-${section.id}`}>Department</label>
                          <select value={section.department || ''}
                            id={`department-${section.id}`}
                            name="department"
                            onChange={(e) => handleInputChange(e, section.id, "department")} className="border text-[#A1A7C4] px-3 py-[0.28rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]" >
                            <option value="">--Select Department--</option>
                            {departmentData.map((department, index) => (
                              <option key={index} value={department.name}>
                                {department.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="justify-end items-end flex">
                          <i onClick={() => handleRemovePoc(section.id)} class="fa-regular fa-circle-xmark text-lg font-medium text-red-600 cursor-pointer"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addNewPocSection}
                    className="px-4 py-[0.35rem] mt-2 text-sm max-xl:text-xs font-medium border text-[#E84000] border-[#E84000] rounded-md hover:bg-[#d33900] hover:text-white"
                  >
                    Add New
                  </button>
                </div>
              </form>
            )}
            {/*Existing Client master  */}
            {clientType === "Existing Client" && (<div className="bg-[#E8E8E8] px-4 text-sm max-xl:text-xs font-normal py-8 ">
              <div>
                <label className="" htmlFor="">
                  Customer Name
                </label>
                <select
                  className="border px-2 text-sm max-xl:text-xs font-normal rounded-md ml-4 py-[0.12rem] w-[35%] h-8"
                  name="pets"
                  id="pet-select"
                  onChange={handleCustomerChange}
                >
                  <option value=""> --Select Customers-- </option>
                  {cmData.map((customer, index) => (
                    <option key={index} value={customer.companyName}>
                      {customer.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 pl-32 w-72">
                <h2 className="font-semibold text-base max-xl:text-sm text-[#E84000]">
                  {formData.ClientName}
                </h2>
                <p className="font-normal">ADDRESS:</p>
                <p className="font-medium">{selectedAddress}</p>
                <p className="font-normal">{selectedAddress1}</p>
                <p className="font-normal">
                  {pinCode}-<span>{staTe}</span>
                </p>
              </div>
              <div className="flex pl-32 items-center mt-2">
                <label className="text-sm max-xl:text-xs font-normal" htmlFor="">
                  GSTIN : {gstno}
                </label>
              </div>
            </div>)}

            {/* form */}
            <section className="grid grid-cols-3 gap-5 px-4 py-8 border-b-2">
              <div className=" flex flex-col gap-3">
                <label className="text-sm max-xl:text-xs font-normal " htmlFor="">
                  Quotation Number<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Enter Proposal Name"
                  onChange={handleGeneralChange}
                  value={formData.QuotationNumber}
                  name="QuotationNumber"
                  className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm max-xl:text-xs font-normal " htmlFor="">
                  PO Number
                </label>
                <input
                  placeholder="Enter Proposal ID"
                  onChange={handleGeneralChange}
                  value={formData.PONumber}
                  name="PONumber"
                  className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm max-xl:text-xs font-normal" htmlFor="">
                  PO Date<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="dd/mm/yy"
                  onChange={handleGeneralChange}
                  value={formData.PODate}
                  name="PODate"
                  className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                  type="date"
                />

              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm max-xl:text-xs font-normal" htmlFor="">
                  OPS Id<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Enter Proposal ID"
                  onChange={handleGeneralChange}
                  value={formData.OPSId}
                  name="OPSId"
                  className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm max-xl:text-xs font-normal" htmlFor="">
                  Sales Engineer<span className="text-red-500">*</span>
                </label>
                <select
                  className="border w-[95%] px-2 text-sm max-xl:text-xs font-normal rounded-md  py-[0.12rem]  h-8"
                  id="pet-select"
                  onChange={handleGeneralChange}
                  value={formData.SalesEngineer}
                  name="SalesEngineer"
                >
                  <option value=""> --Select Enginner-- </option>
                  {admindata.map((user, index) => (
                    <option key={index} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
              <div className="PaymentTerms flex flex-col gap-3">
                <label className="text-sm max-xl:text-xs font-normal " htmlFor="">
                  OPS Date<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="dd/mm/yy"
                  onChange={handleGeneralChange}
                  value={formData.OPSDate}
                  name="OPSDate"
                  className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                  type="date"
                />
              </div>
            </section>
            {/* table */}
            <section className="px-4 py-8 border-b-2">
              <h6 className="text-sm max-xl:text-xs font-normal">Product Table</h6>
              <div className="overflow-x-auto">
                <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
                  <thead className="bg-[#E84000] rounded-t-lg">
                    <tr>
                      <th className="px-4 text-center py-[0.35rem] text-sm max-xl:text-xs whitespace-nowrap text-white  font-medium  border-b border-gray-300 rounded-tl-lg">
                        Sr No.
                      </th>
                      <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        Product Details
                      </th>
                      <th className="px-6 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        Quantity
                      </th>
                      <th className="px-6 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        Rate
                      </th>
                      <th className="px-6 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        Total
                      </th>
                      <th className="px-6 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        CGST
                      </th>
                      <th className="px-6 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        SGST
                      </th>
                      <th className="px-6 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">
                        IGST
                      </th>
                      <th className="px-6  py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">
                        Amount
                      </th>
                      <th className="px-6  py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tr-lg"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className="border-t  border-gray-300"
                      >
                        <td className=" text-center whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300 font-medium">
                          {index + 1}
                        </td>
                        <td className="text-center whitespace-nowrap border-b border-gray-300">
                          <select
                            className="border h-8 w-full max-xl:w-60 border-gray-300 text-sm max-xl:text-xs text-[#5A607F] font-normal rounded-md px-3   "
                            id="customer"
                            onChange={(e) => HandleChange(e, index)}
                            value={row.SelectProducts}
                            name="SelectProducts"
                          >
                            <option value="">Select Products</option>
                            {productData.map((product, idx) => (
                              <option key={idx} value={product.productName}>
                                {product.productName}
                              </option>
                            ))}
                           
                          </select>
                        </td>
                        <td className="px-6  text-center border-b border-gray-300">
                          <input
                            className="border h-8 w-36  max-xl:w-24 border-gray-300 rounded-md px-3 text-end  text-sm max-xl:text-xs  focus:outline-none "
                            type="text"
                            placeholder="1.00"
                            onChange={(e) => HandleChange(e, index)}
                            value={row.Quantity}
                            name="Quantity"
                          />
                        </td>
                        <td className="px-6 text-center border-b border-gray-300">
                          <input
                            className="border h-8 w-36 border-gray-300 rounded-md px-3 text-end text-sm max-xl:text-xs focus:outline-none"
                            type="text"
                            placeholder="0.00"
                            onChange={(e) => HandleChange(e, index)}
                            value={row.Rate}
                            name="Rate"
                          />
                        </td>
                        <td className="px-6 text-center border-b border-gray-300 text-sm max-xl:text-xs">
                          {row.Rate * row.Quantity}
                        </td>
                        <td className="px-6 text-center border-b border-gray-300 text-sm max-xl:text-xs">
                          {row.CGST}%
                        </td>

                        <td className="px-6 text-center  border-b border-gray-300 text-sm max-xl:text-xs">
                          {row.SGST}%
                        </td>
                        <td className="px-6 text-center  border-b border-gray-300 text-sm max-xl:text-xs">
                          {row.SGST && row.CGST && row.SGST ? 0 : row.Tax}%
                        </td>
                        <td className="px-6 text-center  border-b border-gray-300 text-sm max-xl:text-xs">
                          {row.Amount}
                        </td>
                        {/* cross icon */}
                        <td className="px-6 text-center  border-b border-gray-300">
                          <i
                            onClick={() => handleDeleteRow(index)}
                            class="fa-regular fa-circle-xmark text-red-600  text-lg max-xl:text-base cursor-pointer"
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
              <button
                onClick={addNewRow}
                type="button"
                className="w-44 h-8 border border-[#E84000] mt-2 rounded-md text-sm max-xl:text-xs font-medium text-[#E84000]"
              >
                Add More Products
              </button>
            </section>

            <section className="text-sm max-xl:text-xs px-4 py-8 font-normal grid grid-cols-2 gap-6">
              {/* Customer Notes */}
              <div className="flex flex-col justify-end">
                <p className="mb-2 font-medium">Customer Notes</p>
                <textarea
                  value={formData.Note}
                  name="Note"
                  onChange={handleGeneralChange}
                  className="border border-gray-300 rounded-md p-2 resize-none w-full h-20 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                  placeholder="Company’s Bank Details :"
                ></textarea>
              </div>

              {/* Sub Total Section */}
              <div className="bg-[#E8E8E8] px-4 py-6 rounded-xl self-end">
                <div className="flex justify-between py-4 border-b-2 border-white font-semibold">
                  <p>Sub Total</p>
                  <p>
                    {" "}
                    ₹{" "}
                    {formData.rows
                      .map((row) => row.Rate * row.Quantity)
                      .reduce((acc, val) => acc + val, 0)}
                  </p>
                </div>
                <div className=" py-4 border-b-2 border-white">
                  <div className="flex justify-between">
                    <p>CGST</p>
                    <p>
                      ₹{" "}
                      {formData.rows
                        .map((row) => (row.Rate * row.Quantity * row.CGST) / 100)
                        .reduce((acc, val) => acc + val, 0)}
                    </p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p>SGST</p>
                    <p>
                      ₹{" "}
                      {formData.rows
                        .map((row) => (row.Rate * row.Quantity * row.SGST) / 100)
                        .reduce((acc, val) => acc + val, 0)}
                    </p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p>IGST</p>
                    <p>
                      ₹{" "}
                      {formData.rows.some((row) => row.CGST > 0 || row.SGST > 0)
                        ? 0
                        : formData.rows
                          .map((row) => (row.Rate * row.Quantity * row.Tax) / 100)
                          .reduce((acc, val) => acc + val, 0)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between font-semibold mt-1">
                  <p>Total</p>
                  <p>
                    {" "}
                    ₹ {formData.rows.reduce((acc, row) => acc + row.Amount / 1, 0)}
                  </p>
                </div>
                <div className="flex justify-between mt-1 font-normal">
                  <p>Total in Words</p>
                  <p>
                    {numberToWords(
                      Math.round(
                        formData.rows
                          .map((row) => row.Amount)
                          .reduce((acc, val) => acc + val, 0)
                      )
                    )}
                  </p>
                </div>
              </div>
            </section>
            <section>
              <div className="bg-[#E8E8E8] px-4 py-8 h-44">
                <div className="flex flex-col justify-end text-sm max-xl:text-xs font-normal">
                  <p className="mb-2 font-medium">Terms & Conditions</p>
                  <textarea
                    onChange={handleGeneralChange}
                    value={formData.Terms}
                    name="Terms"
                    className="border border-gray-300 rounded-md p-2 resize-none w-[50%] h-20 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                    placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  ></textarea>
                </div>
              </div>
            </section>

            <section>
              <div className="px-4 py-8">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-[#E84000] mb-1 text-sm max-xl:text-xs">
                      License Certificate
                    </p>
                    <textarea
                      onChange={handleGeneralChange}
                      value={formData.CertificateNote}
                      name="CertificateNote"
                      className="text-sm max-xl:text-xs border border-gray-300 rounded-lg p-3 resize-none w-full  h-24 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] placeholder-gray-500"
                      placeholder="Add a note..."
                    ></textarea>
                  </div>

                  <div className="">
                    <form onSubmit={handleFormSubmit}>
                      <p className="text-[#E84000] text-sm max-xl:text-xs mb-1">Upload Certificate</p>
                      <div className="flex items-center rounded-md border border-gray-300">
                        <input
                          id="certificatefile_input"
                          type="file"
                          name="Certificate"
                          className="hidden"
                          onChange={handleCertificateFileChange}
                        />

                        <label
                          htmlFor="certificatefile_input"
                          className="flex items-center font-medium text-white text-sm max-xl:text-xs justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                        >
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          Upload Doc
                        </label>

                        {certificatefile && (
                          <p className="mt-1 text-sm max-xl:text-xs text-gray-700 font-medium truncate">
                            {certificatefile.name}
                          </p>
                        )}
                      </div>
                    </form>

                    {message && <p className="mt-3 text-green-600">{message}</p>}

                    {uploadedFileUrl && (
                      <p className="mt-3 text-blue-600">
                        <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                          View Uploaded Certificate
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-8">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-[#E84000] mb-1 text-sm max-xl:text-xs">
                      Tax Invoice
                    </p>
                    <textarea
                      onChange={handleGeneralChange}
                      value={formData.InvoiceNote}
                      name="InvoiceNote"
                      className="text-sm max-xl:text-xs border border-gray-300 rounded-lg p-3 resize-none w-full  h-24 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] placeholder-gray-500"
                      placeholder="Add a note..."
                    ></textarea>
                  </div>

                  <div className="">
                    <p className="text-[#E84000] text-sm max-xl:text-xs mb-1">
                      Upload Invoice
                    </p>
                    <div className="flex items-center rounded-md border border-gray-300">
                      <input
                        id="invoicefile"
                        type="file"
                        name="Invoice"
                        className="hidden"
                        onChange={handleInvoiceFileChange}
                      />

                      <label
                        htmlFor="invoicefile"
                        className="flex items-center font-medium text-white text-sm max-xl:text-xs justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upload Doc
                      </label>

                     
                      {invoicefile && (
                        <p className="mt-1 text-sm max-xl:text-xs text-gray-700 font-medium truncate">
                          {invoicefile.name}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </section>
            <section className="px-4 py-8 flex justify-between text-sm max-xl:text-xs font-normal">
              <div className="flex gap-3 items-end">
                <button
                  type="submit"
                  className="w-16 h-8 bg-[#E84000] text-white rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => navigate("/proposals")}
                  className="w-16 h-8 text-[#E84000] border-[#E84000] border rounded-md"
                >
                  Cancel
                </button>
              </div>
              <div>
                <div className="flex mt-1 gap-1 font-semibold">
                  <p>Total Amount: </p>
                  <p>
                    {" "}
                    ₹ {formData.rows.reduce((acc, row) => acc + row.Amount, 0)}
                  </p>
                </div>
                <div className="flex gap-1 mt-1 font-normal">
                  <p>Total Quantity: </p>
                  <p>
                    {formData.rows
                      .map((row) => Number(row.Quantity))
                      .reduce((acc, val) => acc + val, 0)}
                  </p>
                </div>
              </div>
            </section>
          </form>
        </section>


        {addProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white border rounded-lg shadow-lg w-3/4 max-w-3xl">
              <div className="flex justify-between items-center p-5 border-b">
                <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                  {editingIndex !== null ? "Edit Product" : "New Product"}
                </h1>
                <button
                  onClick={() => setAddProduct(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              {/* form */}
              <div className="p-5">
                <form
                  onSubmit={handleaddProductSubmit}
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] text-sm max-xl:text-xs"
                      >
                        Product Name
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setProductName(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4] text-sm max-xl:text-xs font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        required
                        value={productName}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] text-sm max-xl:text-xs"
                      >
                        SKU Id
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setSkuId(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4] text-sm max-xl:text-xs font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        value={skuId}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] text-sm max-xl:text-xs"
                      >
                        Product Description
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setDescription(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4] text-sm max-xl:text-xs font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        value={description}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] text-sm max-xl:text-xs"
                      >
                        Selling Price
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4] text-sm max-xl:text-xs font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        value={sellingPrice}
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="licenseType"
                      className="font-normal text-[#202020] text-sm max-xl:text-xs"
                    >
                      License Type
                    </label>
                    <select
                      id="licenseType"
                      onChange={(e) => setLicenseType(e.target.value)}
                      className="border px-3 py-[0.35rem] text-[#A1A7C4] text-sm max-xl:text-xs font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                      value={licenseType}
                    >
                      <option value="" disabled>
                        Select License Type
                      </option>
                      <option value="Perpetual (Life-time)">
                        Perpetual (Life-time)
                      </option>
                      <option value="Subscription">Subscription</option>
                    </select>
                  </div>
                  <div className="">
                    <div className="flex items-center rounded-md border border-gray-300">
                      {/* Hidden File Input */}
                      <input
                        id="file_input"
                        type="file"
                        accept="image/*"
                        name="image"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {/* Styled Button */}
                      <label
                        htmlFor="file_input"
                        className="flex items-center font-medium text-white text-sm max-xl:text-xs justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upload Photo
                      </label>
                      {/* Helper Text */}
                      <span className="text-gray-500 ml-2 font-normal  text-sm max-xl:text-xs">
                        Upload profile photo
                      </span>
                    </div>
                    {/* Display Feedback */}
                    {file ? (
                      <p className="mt-1 text-sm max-xl:text-xs text-gray-600">
                        <strong>{file.name}</strong>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  {file && (
                    <div>
                      <img
                        src={file}
                        alt="Uploaded"
                        className="w-32 h-20 object-cover rounded border mt-2"
                      />
                    </div>
                  )}
                  <div className="mt-0 flex justify-start gap-3">
                    <button
                      type="submit"
                      className="bg-[#E84000] text-white font-medium rounded-md px-5 py-2 h-10  w-full md:w-auto hover:bg-[#d03800] transition"
                    >
                      {editingIndex !== null ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default NewOrder;
