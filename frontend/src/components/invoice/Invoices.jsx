import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import myImage from "../../images/Group 736.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
function Invoices() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTable, setActiveTable] = useState("Product Details");
    const [selectedProposal, setSelectedProposal] = useState([]);
    const [popup, setPopup] = useState(false);
    const [performanceInvoicePopup, setPerformanceInvoicePopup] = useState(false);
    const toggleSection = () => {
        setIsOpen(!isOpen);
        navigate("/invoices/new-invoice");
    };

    const toggleRow = (index) => {
        setExpandedRow((prev) => (prev === index ? null : index));
    };
    const fetchInvoiceData = async () => {
        const response = await axios.get("http://localhost:5000/api/getinvoice")
        setInvoices(response.data);
    }
    useEffect(() => {
        fetchInvoiceData();
    }, [])

    const handleEditInvoice = (id) => {
        const dataToEdit = invoices.find((invoice) => invoice._id === id);
        if (!dataToEdit) {
            console.error("Invoice not found!");
            return;
        }
        navigate("/invoices/edit-invoice", { state: { data: dataToEdit } });
    };
    const confirmDelete = (id) => {
        setDeleteIndex(id);
        setShowConfirm(true);
    }


    const handleDeleteInvoice = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/deleteinvoice/${id}`);
            setInvoices((prev) => prev.filter(user => user._id !== id));
            setShowConfirm(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
   

    const handleViewTaxInvoice = (id) => {
        const proposalToView = invoices.find((proposal) => proposal._id === id);
        if (!proposalToView) {
            console.error("Proposal not found with ID:", id);
            return;
        }
        setSelectedProposal(proposalToView);
        setPopup(true);
    }
    const closePopup = () => {
        setPopup(false);
        setPerformanceInvoicePopup(false)
    }

    const printRef = useRef(null);
    const handleDownloadPDF = async () => {
        if (!printRef.current) return;

        try {

            const style = document.createElement("style");
            style.innerHTML = `
           
          `;
            document.head.appendChild(style);

            // Generate canvas
            const canvas = await html2canvas(printRef.current, {
                scale: 4,
                useCORS: true,
                backgroundColor: "#ffffff",
                onclone: (documentClone) => {
                    const clonedElement = documentClone.getElementById("printRefId");
                    if (clonedElement) {
                        clonedElement.style.fontFamily = "Arial, sans-serif";
                        clonedElement.style.color = "black";
                        clonedElement.style.border = "1px solid #000";
                    }
                },
            });

            // Convert canvas to image
            const dataURL = canvas.toDataURL("image/png");

            // Create PDF
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(dataURL, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("OPS.pdf");
            // Remove dynamically added styles after PDF generation
            document.head.removeChild(style);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handleViewPerformenceInvoice = (id) => {
        const proposalToView = invoices.find((proposal) => proposal._id === id);
        if (!proposalToView) {
            console.error("Proposal not found with ID:", id);
            return;
        }
        setSelectedProposal(proposalToView);
        setPerformanceInvoicePopup(true);
    }

    const filtereddata = invoices.map(({ _id, __v, Certificate, Invoice, ...rest }) => ({
        ...rest,
        rows: rest.rows
            ? Array.isArray(rest.rows)
                ? rest.rows.map(item =>
                    Object.entries(item)
                        .filter(([key]) => key !== "_id")
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")
                ).join(" | ")
                : Object.entries(rest.rows)
                    .filter(([key]) => key !== "_id")
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
            : "",
        paymentrecord: rest.paymentrecord
            ? Array.isArray(rest.paymentrecord)
                ? rest.paymentrecord.map(item =>
                    Object.entries(item)
                        .filter(([key]) => key !== "_id")
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")
                ).join(" | ")
                : Object.entries(rest.paymentrecord)
                    .filter(([key]) => key !== "_id")
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
            : ""
    }));
    return (
        <div >
            <Sidebar />
            <main className="ml-60 flex flex-col flex-1 gap-4 p-5">
                <Header name="Invoices" />
                <section>
                    <div className="flex justify-end gap-3 text-sm max-xl:text-xs font-normal">
                        <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] border rounded-md transition duration-300">
                            <i className="fa-solid fa-sliders text-[#E84000]"></i> Filters
                        </button>
                        <CSVLink data={filtereddata}>
                            <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] border rounded-md transition duration-300">
                                <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i> Export
                            </button>
                        </CSVLink>
                        <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] border rounded-md transition duration-300">
                            <i className="fa-solid fa-download text-[#E84000]"></i> Invoice
                        </button>
                        <button
                            onClick={toggleSection}
                            className="flex items-center px-4 py-[0.35rem] gap-2 border rounded-md bg-[#E84000] text-white transition duration-300"
                        >
                            <i className="fa-solid fa-circle-plus"></i>
                            {isOpen ? "Close Form" : "Generate New Invoice"}
                        </button>
                    </div>
                </section>
                {/* Table Section */}
                <section>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border rounded-lg shadow-sm border-separate border-spacing-0">
                            <thead className="bg-[#E84000] rounded-t-lg text-white">
                                <tr>
                                    <th className="py-[0.35rem] w-10 px-2 text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                                    <th className="py-[0.35rem] w-10 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Sr. No.</th>
                                    <th className="py-[0.35rem] px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Invoice Id</th>
                                    <th className="py-[0.35rem] px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Invoice Name</th>
                                    <th className="py-[0.35rem] px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Client Name</th>
                                    <th className="py-[0.35rem] w-40 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Total Amount</th>
                                    <th className="py-[0.35rem] w-40 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Remaining Amount</th>
                                    <th className="py-[0.35rem] w-32 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Tax Invoice</th>
                                    <th className="py-[0.35rem] w-32 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Proforma Invoice</th>
                                    <th className="py-[0.35rem] w-44 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300">Status</th>
                                    <th className="py-[0.35rem] w-20 px-2 text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(invoices) && invoices.length > 0 ? (
                                    invoices.map((invoice, index) => {
                                        return (
                                            <>
                                                <tr className="border-t leading-3  hover:bg-[#FFF5F2] border-gray-300">
                                                    <td
                                                        onClick={() => toggleRow(index)}
                                                        className="px-2 whitespace-nowrap cursor-pointer py-[0.35rem] text-center border-b border-gray-300"
                                                    >
                                                        <i
                                                            className={`fa-solid fa-angle-right text-base max-xl:text-sm transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                                                                }`}
                                                        ></i>
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        {invoice.invoice_id}
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        {invoice.ClientName}
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        {invoice.ClientName}
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        <i class="fa-solid fa-indian-rupee-sign"></i>{" "}{invoice.rows.map(amount => amount.Amount)}
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        <i class="fa-solid fa-indian-rupee-sign"></i>{" "} {
                                                            invoice.paymentrecord && invoice.paymentrecord.length > 0
                                                                ? invoice.paymentrecord[invoice.paymentrecord.length - 1].remainingAmount
                                                                : 0
                                                        }
                                                    </td>
                                                    <td onClick={() => handleViewTaxInvoice(invoice._id)} className="py-[0.35rem] px-2 whitespace-nowrap cursor-pointer text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        <i class="fa-regular fa-eye"></i>
                                                    </td>
                                                    <td onClick={() => handleViewPerformenceInvoice(invoice._id)} className="py-[0.35rem] px-2 cursor-pointer whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        <i class="fa-regular fa-eye"></i>
                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        <button className={`px-4 py-1 whitespace-nowrap rounded-full text-white ${invoice.Status === "In Progress"
                                                            ? "bg-yellow-500"
                                                            : invoice.Status === "Won"
                                                                ? "bg-green-500"
                                                                : invoice.Status === "Lost"
                                                                    ? "bg-red-500"
                                                                    : invoice.Status === "Existing Lead"
                                                                        ? "bg-blue-700"
                                                                        : invoice.Status === "New Lead"
                                                                            ? "bg-purple-600"
                                                                            : "bg-gray-500"
                                                            }`}>
                                                            {invoice.Status}
                                                        </button>

                                                    </td>
                                                    <td className="py-[0.35rem] px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] text-center border-b border-gray-300">
                                                        <button onClick={() => handleEditInvoice(invoice._id)}>
                                                            <i className="fa-solid fa-pen-to-square cursor-pointer mr-3"></i>
                                                        </button>

                                                        <button onClick={(e) => {
                                                            e.stopPropagation();

                                                            confirmDelete(invoice._id);
                                                        }}>
                                                            <i className="fa-regular fa-trash-can cursor-pointer"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                {showConfirm && (
                                                    <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                                                        <div className="bg-white p-6 rounded shadow-lg">
                                                            <p className="mb-4">
                                                                Are you sure you want to delete this Invoice?
                                                            </p>
                                                            <div className="flex  justify-stretch gap-4">
                                                                <button
                                                                    className="px-4 py-2 w-full bg-gray-300 rounded"
                                                                    onClick={() => setShowConfirm(false)}
                                                                >
                                                                    No
                                                                </button>
                                                                <button
                                                                    className="px-4 py-2 w-full bg-[#E84000] text-white rounded"
                                                                    onClick={() => handleDeleteInvoice(deleteIndex)}
                                                                >
                                                                    Yes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {expandedRow === index && (
                                                    <tr>
                                                        <td colSpan="11" className="bg-gray-100 text-sm max-xl:text-xs text-[#5A607F] px-4 py-2">
                                                            <button onClick={() => setActiveTable("Product Details")} className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "Product Details" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                                                }`}>
                                                                Product Details
                                                            </button>
                                                            <button onClick={() => setActiveTable("Record Payment")} className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "Record Payment" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                                                }`}>
                                                                Record Payment
                                                            </button>

                                                            {/* table */}
                                                            <div className="flex flex-col gap-5 mt-5">
                                                                {activeTable === "Product Details" && (
                                                                    <>
                                                                        <div className="w-3/4 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                                                            <table className="table-auto w-full border-collapse ">
                                                                                <thead className="bg-[#848484]">
                                                                                    <tr>
                                                                                        <th className="w-16 p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Sr No
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Product & Description
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Qty
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Rate
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            CGST
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            SGST
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            IGST
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Amount
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {invoice.rows && invoice.rows.length > 0 ? (
                                                                                        invoice.rows.map((row, rowIndex) => (
                                                                                            <tr key={rowIndex} className="border-b">
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {rowIndex + 1}
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {row.SelectProducts}
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {row.Quantity}
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {row.Rate}
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {(row.CGST !== 0) ? row.CGST : 0}%
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {(row.SGST !== 0) ? row.SGST : 0}%
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {(row.CGST === 0) ? row.Tax : 0}%
                                                                                                </td>
                                                                                                <td className="p-2 border max-text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                    {row.Amount}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan="8" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                                                                                <div className="flex flex-col items-center justify-center">
                                                                                                    <img src={myImage} alt="Description" className="mb-2" />
                                                                                                    <span>No Products Details Available.</span>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div className=" mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                                                            <table className="table-auto w-full border-collapse ">
                                                                                <thead className="bg-[#848484]">
                                                                                    <tr>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Sr No
                                                                                        </th>

                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Date & Time
                                                                                        </th>

                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Amount
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>

                                                                                    <tr>
                                                                                        <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                            {invoice.qty}
                                                                                        </td>
                                                                                        <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                            dd/mm/yyyy
                                                                                        </td>
                                                                                        <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                            <i class="fa-solid fa-indian-rupee-sign"></i>{" "} {invoice.rate}
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-col gap-5 mt-5">
                                                                {activeTable === "Record Payment" && (
                                                                    <>
                                                                        <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                                                            <table className="table-auto w-full border-collapse ">
                                                                                <thead className="bg-[#848484]">
                                                                                    <tr>

                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Date & Time
                                                                                        </th>
                                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                                            Amount
                                                                                        </th>

                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {invoice.paymentrecord && invoice.paymentrecord.length > 0 ? (
                                                                                        <>
                                                                                            {invoice.paymentrecord.map((payment) => (
                                                                                                <tr>
                                                                                                    <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                        {`${payment.Date} - ${payment.Time}`}
                                                                                                    </td>
                                                                                                    <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                                        <i class="fa-solid fa-indian-rupee-sign"></i>{" "} {payment.remainingAmount}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))}

                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <tr>
                                                                                                <td colSpan="10" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                                                                                    <div className="flex flex-col items-center justify-center">
                                                                                                        <img src={myImage} alt="Description" className="mb-2" />
                                                                                                        <span>No Payment Records Available.</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </>
                                                                                    )}

                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        )
                                    })

                                ) : (
                                    <>
                                        <tr>
                                            <td colSpan="12" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                                <div className="flex flex-col items-center justify-center">
                                                    <img src={myImage} alt="Description" className="mb-2" />
                                                    <span>No Invoice Available.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>

                        </table>
                    </div>
                </section>
            </main >
            {popup && selectedProposal && (
                <>
                    <section onClick={closePopup} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">

                        <button className="bg-[#233B7C] px-4 py-1 rounded-md text-white mb-2" onClick={handleDownloadPDF}>
                            Downolad PDF
                        </button>
                        <div ref={printRef} id="printRefId" className="bg-white border  shadow-lg w-[595px] h-[842px] text-xs flex flex-col">
                            <div className="pt-5 px-5 border-b">
                                <div className="flex justify-between items-center text-[8px]">
                                    <img
                                        className="shadow-md w-36 text-center"
                                        src="../../images/logo.png"
                                        alt="logo"
                                    />
                                    <div className="w-40">
                                        <p>From</p>
                                        <h2 className="text-[#2A467A] font-medium text-[10px]">CEDWEN Technologies Pvt Ltd</h2>
                                        <p>
                                            GF-02, Sathya Residency,
                                            No 60, 3rd Cross Rd, TG Layout,
                                            Hosakerehalli, Bengaluru, Karnataka-560085
                                        </p>
                                        <p><span>GST No :</span>29AAAFD9033A1ZU</p>
                                        <p><span>PAN No :</span>AAAFD9033A</p>
                                        <h2 className="text-[10px] font-semibold text-black mt-2"><span>OPS ID :</span>{selectedProposal.OPSId}</h2>
                                    </div>
                                </div>

                                <div className="mt-2 text-center">
                                    <h1 className="text-base font-semibold text-[#233B7C] px-2 py-2">OPS</h1>
                                </div>
                            </div>

                            <section className="px-4 flex-grow flex flex-col justify-between gap-5 mt-7">
                                {/* col-1 */}
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <div className="w-36 text-[8px] font-normal ">
                                            <p>Bill To</p>
                                            <p>
                                                <span className="text-[#233B7C] font-semibold text-[10px]">
                                                    {selectedProposal.BillCompanyName}
                                                </span>{" "}
                                                <br />
                                                {selectedProposal.BillAddress}<br />
                                                {`${selectedProposal.BillCity}-${selectedProposal.BillState}`}
                                            </p>
                                            <p>Pincode-{selectedProposal.BillPincode}</p>
                                        </div>
                                        <div className="w-36 text-[8px] font-normal ">
                                            <p>Ship To</p>
                                            <p>
                                                <span className="text-[#233B7C] font-semibold text-[10px]">
                                                    {selectedProposal.ShipCompanyName}
                                                </span>{" "}
                                                <br />
                                                {selectedProposal.ShipAddress}<br />
                                                {`${selectedProposal.ShipCity}-${selectedProposal.ShipState}`}
                                            </p>
                                            <p>Pincode-{selectedProposal.ShipPincode}</p>
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-medium">
                                        <div className="con flex">
                                            <p className="box-1 border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                Quotation Number
                                            </p>
                                            <p className="box-1 border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.QuotationNumber}
                                            </p>
                                        </div>
                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                PO Number
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.PONumber}
                                            </p>
                                        </div>
                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                PO date
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal " >
                                                {selectedProposal.PODate}
                                            </p>
                                        </div>

                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                OPS Date
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.OPSDate}
                                            </p>
                                        </div>
                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                Sales Engineer
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.SalesEngineer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* table col-1 */}
                                <div className={selectedProposal.pocSections && selectedProposal.pocSections.length === 0 ? 'hidden' : <>
                                    <div className="overflow-x-auto">
                                        <div className="bg-[#2A467A] py-1 text-[8px] font-medium text-white text-center border border-separate border-spacing-0">
                                            <h1>POC  DETAILS</h1>
                                        </div>
                                        <table className="min-w-[100%] table-auto  shadow-sm border border-separate border-spacing-0">
                                            <thead className="bg-[#2A467A] text-[8px] font-medium">
                                                <tr>
                                                    <th className="px-1 w-15 py-[0.35rem] text-white   text-center border-b border-gray-300 ">
                                                        Name
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white text-center border-b border-gray-300">
                                                        Designation
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Department
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        E-Mail address
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Phone Number
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[8px] font-normal">
                                                {selectedProposal.pocSections &&
                                                    selectedProposal.pocSections.length > 0 ? (
                                                    selectedProposal.pocSections.map((pocSection, pocSectionIndex) => (
                                                        <tr key={pocSectionIndex} className="border-b">
                                                            <td className="py-1 w-15 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.Name}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.designation}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.department}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.email}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.phone}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center text-xs text-[#5A607F] py-2"
                                                        >
                                                            No POC Details Available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                }>

                                </div>
                                {/* table col-2 */}
                                <div className="">
                                    <div className="overflow-x-auto">
                                        <div className="bg-[#2A467A] py-1 text-[8px] font-medium text-white text-center border border-separate border-spacing-0">
                                            <h1>PURCHASE ORDER  DETAILS</h1>
                                        </div>
                                        <table className="min-w-[100%] table-auto  shadow-sm border border-separate border-spacing-0">
                                            <thead className="bg-[#2A467A] text-[8px] font-medium">
                                                <tr>
                                                    <th className="px-1 w-15 py-[0.35rem] text-white   text-center border-b border-gray-300 ">
                                                        Sr No.
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white text-center border-b border-gray-300">
                                                        Product Details
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        PO Price
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Qty
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Total Price
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        CGST
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        SGST
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        IGST
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[8px] font-normal">
                                                {selectedProposal.rows &&
                                                    selectedProposal.rows.length > 0 ? (
                                                    selectedProposal.rows.map((row, rowIndex) => (
                                                        <tr key={rowIndex} className="border-b">
                                                            <td className="py-1 w-15 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {rowIndex + 1}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.SelectProducts}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Rate}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Quantity}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Rate * row.Quantity}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {(row.CGST !== 0) ? row.CGST : 0}%
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {(row.SGST !== 0) ? row.SGST : 0}%
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {(row.CGST === 0) ? row.Tax : 0}%
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center text-sm text-[#5A607F] py-2"
                                                        >
                                                            No Order Aetails Available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* col-3 */}
                                <div className="flex justify-end space-y-4 text-[8px] mb-10">
                                    {/* Billing Summary Section */}
                                    <div className="w-48 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">Sub Total:</p>
                                            <p className="font-normal">
                                                {selectedProposal.rows
                                                    .map((row) => row.Rate * row.Quantity)
                                                    .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">CGST:</p>
                                            <p className="font-normal">
                                                ₹{" "}
                                                {selectedProposal.rows
                                                    .map((row) => (row.Rate * row.Quantity * row.CGST) / 100)
                                                    .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">SGST:</p>
                                            <p className="font-normal">
                                                ₹{" "}
                                                {selectedProposal.rows
                                                    .map((row) => (row.Rate * row.Quantity * row.SGST) / 100)
                                                    .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <p className="font-medium">IGST:</p>
                                            <p className="font-normal">
                                                {selectedProposal.rows.some((row) => row.CGST > 0 || row.SGST > 0)
                                                    ? 0
                                                    : selectedProposal.rows
                                                        .map((row) => (row.Rate * row.Quantity * row.Tax) / 100)
                                                        .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between items-center">

                                            <p className="font-bold">Total:</p>
                                            <p className="font-bold">
                                                {selectedProposal.rows.reduce(
                                                    (acc, row) => acc + row.Amount,
                                                    0
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </section>
                            <div className="mt-6 text-center text-[10px] font-medium  p-2  bg-[#2A467A] text-white">
                                www.cedwen.com | info@cedwen.com | M. 9913873796
                            </div>
                        </div>
                    </section>
                </>
            )}
            {performanceInvoicePopup && selectedProposal && (
                <>
                    <section onClick={closePopup} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">

                        <button className="bg-[#233B7C] px-4 py-1 rounded-md text-white mb-2" onClick={handleDownloadPDF}>
                            Downolad PDF
                        </button>
                        <div ref={printRef} id="printRefId" className="bg-white border  shadow-lg w-[595px] h-[842px] text-xs flex flex-col">
                            <div className="pt-5 px-5 border-b">
                                <div className="flex justify-between items-center text-[8px]">
                                    <img
                                        className="shadow-md w-36 text-center"
                                        src="../../images/logo.png"
                                        alt="logo"
                                    />
                                    <div className="w-40">
                                        <p>From</p>
                                        <h2 className="text-[#2A467A] font-medium text-[10px]">CEDWEN Technologies Pvt Ltd</h2>
                                        <p>
                                            GF-02, Sathya Residency,
                                            No 60, 3rd Cross Rd, TG Layout,
                                            Hosakerehalli, Bengaluru, Karnataka-560085
                                        </p>
                                        <p><span>GST No :</span>29AAAFD9033A1ZU</p>
                                        <p><span>PAN No :</span>AAAFD9033A</p>
                                        <h2 className="text-[10px] font-semibold text-black mt-2"><span>OPS ID :</span>{selectedProposal.OPSId}</h2>
                                    </div>
                                </div>

                                <div className="mt-2 text-center">
                                    <h1 className="text-base font-semibold text-[#233B7C] px-2 py-2">Proforma Invoice</h1>
                                </div>
                            </div>

                            <section className="px-4 flex-grow flex flex-col justify-between gap-5 mt-7">
                                {/* col-1 */}
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <div className="w-36 text-[8px] font-normal ">
                                            <p>Bill To</p>
                                            <p>
                                                <span className="text-[#233B7C] font-semibold text-[10px]">
                                                    {selectedProposal.BillCompanyName}
                                                </span>{" "}
                                                <br />
                                                {selectedProposal.BillAddress}<br />
                                                {`${selectedProposal.BillCity}-${selectedProposal.BillState}`}
                                            </p>
                                            <p>Pincode-{selectedProposal.BillPincode}</p>
                                        </div>
                                        <div className="w-36 text-[8px] font-normal ">
                                            <p>Ship To</p>
                                            <p>
                                                <span className="text-[#233B7C] font-semibold text-[10px]">
                                                    {selectedProposal.ShipCompanyName}
                                                </span>{" "}
                                                <br />
                                                {selectedProposal.ShipAddress}<br />
                                                {`${selectedProposal.ShipCity}-${selectedProposal.ShipState}`}
                                            </p>
                                            <p>Pincode-{selectedProposal.ShipPincode}</p>
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-medium">
                                        <div className="con flex">
                                            <p className="box-1 border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                Quotation Number
                                            </p>
                                            <p className="box-1 border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.QuotationNumber}
                                            </p>
                                        </div>
                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                PO Number
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.PONumber}
                                            </p>
                                        </div>
                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                PO date
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal " >
                                                {selectedProposal.PODate}
                                            </p>
                                        </div>

                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                OPS Date
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.OPSDate}
                                            </p>
                                        </div>
                                        <div className="flex ">
                                            <p className="border p-1 px-2 bg-[#2A467A] text-white w-32">
                                                Sales Engineer
                                            </p>
                                            <p className="border p-1 px-2 w-28 font-normal ">
                                                {selectedProposal.SalesEngineer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* table col-1 */}
                                <div className={selectedProposal.pocSections && selectedProposal.pocSections.length === 0 ? 'hidden' : <>
                                    <div className="overflow-x-auto">
                                        <div className="bg-[#2A467A] py-1 text-[8px] font-medium text-white text-center border border-separate border-spacing-0">
                                            <h1>POC  DETAILS</h1>
                                        </div>
                                        <table className="min-w-[100%] table-auto  shadow-sm border border-separate border-spacing-0">
                                            <thead className="bg-[#2A467A] text-[8px] font-medium">
                                                <tr>
                                                    <th className="px-1 w-15 py-[0.35rem] text-white   text-center border-b border-gray-300 ">
                                                        Name
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white text-center border-b border-gray-300">
                                                        Designation
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Department
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        E-Mail address
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Phone Number
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[8px] font-normal">
                                                {selectedProposal.pocSections &&
                                                    selectedProposal.pocSections.length > 0 ? (
                                                    selectedProposal.pocSections.map((pocSection, pocSectionIndex) => (
                                                        <tr key={pocSectionIndex} className="border-b">
                                                            <td className="py-1 w-15 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.Name}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.designation}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.department}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.email}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {pocSection.phone}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center text-xs text-[#5A607F] py-2"
                                                        >
                                                            No POC Details Available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                }>

                                </div>
                                {/* table col-2 */}
                                <div className="">
                                    <div className="overflow-x-auto">
                                        <div className="bg-[#2A467A] py-1 text-[8px] font-medium text-white text-center border border-separate border-spacing-0">
                                            <h1>PURCHASE ORDER  DETAILS</h1>
                                        </div>
                                        <table className="min-w-[100%] table-auto  shadow-sm border border-separate border-spacing-0">
                                            <thead className="bg-[#2A467A] text-[8px] font-medium">
                                                <tr>
                                                    <th className="px-1 w-15 py-[0.35rem] text-white   text-center border-b border-gray-300 ">
                                                        Sr No.
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white text-center border-b border-gray-300">
                                                        Product Details
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        PO Price
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Qty
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Total Price
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        CGST
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        SGST
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        IGST
                                                    </th>
                                                    <th className="px-1 py-[0.35rem] text-white  text-center border-b border-gray-300">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[8px] font-normal">
                                                {selectedProposal.rows &&
                                                    selectedProposal.rows.length > 0 ? (
                                                    selectedProposal.rows.map((row, rowIndex) => (
                                                        <tr key={rowIndex} className="border-b">
                                                            <td className="py-1 w-15 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {rowIndex + 1}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.SelectProducts}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Rate}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Quantity}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Rate * row.Quantity}
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {(row.CGST !== 0) ? row.CGST : 0}%
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {(row.SGST !== 0) ? row.SGST : 0}%
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {(row.CGST === 0) ? row.Tax : 0}%
                                                            </td>
                                                            <td className="py-1 border  text-[#5A607F] border-[#E4E7EC] text-center">
                                                                {row.Amount}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center text-sm text-[#5A607F] py-2"
                                                        >
                                                            No Order Aetails Available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* col-3 */}
                                <div className="flex justify-end space-y-4 text-[8px] mb-10">
                                    {/* Billing Summary Section */}
                                    <div className="w-48 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">Sub Total:</p>
                                            <p className="font-normal">
                                                {selectedProposal.rows
                                                    .map((row) => row.Rate * row.Quantity)
                                                    .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">CGST:</p>
                                            <p className="font-normal">
                                                ₹{" "}
                                                {selectedProposal.rows
                                                    .map((row) => (row.Rate * row.Quantity * row.CGST) / 100)
                                                    .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">SGST:</p>
                                            <p className="font-normal">
                                                ₹{" "}
                                                {selectedProposal.rows
                                                    .map((row) => (row.Rate * row.Quantity * row.SGST) / 100)
                                                    .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <p className="font-medium">IGST:</p>
                                            <p className="font-normal">
                                                {selectedProposal.rows.some((row) => row.CGST > 0 || row.SGST > 0)
                                                    ? 0
                                                    : selectedProposal.rows
                                                        .map((row) => (row.Rate * row.Quantity * row.Tax) / 100)
                                                        .reduce((acc, val) => acc + val, 0)}
                                            </p>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between items-center">

                                            <p className="font-bold">Total:</p>
                                            <p className="font-bold">
                                                {selectedProposal.rows.reduce(
                                                    (acc, row) => acc + row.Amount,
                                                    0
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </section>
                            <div className="mt-6 text-center text-[10px] font-medium  p-2  bg-[#2A467A] text-white">
                                www.cedwen.com | info@cedwen.com | M. 9913873796
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div >
    );
}

export default Invoices;
