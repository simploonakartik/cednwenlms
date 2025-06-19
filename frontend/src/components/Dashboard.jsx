import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../pages/Sidebar";
import Header from "../pages/Header";
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables, ArcElement, Tooltip } from 'chart.js';
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import myImage from "../images/Group 736.png";
function Dashboard() {
  Chart.register(...registerables, ArcElement, Tooltip);
  const navigate = useNavigate();
  const [client, setClient] = useState([]);
  const [cmData, setCmData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [newProposal, setNewProposal] = useState([]);
  const [newOrder, setNewOrder] = useState([]);
  const [wonData, setWonData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedOpsRow, setExpandedOpsRow] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showneworderConfirm, setShowneworderConfirm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [popup, setPopup] = useState(false);

  const fetchClientName = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cmdata");
      setCmData(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchClientName()
  }, [])

  const fetchOrderData = async () => {
    try {
      const [clientResponse, productResponse, proposalResponse, newOrderResponse, wondata] = await Promise.all([
        axios.get("http://localhost:5000/api/cmdata"),
        axios.get("http://localhost:5000/api/userdata"),
        axios.get("http://localhost:5000/api/getNewproposal"),
        axios.get("http://localhost:5000/api/getNewOrder"),
        axios.get("http://localhost:5000/api/getwonData")
      ]);

      setClient(clientResponse.data);
      setProductData(productResponse.data);
      setNewProposal(proposalResponse.data);
      setNewOrder(newOrderResponse.data);
      setWonData(wondata.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  const totalOrders = newOrder.length + wonData.length || 0;
  const totalProposal = newProposal.length || 0;
  const totalClient = client.length || 0;
  const totalProduct = productData.length || 0;

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };
  const toggleOPSRow = (index) => {
    setExpandedOpsRow((prev) => (prev === index ? null : index));
  };

  const handleEditOrder = (index) => {
    const dataToEdit = newOrder[index];
    navigate("/orders/edit-order", { state: { data: dataToEdit } });
  }
  // new order edit delete
  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowneworderConfirm(true);
  };

  const handleDeleteorder = async (index) => {
    const idToDelete = newOrder[index]._id;
    await axios.delete(`http://localhost:5000/api/deleteOrder/${idToDelete}`)
    setShowneworderConfirm(false);
    fetchOrderData();
  };

  const handleViewProposal = (id) => {

    const proposalToView = newProposal.find((proposal) => proposal._id === id);

    if (!proposalToView) {
      console.error("Proposal not found with ID:", id);
      return;
    }
    setSelectedProposal(proposalToView);
    setPopup(true);
  };

  const handleEditProposal = (id) => {
    const dataToEdit = newProposal.find((proposal) => proposal._id === id);
    navigate("/ops/edit-Proposal", { state: { data: dataToEdit } });
  };

  const handleDeleteProposal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteProposal/${id}`);
      // Update state locally instead of re-fetching
      setNewProposal((prev) => prev.filter((proposal) => proposal._id !== id));
      setNewProposal((prev) => prev.filter((user) => user._id !== id));
      console.log("Proposal deleted successfully.");
      setShowConfirm(false);
      setDeleteIndex(null);
    } catch (error) {
      console.error("Error deleting proposal:", error.response || error);
    }
  };

  const closePopup = () => {
    setPopup(false);
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
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Orders',
        borderColor: '#E84000',
        backgroundColor: 'rgba(232, 64, 0, 0.2)',
        fill: true,
      },
    ],
  };

  const doughnutdata = {
    labels: [
      "65% Paid", "20% Overdue", "14% Unpaid"
    ],
    datasets: [{
      label: 'Invoice Status',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(232, 64, 0)',
        'rgb(243, 159, 128)',
        'rgb(253, 236, 229)'
      ],
      hoverOffset: 4,
      cutout: '65%',
    }]

  };
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div>
      <Sidebar />
      <main className="ml-60 flex flex-col flex-1 gap-4 p-5">
        <Header name="Dashboard" />
        <div className="w-[80%] max-xl:w-[100%] mx-auto">
          <section className="flex gap-5">
            <div className="border w-80 p-4 border-[#E8E8E8] rounded-lg shadow-sm">
              <p className="text-sm max-xl:text-xs flex gap-2  items-center">
                <i class="fa-solid fa-list-ul"></i>Total Orders
              </p>
              <div className="text-base max-xl:text-sm mt-5 flex items-center gap-2">
                <p className="text-lg max-xl:text-base font-semibold">{totalOrders}</p>
                <p className="bg-green-200 xl:px-2 px-1 xl:py-[0.20rem] py-[0.17rem] rounded-md text-xs text-green-600"><i class="fa-solid fa-arrow-trend-up text-green-600"></i>{" "}+23%</p>
              </div>
            </div>
            <div className="border w-80 p-4 border-[#E8E8E8] rounded-lg shadow-sm">
              <p className="text-sm max-xl:text-xs flex gap-2 items-center">
                <i class="fa-solid fa-file-invoice"></i>Total Proposals
              </p>
              <div className="text-base max-xl:text-sm mt-5 flex items-center gap-2">
                <p className="text-lg max-xl:text-base font-semibold">{totalProposal}</p>
                <p className="bg-green-200 px-2 py-[0.20rem] rounded-md text-xs text-green-600"><i class="fa-solid fa-arrow-trend-up text-green-600"></i>{" "}+23%</p>
              </div>
            </div>
            <div className="border w-80 p-4 border-[#E8E8E8] rounded-lg shadow-sm">
              <p className="text-sm max-xl:text-xs flex gap-2 items-center">
                <i class="fa-solid fa-user"></i>Total Clients
              </p>
              <div className="text-base max-xl:text-sm mt-5 flex items-center gap-2">
                <p className="text-lg max-xl:text-base font-semibold">{totalClient}</p>
                <p className="bg-green-200 px-2 py-[0.20rem] rounded-md text-xs text-green-600"><i class="fa-solid fa-arrow-trend-up text-green-600"></i>{" "}+10%</p>
              </div>
            </div>
            <div className="border w-80 p-4 border-[#E8E8E8] rounded-lg shadow-sm">
              <p className="text-sm max-xl:text-xs flex gap-2 items-center">
                <i class="fa-solid fa-cart-shopping"></i>Total Products
              </p>
              <div className="text-base max-xl:text-sm mt-5 flex items-center gap-2">
                <p className="text-lg max-xl:text-base font-semibold"> {totalProduct}</p>
                <p className="bg-red-200 px-2 py-[0.20rem] rounded-md text-xs text-red-600"><i class="fa-solid fa-arrow-trend-down text-red-600"></i>{" "}+23%</p>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="border p-4 border-[#E8E8E8] rounded-lg shadow-sm col-span-2" >
                <div className="flex max-xl:gap-2 max-xl flex-wrap justify-between items-start mb-3">
                  <p className="flex items-center text-sm max-xl:text-xs gap-2"><i class="fa-solid fa-chart-simple"></i>Total Orders</p>
                  <div className="flex items-end gap-3">
                    <div>
                      <select className="border text-[#A1A7C4] px-1 py-[0.17rem] text-sm max-xl:text-xs rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]" name="Customer" id="Customer-select">
                        <option value="">Customer Name</option>
                        {cmData.map((user, index) => (
                          <option key={index} value={user.companyName}>
                            {user.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm max-xl:text-xs" htmlFor="">Start Date</label><br />
                      <input name="StartDate"
                        className="border px-1 text-sm max-xl:text-xs font-normal rounded-md py-[0.20rem]" type="date" placeholder="Start Date" />
                    </div>
                    <div>
                      <label className="text-sm max-xl:text-xs" htmlFor="">End Date</label><br />
                      <input name="StartDate"
                        className="border  px-1 text-sm max-xl:text-xs font-normal rounded-md py-[0.20rem]" type="date" placeholder="Start Date" />
                    </div>
                  </div>
                </div>
                <div className="w-full h-[200px]">
                  <Line data={data} options={{ maintainAspectRatio: false }} height={200} />
                </div>

              </div>
              <div className="border p-4  border-[#E8E8E8] rounded-lg shadow-sm" >
                <p className="flex items-center text-sm max-xl:text-xs gap-2 mb-3"><i class="fa-solid fa-chart-pie"></i>Invoice Statistics</p>
                <div className=":w-full h-[170px] flex flex-col items-center">
                  {/* Doughnut Chart */}
                  <Doughnut data={doughnutdata} options={options} height={250} />

                  {/* Custom Legend */}
                  <div className="mt-3 flex space-x-4">
                    {doughnutdata.labels.map((label, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: doughnutdata.datasets[0].backgroundColor[index] }}
                        ></span>
                        <span className="text-gray-700 text-sm max-xl:text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-5">
            <div className="border p-4 border-[#E8E8E8] rounded-lg shadow-sm col-span-2">
              <p className="mb-3 text-lg max-xl:text-base font-medium">Recent Orders</p>
              <div className="overflow-x-auto ">
                <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
                  <thead className="bg-[#E84000] rounded-t-lg">
                    <tr>
                      <th className="whitespace-nowrap px-2 text-center py-[0.35rem] text-white text-sm max-xl:text-xs font-medium  border-b border-gray-300 rounded-tl-lg"></th>
                      <th className="px-2 w-10 whitespace-nowrap text-center py-[0.35rem] text-white text-sm max-xl:text-xs font-medium  border-b border-gray-300 ">
                        Sr No.
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        OPS Id
                      </th>
                      <th className=" whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Sales Engineer
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Client Name
                      </th>
                      <th className=" whitespace-nowrap px-2 py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Concern Person
                      </th>
                      <th className=" whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Email Id
                      </th>
                      <th className="px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300"></th>
                      <th className=" px-2  py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tr-lg">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(newOrder.slice(-4)) && newOrder.slice(-4).length > 0 ? (
                      newOrder.slice(-4).map((user, index) => (
                        <React.Fragment key={index}>

                          <tr className="text-center">
                            <td
                              onClick={() => toggleRow(index)}
                              className="px-2  py-[0.35rem]  hover:bg-slate-300 rounded text-[#5A607F] text-sm max-xl:text-xs border-b text-center border-gray-300 cursor-pointer"
                            >
                              <i
                                className={`fa-solid fa-angle-right text-sm max-xl:text-xs transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                                  }`}
                              ></i>
                            </td>
                            <td className=" px-2 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {index + 1}
                            </td>
                            <td className="px-2 whitespace-nowrap  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.OPSId}
                            </td>
                            <td className=" px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.SalesEngineer}
                            </td>
                            <td className="px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.ClientName}
                            </td>
                            <td className="px-2 whitespace-nowrap  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.fullName}
                            </td>
                            <td className="px-2 whitespace-nowrap  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.emailId}
                            </td>
                            <td className="px-2 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              <button
                                onClick={() => user.Certificate && window.open(user.Certificate, "_blank")}
                                className={`${user.Certificate ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-2 py-1 rounded-md whitespace-nowrap text-white`}
                                disabled={!user.Certificate}
                              >
                                License Certificate
                              </button>
                              <button
                                onClick={() => user.Invoice && window.open(user.Invoice, "_blank")}
                                className={`${user.Invoice ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-2 py-1 ml-2 whitespace-nowrap rounded-md text-white`}
                                disabled={!user.Invoice}
                              >
                                Tax Invoice
                              </button>

                            </td>

                            <td className="px-2 py-[0.35rem] whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              <i
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPopup(true);
                                }}
                                className="fa-regular fa-eye cursor-pointer mr-3"
                              ></i>
                              <i
                                onClick={() => handleEditOrder(index)}
                                className="fa-regular fa-pen-to-square cursor-pointer mr-3"
                              ></i>
                              <i onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(index);
                              }} className="fa-regular fa-trash-can cursor-pointer"></i>
                            </td>
                          </tr>
                          {showneworderConfirm && (
                            <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                              <div className="bg-white p-6 rounded shadow-lg">
                                <p className="mb-4">
                                  Are you sure you want to delete this item?
                                </p>
                                <div className="flex  justify-stretch gap-4">
                                  <button
                                    className="px-4 py-2 w-full bg-gray-300 rounded"
                                    onClick={() => setShowneworderConfirm(false)}
                                  >
                                    No
                                  </button>
                                  <button
                                    className="px-4 py-2 w-full bg-[#E84000] text-white rounded"
                                    onClick={() =>
                                      handleDeleteorder(deleteIndex)
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
                                <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                  <table className="table-auto w-full border-collapse ">
                                    <thead className="bg-[#848484]">
                                      <tr>
                                        <th className="p-2 py-[0.35rem]  max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
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
                                          <td
                                            colSpan="10"
                                            className="text-center max-xl:text-xs text-sm text-[#5A607F] py-2"
                                          >
                                            No Order details available.
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
                          <td colSpan="10" className="text-center max-xl:text-xs text-sm text-[#5A607F] py-5 border rounded-md">
                            <div className="flex flex-col items-center justify-center">
                              <img src={myImage} alt="Description" className="mb-2" />
                              <span>No Recent Order Available.</span>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mt-5 text-sm">
            <div className="border p-4 border-[#E8E8E8] rounded-lg shadow-sm col-span-2">
              <p className="mb-3 max-xl:text-base text-lg font-medium">Recent OPS</p>

              <div className="overflow-x-auto">
                <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
                  <thead className="bg-[#E84000] rounded-t-lg">
                    <tr>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                      <th className="whitespace-nowrap w-10 px-1 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium  text-center border-b border-gray-300 ">
                        Sr No.
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        OPS Id
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Sales Engineer
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Client Name
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Concern Person
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Email Id
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        OPS Date
                      </th>

                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-2 py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tr-md">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(newProposal.slice(-4)) &&
                      newProposal.slice(-4).length > 0 ? (
                      newProposal.slice(-4).map((user, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td
                              onClick={() => toggleOPSRow(index)}
                              className="leading-3 px-2 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] text-sm border-b text-center border-gray-300 cursor-pointer"
                            >
                              <i
                                className={`fa-solid fa-angle-right max-xl:text-xs text-sm transition-transform duration-300 ${expandedOpsRow === index ? "rotate-90" : ""
                                  }`}
                              ></i>
                            </td>
                            <td className="whitespace-nowrap px-1 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {user.OPSId}
                            </td>
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {user.SalesEngineer}
                            </td>
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {user.ClientName}
                            </td>
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {user.fullName}
                            </td>
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {user.emailId}
                            </td>
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              {user.OPSDate}
                            </td>

                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              <button
                                className={`px-4 py-2 max-xl:py-[0.35rem] whitespace-nowrap rounded-full text-white ${user.Status === "In Progress"
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
                            <td className="whitespace-nowrap px-2 py-[0.35rem] leading-3 max-xl:text-xs text-sm text-[#5A607F] border-b text-center border-gray-300">
                              <i
                                onClick={() => handleViewProposal(user._id)}
                                className="fa-regular fa-eye cursor-pointer mr-3"
                              ></i>
                              <i
                                onClick={() => handleEditProposal(user._id)}
                                className="fa-regular fa-pen-to-square cursor-pointer mr-3"
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
                          {expandedOpsRow === index && (
                            <tr>
                              <td
                                colSpan="10"
                                className="bg-gray-100 text-sm  text-[#5A607F] px-4 py-2"
                              >
                                <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                  <table className="table-auto w-full border-collapse ">
                                    <thead className="bg-[#848484]">
                                      <tr>
                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm font-medium text-center border border-[#E4E7EC] text-white">
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
                                        <th className="p-2 py-[0.35rem] max-xl:text-xs text-sm  font-medium text-center border border-[#E4E7EC] text-white">
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
                                          <td colSpan="8" className="text-center max-xl:text-xs text-sm text-[#5A607F] py-5 border rounded-md">
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
                          <td colSpan="10" className="text-center max-xl:text-xs text-sm text-[#5A607F] py-5 border rounded-md">
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
            </div>
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
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
