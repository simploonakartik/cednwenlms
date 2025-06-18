import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function EditInvoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const proposalData = location.state?.data;
  const [recordPopup, setRecordPopup] = useState(false);
  const [recordPayment, setRecordPayment] = useState(false);
  const [cmData, setCmData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [admindata, setAdmindata] = useState([])
  const currentDate = new Date().toLocaleDateString("en-GB");
  const currentTime = new Date().toLocaleTimeString();
  const [paymentrecord, setPaymentRecord] = useState([])
  const [formData, setFormData] = useState({
    ProposalName: proposalData?.ProposalName || "",
    ProposalID: proposalData?.ProposalID || "",
    ValidityDate: proposalData?.ValidityDate || "",
    PaymentTerms: proposalData?.PaymentTerms || "",
    SelectProducts: proposalData?.SelectProducts || "",
    Quantity: proposalData?.Quantity || "1",
    Rate: proposalData?.Rate || "",
    Tax: proposalData?.Tax || "18",
    Amount: proposalData?.Amount || "",
    Note: proposalData?.Note || "",
    Terms: proposalData?.Terms || "",
    ClientName: proposalData?.ClientName || "",
    rows: proposalData?.rows || [],
    Status: proposalData?.Status || [],
    paymentrecord: proposalData?.paymentrecord || [],
  });
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
      Tax: 18,
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
  const handleSearch = () => { };

  const selectedCustomer = cmData.find(
    (customer) => customer.companyName === formData.ClientName
  );

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const id = proposalData?._id;
    try {
      await axios.put(
        `http://localhost:5000/api/updateinvoice/${id}`,
        { ...formData, paymentrecord }
      );
      console.log("Data update successful");
      toast.success("Proposal Edit Successfully...", { autoClose: 2000 });
      navigate("/invoices");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  useEffect(() => {
    if (proposalData) {
      setFormData(proposalData);
    }
  }, [proposalData]);

  const HandleChange = (e, index) => {
    const { name, value } = e.target;

    setRows((prevRows) => {
      const updatedRows = prevRows.map((row, i) =>
        i === index ? { ...row, [name]: value } : row
      );

      if (name === "SelectProducts") {
        const selectedProduct = productData.find(
          (product) => product.productName === value
        );
        updatedRows[index].Rate = selectedProduct
          ? selectedProduct.sellingPrice
          : "";
      }

      // Recalculate Amount
      const Quantity = parseFloat(updatedRows[index].Quantity || 0);
      const Rate = parseFloat(updatedRows[index].Rate || 0);
      const Tax = parseFloat(updatedRows[index].Tax || 0);
      const amount = Quantity * Rate * (1 + Tax / 100) || 0;
      updatedRows[index].Amount = amount.toFixed();
      // Sync formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        rows: updatedRows,
      }));
      return updatedRows;
    });
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
  useEffect(() => {
    if (proposalData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...proposalData,
        rows: proposalData.rows?.length
          ? proposalData.rows
          : prevFormData.rows || [],
      }));
      setRows(proposalData.rows?.length ? proposalData.rows : rows);
    }
  }, [proposalData]);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
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

  useEffect(() => {
    fetchadminData();
  }, []);
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

  const RecordPayment = () => {
    setRecordPopup(true)
  }
  const handlepanymentChange = (e) => {
    setRecordPayment(Number(e.target.value) || 0);
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    const totalAmount = formData.rows.reduce(
      (acc, row) => acc + parseFloat(row.Amount || 0),
      0
    );

    const lastPaymentRecord =
      formData.paymentrecord?.[formData.paymentrecord.length - 1]?.remainingAmount;

    const newRemainingAmount =
      lastPaymentRecord !== undefined
        ? lastPaymentRecord - recordPayment
        : totalAmount - recordPayment;

    const paymentRecordEntry = {
      discount: recordPayment,
      remainingAmount: newRemainingAmount,
      Date: currentDate,
      Time: currentTime,
    };

    const updatedPaymentRecords = [...(formData.paymentrecord || []), paymentRecordEntry];

    setPaymentRecord(updatedPaymentRecords);

    // Also update the formData itself
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentrecord: updatedPaymentRecords,
    }));

    setRecordPopup(false);
  };


  return (
    <div>
      <Sidebar />
      <main className="ml-60  flex-1 p-5 ">
        <Header name="Edit Invoice" />

        <section className="border  rounded-xl mt-5">
          <form onSubmit={handleFormSubmit}>
            <div className="bg-[#E8E8E8] px-4 text-sm max-xl:text-xs font-normal py-8 rounded-t-xl">
              <div className="">
                <h2 className="text-base max-xl:text-sm font-semibold text-gray-700">
                  Customer Name:{" "}
                  <span className="font-normal text-sm max-xl:text-xs text-gray-900">
                    {formData.ClientName}
                  </span>
                </h2>

                <div className="mt-2 flex">
                  <h2 className="text-base max-xl:text-sm font-semibold text-gray-700">
                    Address:
                  </h2>
                  <p className="text-sm max-xl:text-xs px-1 w-60 text-gray-900">
                    {selectedCustomer?.address1 || ""},{" "}
                    {selectedCustomer?.address2 || ""}
                    <br />
                    {selectedCustomer?.city || ""},{" "}
                    {selectedCustomer?.state || ""} -{" "}
                    {selectedCustomer?.pincode || ""}
                  </p>
                </div>

                <h2 className="mt-2 text-base max-xl:text-sm font-semibold text-gray-700">
                  GSTIN:{" "}
                  <span className="font-normal text-sm max-xl:text-xs text-gray-900">
                    {selectedCustomer?.gstNO || ""}
                  </span>
                </h2>
              </div>
            </div>
            {/* form */}
            <section className="px-4 py-8 border-b-2">
              <h2 className="text-base max-xl:text-sm font-medium text-[#2A467A]">Bill To Address</h2>
              <div className="grid grid-cols-5 max-xl:grid-cols-3  gap-5 pt-2">
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    Company Name
                  </label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.BillCompanyName}
                    name="BillCompanyName"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    Address
                  </label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.BillAddress}
                    name="BillAddress"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    City
                  </label>
                  <input

                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.BillCity}
                    name="BillCity"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    State
                  </label>
                  <input

                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.BillState}
                    name="BillState"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    Pincode
                  </label>
                  <input

                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.BillPincode}
                    name="BillPincode"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </section>
            <section className="px-4 py-8 border-b-2">
              <h2 className="text-base max-xl:text-sm font-medium text-[#2A467A]">Ship To Address</h2>
              <div className="grid grid-cols-5 max-xl:grid-cols-3  gap-5 pt-2">
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    Company Name
                  </label>
                  <input

                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.ShipCompanyName}
                    name="ShipCompanyName"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    Address
                  </label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.ShipAddress}
                    name="ShipAddress"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    City
                  </label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.ShipCity}
                    name="ShipCity"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    State
                  </label>
                  <input

                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.ShipState}
                    name="ShipState"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                    Pincode
                  </label>
                  <input

                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    // required
                    onChange={handleGeneralChange}
                    value={formData.ShipPincode}
                    name="ShipPincode"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </section>
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
                      <th className="px-4 text-center py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium  border-b border-gray-300 rounded-tl-lg">
                        Sr No.
                      </th>
                      <th className="px-2 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Product Details
                      </th>
                      <th className="px-6 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Quantity
                      </th>
                      <th className="px-6 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Rate
                      </th>
                      <th className="px-6 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Total
                      </th>
                      <th className="px-6 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        CGST
                      </th>
                      <th className="px-6 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        SGST
                      </th>
                      <th className="px-6 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        IGST
                      </th>
                      <th className="px-6  py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 ">
                        Amount
                      </th>
                      <th className="px-6  py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tr-lg"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className="border-t  border-gray-300"
                      >
                        <td className=" text-center text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300 font-medium">
                          {index + 1}
                        </td>
                        <td className="text-center border-b border-gray-300">
                          <select
                            className="border h-8 w-full max-xl:w-52 border-gray-300 text-sm max-xl:text-xs text-[#5A607F] font-normal rounded-md px-3   "
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
                            <option
                              className="text-[#E84000] font-medium cursor-pointer"
                              value="newProduct"
                            >
                              Add Product
                            </option>
                          </select>
                        </td>
                        <td className="px-6 text-center border-b border-gray-300">
                          <input
                            className="border h-8 w-36 border-gray-300 rounded-md px-3 text-end  text-sm max-xl:text-xs focus:outline-none "
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
                className="w-32 h-8 border border-[#E84000] mt-2 rounded-md text-sm max-xl:text-xs font-medium text-[#E84000]"
              >
                Add Product
              </button>
            </section>

            <section className="text-sm max-xl:text-xs px-4 py-8 font-normal grid grid-cols-2 gap-6">
              {/* Customer Notes */}
              <div className="flex flex-col justify-end">
                <p className="mb-2 font-medium">Customer Notes</p>
                <textarea
                  onChange={handleGeneralChange}
                  name="Note"
                  value={formData.Note}
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
            <section className="relative">
              <div className="bg-[#E8E8E8] px-4 py-8 h-44 flex items-end justify-between relative">
                <div className="w-1/2">
                  <p className="mb-2 font-medium text-sm max-xl:text-xs">Terms & Conditions</p>
                  <textarea
                    onChange={handleGeneralChange}
                    name="Terms"
                    value={formData.Terms}
                    className="border border-gray-300 rounded-md p-2 resize-none w-full h-20 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                    placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                  ></textarea>
                </div>
                <button type="button" onClick={RecordPayment} className="px-4 py-[0.35rem] bg-[#E84000] rounded-md text-white text-sm max-xl:text-xs font-medium absolute bottom-4 right-4">
                  Record Payment
                </button>
              </div>
            </section>


            <section className="px-4 py-8 flex justify-between text-sm max-xl:text-xs font-normal">
              <div className="flex gap-3 items-end">
                <select
                  className="h-8 border rounded-md  border-[#E84000] focus:outline-none"
                  value={formData.Status}
                  onChange={handleGeneralChange}
                  name="Status"
                >
                  <option className="text-[#A1A7C4]" value="In Progress">
                    In Progress
                  </option>
                  <option className="text-[#A1A7C4]" value="New Lead">
                    New Lead
                  </option>
                  <option className="text-[#A1A7C4]" value="Existing Lead">
                    Existing Lead
                  </option>
                  <option className="text-[#A1A7C4]" value="Lost">
                    Lost
                  </option>
                  <option className="text-[#A1A7C4]" value="Won">
                    Won
                  </option>
                </select>
                <button
                  type="submit"
                  className="w-16 h-8 text-[#E84000] border-[#E84000] border rounded-md"
                >
                  Update
                </button>
              </div>

              <div>
                <div className="flex mt-1 gap-1 font-semibold">
                  <p>Total Amount: </p>
                  <p>
                    {" "}
                    ₹ {formData.rows.reduce((acc, row) => acc + row.Amount / 1, 0)}
                  </p>
                </div>
                <div className="flex gap-1 mt-1 font-semibold">
                  <p>Total Quantity: </p>
                  <p>
                    {" "}
                    {formData.rows
                      .map((row) => Number(row.Quantity))
                      .reduce((acc, val) => acc + val, 0)}
                  </p>
                </div>
              </div>
            </section>
          </form>
          {recordPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white border rounded-lg shadow-lg w-96  max-w-3xl">
                <form onSubmit={handlePaymentSubmit} className="px-4 py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl max-xl:text-lg font-semibold text-[#E84000]">Record Payments</h1>
                    <i onClick={() => setRecordPopup(false)} class="fa-solid fa-xmark text-xl max-xl:text-lg cursor-pointer"></i>
                  </div>
                  <div className="mt-10">
                    <input onChange={handlepanymentChange} type="text" className="border w-full rounded-md py-[0.20rem] px-1" />
                  </div>

                  <div className="text-end mt-5">
                    <button type="submit" className="border px-5 py-1 rounded-lg bg-[#E84000] text-white font-medium">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EditInvoice;
