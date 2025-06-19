import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function EditWonData() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.data;
    const [Certificate, setCertificate] = useState(orderData?.Certificate || "");
    const [Invoice, setInvoice] = useState(orderData?.Invoice || "");
      const [cmData, setCmData] = useState([]);
    const [formData, setFormData] = useState({
        ClientName: orderData?.ClientName || "",
        QuotationNumber: orderData?.QuotationNumber || "",
        PONumber: orderData?.PONumber || "",
        PODate: orderData?.PODate || "",
        OPSId: orderData?.OPSId || "",
        OPSDate: orderData?.OPSDate || "",
        SalesEngineer: orderData?.SalesEngineer || "",
        rows: orderData?.rows || [],
        Note: orderData?.Note || "",
        Terms: orderData?.Terms || "",
        CertificateNote: orderData?.CertificateNote || "",
        InvoiceNote: orderData?.InvoiceNote || "",
        Invoice: orderData?.Invoice || "",
        Certificate: orderData?.Certificate || "",
    });
  
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

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: files[0],
            }));
        }
    };

    const handleInvoiceFileChange = (e) => {
        setInvoice(e.target.files[0]);
    };
    const handleCertificateFileChange = (e) => {
        setCertificate(e.target.files[0]);
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const id = orderData?._id;
        const formDataObj = new FormData();

        formDataObj.append("InvoiceNote", formData.InvoiceNote);
        formDataObj.append("CertificateNote", formData.CertificateNote);


        if (Invoice) {
            formDataObj.append("Invoice", Invoice);
        }
        if (Certificate) {
            formDataObj.append("Certificate", Certificate);
        }
        try {
            await axios.put(
                `http://localhost:5000/api/updatewonData/${id}`,
                formDataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            );
          
            toast.success("Proposal Edit Successfully...", { autoClose: 2000 });
            navigate("/orders");
        } catch (error) {
            console.error("Error updating data:", error);
        }
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
    
    return (
        <div>
            <Sidebar />
            <main className="ml-60 flex-1 p-5 ">
                <Header name="Edit Won Order" />
                <section className="border  rounded-xl mt-5">
                    <form onSubmit={handleFormSubmit}>
                        <div className="bg-[#E8E8E8] px-4 text-sm max-xl:text-xs font-normal py-8 rounded-t-xl">
                            <div className="">
                                <h2 className="text-base max-xl:text-sm font-semibold text-gray-700">
                                    Customer Name:{" "}
                                    <span className="font-normal text-sm text-gray-900">
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
                        <section className="grid grid-cols-3 gap-5 px-4 py-8 border-b-2">
                            <div className=" flex flex-col gap-3">
                                <label className="text-sm max-xl:text-xs font-normal " htmlFor="">
                                    Quotation Number<span className="text-red-500">*</span>
                                </label>
                                <input
                                    placeholder="Enter Proposal Name"
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

                                    value={formData.PODate}
                                    name="PODate"
                                    className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                                    type="text"
                                />

                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm max-xl:text-xs font-normal" htmlFor="">
                                    OPS Id<span className="text-red-500">*</span>
                                </label>
                                <input
                                    placeholder="Enter Proposal ID"

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
                                <input
                                    value={formData.SalesEngineer}
                                    name="SalesEngineer"
                                    className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                                    type="text"
                                />
                            </div>
                            <div className="PaymentTerms flex flex-col gap-3">
                                <label className="text-sm max-xl:text-xs font-normal " htmlFor="">
                                    OPS Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    placeholder="dd/mm/yy"

                                    value={formData.OPSDate}
                                    name="OPSDate"
                                    className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-1 w-[95%] h-8"
                                    type="text"
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
                                            <th className="px-4 text-center py-[0.35rem] text-white max-xl:text-xs text-sm font-medium  border-b border-gray-300 rounded-tl-lg">
                                                Sr No.
                                            </th>
                                            <th className="px-2 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                Product Details
                                            </th>
                                            <th className="px-6 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                Rate
                                            </th>
                                            <th className="px-6 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                Total
                                            </th>
                                            <th className="px-6 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                CGST
                                            </th>
                                            <th className="px-6 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                SGST
                                            </th>
                                            <th className="px-6 py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300">
                                                IGST
                                            </th>
                                            <th className="px-6  py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300 ">
                                                Amount
                                            </th>
                                            <th className="px-6  py-[0.35rem] text-white max-xl:text-xs text-sm font-medium text-center border-b border-gray-300 rounded-tr-lg"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {formData.rows.map((row, index) => (
                                            <tr
                                                key={row.id || index}
                                                className="border-t  border-gray-300"
                                            >
                                                <td className=" text-center text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="text-center border-b border-gray-300">
                                                    <input
                                                        className="border h-8 w-72 border-gray-300 rounded-md px-3 text-end  text-sm max-xl:text-xs focus:outline-none "
                                                        type="text"
                                                        placeholder="1.00"

                                                        value={row.SelectProducts}
                                                        name="SelectProducts"
                                                    />
                                                </td>
                                                <td className="px-6 text-center border-b border-gray-300">
                                                    <input
                                                        className="border h-8 w-36 border-gray-300 rounded-md px-3 text-end  text-sm max-xl:text-xs focus:outline-none "
                                                        type="text"
                                                        placeholder="1.00"

                                                        value={row.Quantity}
                                                        name="Quantity"
                                                    />
                                                </td>
                                                <td className="px-6 text-center border-b border-gray-300">
                                                    <input
                                                        className="border h-8 w-36 border-gray-300 rounded-md px-3 text-end text-sm max-xl:text-xs focus:outline-none"
                                                        type="text"
                                                        placeholder="0.00"

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
                                                        // onClick={() => handleDeleteRow(index)}
                                                        class="fa-regular fa-circle-xmark text-red-600  text-lg max-xl:text-base cursor-pointer"
                                                    ></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </section>

                        <section className="text-sm max-xl:text-xs px-4 py-8 font-normal grid grid-cols-2 gap-6">
                            {/* Customer Notes */}
                            <div className="flex flex-col justify-end">
                                <p className="mb-2 font-medium">Customer Notes</p>
                                <textarea
                                    // onChange={handleGeneralChange}
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
                        <section>
                            <div className="bg-[#E8E8E8] px-4 py-8 h-44">
                                <div className="flex flex-col justify-end text-sm max-xl:text-xs font-normal">
                                    <p className="mb-2 font-medium">Terms & Conditions</p>
                                    <textarea

                                        name="Terms"
                                        value={formData.Terms}
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
                                        <p className="text-[#E84000] text-sm max-xl:text-xs mb-1">
                                            Upload Certificate
                                        </p>
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
                                                className="flex items-center font-medium text-white max-xl:w-80 text-sm max-xl:text-xs justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                                            >
                                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                                Upload Doc
                                            </label>

                                          
                                            
                                            {Certificate.name ? (
                                                <p className="mt-1 text-sm max-xl:text-xs text-gray-700 font-medium truncate">
                                                    {Certificate.name}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-sm max-xl:text-xs text-gray-700 font-medium truncate">
                                                    {orderData?.Certificate}
                                                </p>
                                            )}

                                        </div>
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
                                                className="flex items-center font-medium text-white text-sm max-xl:text-xs max-xl:w-80 justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                                            >
                                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                                Upload Doc
                                            </label>

                                        
                                            
                                            {Invoice.name ? (
                                                <p className="mt-1 text-sm max-xl:text-xs text-gray-700 font-medium truncate">
                                                    {Invoice.name}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-sm max-xl:text-xs text-gray-700 font-medium truncate">
                                                    {orderData?.Invoice}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="px-4 py-8 flex justify-between text-sm max-xl:text-xs font-normal">
                            <div className="flex gap-3 items-end">
                                <select
                                    className="h-8 border rounded-md  border-[#E84000] focus:outline-none"
                                    value={formData.Status}
                                    // onChange={handleGeneralChange}
                                    name="Status"
                                >
                                    <option className="text-[#A1A7C4]" value="">
                                        Save and send
                                    </option>
                                    <option className="text-[#A1A7C4]" value="Prospect">
                                        Prospect
                                    </option>
                                    <option className="text-[#A1A7C4]" value="Proposal Sent">
                                        Proposal Sent
                                    </option>
                                    <option className="text-[#A1A7C4]" value="Negotiate">
                                        Negotiate
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
                                        ₹ {formData.rows.reduce((acc, row) => acc + row.Amount, 0)}
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
                </section>
            </main>
        </div>
    )
}

export default EditWonData