import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import myImage from "../../images/Group 736.png";
function Order() {
  const [proposal, setProposal] = useState(null);
  const [clientMasterData, setClientMasterData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [newProposal, setNewProposal] = useState([]);
  const [newOrder, setNewOrder] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandewontabledRow, setExpandewontabledRow] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [wonData, setWonData] = useState([])
  const [data, setData] = useState()
  const [showConfirm, setShowConfirm] = useState(false);
  const [showneworderConfirm, setShowneworderConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deletewonDataIndex, setDeletewonDataIndex] = useState(null);
  const navigate = useNavigate();
  const handleSearch = () => { };
  const toggleSection = () => {
    setIsOpen(!isOpen);
    navigate("/orders/new-order");
  };

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };
  const toggleWontableRow = (index) => {
    setExpandewontabledRow((prev) => (prev === index ? null : index));
  };
  useEffect(() => {
    const storedData = localStorage.getItem("wonData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);
  const fetchData = async () => {
    try {
      const [clientResponse, productResponse, proposalResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/cmdata"),
        axios.get("http://localhost:5000/api/userdata"),
        axios.get("http://localhost:5000/api/getNewproposal"),
      ]);

      setClientMasterData(clientResponse.data);
      setProductData(productResponse.data);
      setNewProposal(proposalResponse.data);

      const WonData = proposalResponse.data.filter((proposal) => proposal.Status === "Won")
      const mergedData = WonData.map((proposal) => {
        const selectedProduct = proposal.rows.length > 0 ? proposal.rows[0].SelectProducts : null;
        const matchingClient = clientResponse.data.find((client) => client.companyName === proposal.ClientName);
        const matchingProduct = productResponse.data.find((product) => product.productName === selectedProduct);
        if (matchingClient && matchingProduct) {
          return { ...proposal, ...matchingClient, ...matchingProduct };
        }
        return null;
      }).filter((item) => item !== null);
      console.log(mergedData)
      setWonData(mergedData)
      localStorage.setItem("wonData", JSON.stringify(mergedData))
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData()
  }, [])

  const fetchNewOrderData = async () => {
    try {

      const [clientResponse, productResponse, proposalResponse, newOrderResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/cmdata"),
        axios.get("http://localhost:5000/api/userdata"),
        axios.get("http://localhost:5000/api/getNewproposal"),
        axios.get("http://localhost:5000/api/getNewOrder"),
      ]);

      setClientMasterData(clientResponse.data);
      setProductData(productResponse.data);
      setNewProposal(proposalResponse.data);
      setNewOrder(newOrderResponse.data);

      const clientMap = new Map(clientResponse.data.map((client) => [client.companyName, client]));
      const productMap = new Map(productResponse.data.map((product) => [product.productName, product]));

      const mergedData = newOrderResponse.data
        .map((order) => {
          const selectedProduct = order.rows?.length > 0 ? order.rows[0].SelectProducts : null;
          const matchingClient = clientMap.get(order.ClientName);
          const matchingProduct = selectedProduct ? productMap.get(selectedProduct) : null;

          // Only return merged data if both client and product are found
          if (matchingClient && matchingProduct) {
            return {
              ...order,
              ...matchingClient,
              ...matchingProduct,
            };
          }
          return null;
        })
        .filter((item) => item !== null); // Remove null values from merged data

      // Set the final merged data in state
      setCurrentData(mergedData);

    } catch (error) {
      // Enhanced error logging
      console.error("Error fetching data:", error.message);
      if (error.response) {
        console.error("API Response error:", error.response);
      }
    }
  };

  useEffect(() => {
    fetchNewOrderData();
  }, []);

  //wonData edit delete
  const handleDeletewon = (index) => {
    setDeletewonDataIndex(index);
    setShowConfirm(true);
  };
  const handleDeletewonData = async (index) => {
    const ToDelete = wonData[index]._id;
    const updatedData = wonData.filter(item => item._id !== ToDelete);
    localStorage.setItem("wonData", JSON.stringify(updatedData));
    setData(updatedData);
    fetchData();
    setShowConfirm(false);
  };
  const handleEditwonData = (index) => {
    if (wonData[index]) {
      const dataToEdit = wonData[index];
      navigate("/orders/edit-wondata", { state: { data: dataToEdit } });
    } else {
      console.error('No data found for this index');
    }
  };

  // new order edit delete
  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowneworderConfirm(true);
  };
  const handleDeleteorder = async (index) => {
    const idToDelete = newOrder[index]._id;
    await axios.delete(`http://localhost:5000/api/deleteOrder/${idToDelete}`)
    setShowneworderConfirm(false);
    fetchNewOrderData();
  };

  const handleEditOrder = (index) => {
    const dataToEdit = newOrder[index];
    navigate("/orders/edit-order", { state: { data: dataToEdit } });
  }

  return (
    <div className="flex ">
      <Sidebar />
      <div className="w-full flex flex-col ml-60  gap-4 p-5">
        <Header name="Total Order" />

        <section className="flex justify-end gap-4 mt-6 text-sm font-normal">
          <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
            <i className="fa-solid fa-filter  text-[#E84000]"></i>
            <input
              type="text"
              placeholder="Search Filter..."
              onChange={handleSearch}
              className="ml-2 border-none outline-none placeholder-gray-400 text-sm w-40 sm:w-60"
            />
          </div>

          <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
            <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
            {/* <CSVLink>Export</CSVLink> */}Export
          </button>

          <button
            onClick={toggleSection}
            className={`flex items-center px-4 py-[0.35rem] gap-2 rounded-md text-sm font-medium transition ${isOpen
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-[#E84000] text-white hover:bg-[#d33900]"
              }`}
          >
            <i className="fa-solid fa-circle-plus"></i>
            {isOpen ? "Close" : "Add Order"}
          </button>
        </section>
        {/* section - 1 */}
        <section className="mt-1">
          <h1 className="mx-1 my-1 font-medium text-xl">New Orders</h1>
          <div className="overflow-x-auto">
            <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
              <thead className="bg-[#E84000] rounded-t-lg">
                <tr>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                  <th className=" py-[0.35rem] text-white text-base font-medium  text-center border-b border-gray-300 ">
                    Sr No.
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    OPS Id
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Sales Engineer
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Client Name
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Concern Person
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Email Id
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300"></th>

                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300 rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currentData) && currentData.length > 0 ? (
                  currentData.map((user, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td
                          onClick={() => toggleRow(index)}
                          className="leading-3 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] text-sm border-b text-center border-gray-300 cursor-pointer"
                        >
                          <i
                            className={`fa-solid fa-angle-right text-base transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                              }`}
                          ></i>
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {index + 1}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.OPSId}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.SalesEngineer}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.ClientName}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.fullName}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.emailId}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          <button
                            onClick={() => user.Certificate && window.open(user.Certificate, "_blank")}
                            className={`${user.Certificate ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-4 mr-3 py-2 rounded-md text-white`}
                            disabled={!user.Certificate}
                          >
                            License Certificate
                          </button>

                          <button
                            onClick={() => user.Invoice && window.open(user.Invoice, "_blank")}
                            className={`${user.Invoice ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-4 py-2 rounded-md text-white`}
                            disabled={!user.Invoice}
                          >
                            Tax Invoice
                          </button>
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
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
                            colSpan="9"
                            className="bg-gray-100 text-sm  text-[#5A607F] px-4 py-2"
                          >
                            <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                              <table className="table-auto w-full border-collapse ">
                                <thead className="bg-[#848484]">
                                  <tr>
                                    <th className="p-2 py-[0.35rem] ftext-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Sr No
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Product & Description
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Qty
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Rate
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      CGST
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      SGST
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      IGST
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {user.rows && user.rows.length > 0 ? (
                                    user.rows.map((row, rowIndex) => (
                                      <tr key={rowIndex} className="border-b">
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {rowIndex + 1}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {row.SelectProducts}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {row.Quantity}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {row.Rate}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {(row.CGST !== 0) ? row.CGST : 0}%
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {(row.SGST !== 0) ? row.SGST : 0}%
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {(row.CGST === 0) ? row.Tax : 0}%
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
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
                      <td colSpan="10" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                        <div className="flex flex-col items-center justify-center">
                          <img src={myImage} alt="Description" className="mb-2" />
                          <span>No New Order Available.</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* section - 2 */}
        <section className="mt-1">
          <h1 className="mx-1 my-1 font-medium text-xl">Won Orders</h1>
          <div className="overflow-x-auto">
            <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
              <thead className="bg-[#E84000] rounded-t-lg">
                <tr>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                  <th className=" py-[0.35rem] text-white text-base font-medium  text-center border-b border-gray-300 ">
                    Sr No.
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    OPS Id
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Sales Engineer
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Client Name
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Concern Person
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300">
                    Email Id
                  </th>
                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300"></th>

                  <th className=" py-[0.35rem] text-white text-base font-medium text-center border-b border-gray-300 rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((user, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td
                          onClick={() => toggleWontableRow(index)}
                          className="leading-3 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] text-sm border-b text-center border-gray-300 cursor-pointer"
                        >
                          <i
                            className={`fa-solid fa-angle-right text-base transition-transform duration-300 ${expandewontabledRow === index ? "rotate-90" : ""
                              }`}
                          ></i>
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {index + 1}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.OPSId}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.SalesEngineer}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.ClientName}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.fullName}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          {user.emailId}
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          <button className="bg-[#E84000] px-4 py-2 rounded-md text-white">
                            License Certificate
                          </button>
                          <button className="bg-[#cecdcd] px-4 py-2 rounded-md text-white ml-3">
                            Tax Invoice
                          </button>
                        </td>
                        <td className=" py-[0.35rem] leading-3 text-sm text-[#5A607F] border-b text-center border-gray-300">
                          <i
                            onClick={(e) => {
                              e.stopPropagation();
                              setPopup(true);
                            }}
                            className="fa-regular fa-eye cursor-pointer mr-3"
                          ></i>
                          <i
                            onClick={() => handleEditwonData(index)}
                            className="fa-regular fa-pen-to-square cursor-pointer mr-3"
                          ></i>
                          <i onClick={(e) => {
                            e.stopPropagation();
                            handleDeletewon(index);
                          }} className="fa-regular fa-trash-can cursor-pointer"></i>
                        </td>
                      </tr>
                      {showConfirm && (
                        <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                          <div className="bg-white p-6 rounded shadow-lg">
                            <p className="mb-4">
                              Are you sure you want to delete this item?
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
                                  handleDeletewonData(deletewonDataIndex)
                                }
                              >
                                Yes
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {expandewontabledRow === index && (
                        <tr>
                          <td
                            colSpan="9"
                            className="bg-gray-100 text-sm  text-[#5A607F] px-4 py-2"
                          >
                            <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                              <table className="table-auto w-full border-collapse ">
                                <thead className="bg-[#848484]">
                                  <tr>
                                    <th className="p-2 py-[0.35rem] ftext-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Sr No
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Product & Description
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Qty
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Rate
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      CGST
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      SGST
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      IGST
                                    </th>
                                    <th className="p-2 py-[0.35rem] text-base font-medium text-center border border-[#E4E7EC] text-white">
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {user.rows && user.rows.length > 0 ? (
                                    user.rows.map((row, rowIndex) => (
                                      <tr key={rowIndex} className="border-b">
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {rowIndex + 1}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {row.SelectProducts}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {row.Quantity}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {row.Rate}
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {(row.CGST !== 0) ? row.CGST : 0}%
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {(row.SGST !== 0) ? row.SGST : 0}%
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                          {(row.CGST === 0) ? row.Tax : 0}%
                                        </td>
                                        <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
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
                                        No Won details available.
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
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-[#5A607F]">
                      No proposals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {popup && (
        <>
          <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white border rounded-lg shadow-lg w-[592px] h-[842px] text-xs">
              <div className="text-end">
                <i
                  onClick={() => setPopup(false)}
                  class="fa-solid fa-xmark text-base px-2 cursor-pointer"
                ></i>
              </div>

              <div className="flex flex-col justify-center items-center p-5 border-b">
                <img
                  className="shadow-md w-48 text-center"
                  src="../../images/logo.png"
                  alt="logo"
                />
                <div className="mt-5">
                  <h1 className="text-base">Proposal</h1>
                </div>
              </div>
              <section className="px-4 flex flex-col justify-between gap-10 mt-7">
                {/* col-1 */}
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs w-48">
                      <p>To</p>
                      <p>
                        <span className="text-[#E84000] font-semibold text-sm">
                          Simploona Technosoft
                        </span>{" "}
                        E426, Ganesh Glory 11, Nr. BSNL office, Jagatpur Road,
                        Ahmedabad 382470 - Gujarat
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex ">
                      <p className="border px-3 py-[0.3rem] bg-[#E84000] text-white w-36">
                        Proposal Name
                      </p>
                      <p className="border px-3 py-[0.3rem] w-36">kartk</p>
                    </div>
                    <div className="flex ">
                      <p className="border px-3 py-[0.3rem] bg-[#E84000] text-white w-36">
                        Proposal ID
                      </p>
                      <p className="border px-3 py-[0.3rem] w-36">kartk</p>
                    </div>
                    <div className="flex ">
                      <p className="border px-3 py-[0.3rem] bg-[#E84000] text-white w-36">
                        Validity Date
                      </p>
                      <p className="border px-3 py-[0.3rem] w-36">kartk</p>
                    </div>
                  </div>
                </div>
                {/* table col-2 */}
                <div className="">
                  <div className="overflow-x-auto">
                    <table className="min-w-[100%] table-auto  shadow-sm border border-separate border-spacing-0">
                      <thead className="bg-[#E84000]">
                        <tr>
                          <th className="px-4 py-[0.35rem] text-white text-xs font-medium  text-center border-b border-gray-300 ">
                            Sr No.
                          </th>
                          <th className="px-6 py-[0.35rem] text-white text-xs font-medium text-center border-b border-gray-300">
                            Product Detail
                          </th>
                          <th className="px-6 py-[0.35rem] text-white text-xs font-medium text-center border-b border-gray-300">
                            Qty
                          </th>
                          <th className="px-6 py-[0.35rem] text-white text-xs font-medium text-center border-b border-gray-300">
                            Rate
                          </th>
                          <th className="px-6 py-[0.35rem] text-white text-xs font-medium text-center border-b border-gray-300">
                            Tax
                          </th>
                          <th className="px-6 py-[0.35rem] text-white text-xs font-medium text-center border-b border-gray-300">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 border text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                            1
                          </td>

                          <td className="p-2 border w-44 text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                            Simploona Technosoft - Product Description -
                            Perpetual (Life-Time)
                          </td>
                          <td className="p-2 border text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                            1.00
                          </td>
                          <td className="p-2 border text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                            0.00
                          </td>
                          <td className="p-2 border text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                            GST [9%]
                          </td>
                          <td className="p-2 border text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                            0.00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* col-3 */}
                <div className="flex justify-between space-y-4 ">
                  {/* Company Bank Details Section */}
                  <div>
                    <p className="font-semibold">Company Bank Details:</p>
                    <p>
                      Account Name:{" "}
                      <span className="font-medium">
                        Simploona Technosoft LLP
                      </span>
                    </p>
                    <p>
                      Bank Name:{" "}
                      <span className="font-medium">Kotak Mahindra Bank</span>
                    </p>
                    <p>
                      Account No.:{" "}
                      <span className="font-medium">1234567890</span>
                    </p>
                    <p>
                      Branch & IFSC Code:{" "}
                      <span className="font-medium">Vatva & KKBK0002568</span>
                    </p>
                  </div>

                  {/* Billing Summary Section */}
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between items-center">
                      <p>Sub Total:</p>
                      <p className="font-medium">00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>GST:</p>
                      <p className="font-medium">00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Total:</p>
                      <p className="font-medium">00</p>
                    </div>
                  </div>
                </div>
                <hr />
                {/* col-4 */}
                <div className="">
                  <h6 className="font-medium mb-1">Terms & Conditions</h6>
                  <p>
                    Enter the terms and conditions of your business to be
                    displayed in your transaction
                  </p>
                </div>
              </section>
              <div className="mt-[9.4rem] text-center p-2 rounded-b-lg bg-[#E84000] text-white">
                www.cedwen.com | info@cedwen.com | M. 9913873796
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Order;
