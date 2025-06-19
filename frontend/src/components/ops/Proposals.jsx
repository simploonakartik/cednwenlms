import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./proposal.css"
import myImage from "../../images/Group 736.png";
import { CSVLink } from "react-csv";
function Proposals() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState(false);  
  const [newProposal, setNewProposal] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [userName, setUserName] = useState("");
  const [jobRole, setJobRole] = useState("");


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

  const toggleSection = () => {
    setIsOpen(!isOpen);
    navigate("/ops/new-Proposal");
  };

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };
  const handleEditProposal = (id) => {

    const dataToEdit = newProposal.find((proposal) => proposal._id === id);
    navigate("/ops/edit-Proposal", { state: { data: dataToEdit } });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/getNewproposal")
      setNewProposal(res.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleViewProposal = (id) => {
    const proposalToView = newProposal.find((proposal) => proposal._id === id);
    if (!proposalToView) {
      console.error("Proposal not found with ID:", id);
      return;
    }
    setSelectedProposal(proposalToView);
    setPopup(true);
  };

  const handleDeleteProposal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteProposal/${id}`);
      fetchData();
     
      setShowConfirm(false);
      setDeleteIndex(null);
    } catch (error) {
      console.error("Error deleting proposal:", error.response || error);
    }
  };

  const filteredData = newProposal.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.ProposalName?.toLowerCase() || "").includes(term) ||
      (user.companyName?.toLowerCase() || "").includes(term) ||
      (user.OPSId?.toLowerCase() || "").includes(term) ||
      (user.SalesEngineer?.toLowerCase() || "").includes(term) ||
      (user.fullName?.toLowerCase() || "").includes(term) ||
      (user.OPSDate?.toLowerCase() || "").includes(term) ||
      (user.Status?.toLowerCase() || "").includes(term) ||
      (user.emailId?.toLowerCase() || "").includes(term)
    );
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentPageData = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDelete = (id) => {
    setDeleteIndex(id);
    setShowConfirm(true);
  };

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

  const closePopup = () => {
    setPopup(false);
  }
  
  const filtereddata = currentPageData.map(({ _id, __v,CertificateNote,InvoiceNote,Certificate,Invoice, ...rest }) => ({
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
   
  }));
  return (
    <div >
      <Sidebar />
      <main className="ml-60 flex flex-col flex-1 gap-4 p-5">
        <Header name="OPS" />
        <section className="flex justify-end gap-4 mt-6 text-sm max-xl:text-xs font-normal">
          {jobRole === "Super Admin" || jobRole === "Admin" ? (
            <>
              <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] max-xl:py-[0.28rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
                <i className="fa-solid fa-filter  text-[#E84000]"></i>
                <input
                  type="text"
                  placeholder="Search Filter..."
                  onChange={handleSearch}
                  className="ml-2 border-none outline-none placeholder-gray-400  w-60 "
                />
              </div>
              <CSVLink data={filtereddata}>
                <button className="flex items-center px-4 py-[0.35rem] max-xl:py-[0.28rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
                  <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
                  Export
                </button>
              </CSVLink>
            </>
          ) : (      
            <></>
          )}

          <button
            onClick={toggleSection}
            className={`flex items-center px-4 py-[0.35rem] max-xl:py-[0.28rem] gap-2 rounded-md font-medium transition ${isOpen
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-[#E84000] text-white hover:bg-[#d33900]"
              }`}
          >
            <i className="fa-solid fa-circle-plus"></i>
            {isOpen ? "Close" : "Add OPS"}
          </button>
        </section>

        <section className="mt-1">
          <div className="overflow-x-auto">
            <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
              <thead className="bg-[#E84000] rounded-t-lg">
                <tr>
                  <th className="px-2 w-10 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                  <th className="px-2 w-10 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium  text-center border-b border-gray-300 ">
                    Sr No.
                  </th>
                  <th className="px-2 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    OPS Id
                  </th>
                  <th className="px-2 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs  font-medium text-center border-b border-gray-300">
                    Sales Engineer
                  </th>
                  <th className="px-2 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Client Name
                  </th>
                  <th className="px-2 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Concern Person
                  </th>
                  <th className="px-2 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Email Id
                  </th>
                  <th className="px-2 w-32 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    OPS Date
                  </th>
                  <th className="px-2 w-44 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Status
                  </th>
                  <th className="px-2 w-20 py-[0.35rem] whitespace-nowrap text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currentPageData) &&
                  currentPageData.length > 0 ? (
                  currentPageData.filter(user => jobRole === "Super Admin" || jobRole === "Admin" || user.createdBy === userName)
                    .map((user, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td
                            onClick={() => toggleRow(index)}
                            className="px-2 w-10 whitespace-nowrap leading-3 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] text-sm max-xl:text-xs border-b text-center border-gray-300 cursor-pointer"
                          >
                            <i
                              className={`fa-solid fa-angle-right text-sm max-xl:text-xs transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                                }`}
                            ></i>
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.OPSId}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.SalesEngineer}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.ClientName}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.fullName}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.emailId}
                          </td>
                          <td className="px-2  whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.OPSDate}
                          </td>
                          <td className="px-2  whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            <button
                              className={`px-4 max-xl:py-1 py-2 whitespace-nowrap rounded-full text-white ${user.Status === "In Progress"
                                ? "bg-yellow-500"
                                : user.Status === "Won"
                                  ? "bg-green-500"
                                  : user.Status === "Lost"
                                    ? "bg-red-500"
                                    : user.Status === "Existing Lead"
                                      ? "bg-blue-700"
                                      : user.Status === "New Lead"
                                        ? "bg-purple-600"
                                        : "bg-gray-500"
                                }`}
                            >
                              {user.Status}
                            </button>
                          </td>
                          <td className="px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            <i
                              onClick={() => handleViewProposal(user._id)}
                              className="fa-regular fa-eye cursor-pointer mr-2"
                            ></i>
                            <i
                              onClick={() => handleEditProposal(user._id)}
                              className="fa-regular fa-pen-to-square cursor-pointer mr-2"
                            ></i>
                            <i
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user._id);
                              }}
                              className="fa-regular fa-trash-can cursor-pointer"
                            ></i>
                          </td>
                        </tr>
                        {showConfirm && (
                          <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded shadow-lg">
                              <p className="mb-4">
                                Are you sure you want to delete this OPS?
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
                                  onClick={() =>
                                    handleDeleteProposal(deleteIndex)
                                  }
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {expandedRow === index && (
                          <tr>
                            <td
                              colSpan="10"
                              className="bg-gray-100 text-sm  text-[#5A607F] px-4 py-2"
                            >
                              <div className="w-3/4 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                <table className="table-auto w-full border-collapse ">
                                  <thead className="bg-[#848484]">
                                    <tr>
                                      <th className="p-2 w-16 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
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
                                    {user.rows && user.rows.length > 0 ? (
                                      user.rows.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="border-b">
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {rowIndex + 1}
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {row.SelectProducts}
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {row.Quantity}
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {row.Rate}
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {(row.CGST !== 0) ? row.CGST : 0}%
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {(row.SGST !== 0) ? row.SGST : 0}%
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {(row.CGST === 0) ? row.Tax : 0}%
                                          </td>
                                          <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                            {row.Amount}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="8" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                          <div className="flex flex-col items-center justify-center">
                                            <img src={myImage} alt="Description" className="mb-2" />
                                            <span>No Address Details Available.</span>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                ) : (
                  <>
                    <tr>
                      <td colSpan="10" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                        <div className="flex flex-col items-center justify-center">
                          <img src={myImage} alt="Description" className="mb-2" />
                          <span>No OPS Available.</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex justify-between items-center  text-sm max-xl:text-xs font-normal">
          <button
            className={`px-4 py-[0.35rem]  rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-[#E84000] text-white"
              }`}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="">
            <span className="text-sm font-medium">Page : </span>
            <select
              className="px-3 max-xl:px-1 py-[0.35rem]  border rounded-md   focus:outline-none border-[#5A607F]"
              value={entriesPerPage}
              onChange={handleEntriesChange}
            >
              {[10, 20, 30, 40, 50].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
          <button
            className={`px-4 py-[0.35rem] rounded-md ${currentPage === totalPages
              ? "bg-gray-300"
              : "bg-[#E84000] text-white"
              }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </section>
      </main>
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
    </div>
  );
}

export default Proposals;
