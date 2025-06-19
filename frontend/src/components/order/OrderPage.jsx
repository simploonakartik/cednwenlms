import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import Header from "../../pages/Header";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import myImage from "../../images/Group 736.png";
function OrderPage() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [wonorders, setWonorders] = useState([]);
    
    const [expandedRow, setExpandedRow] = useState(null);
    const [popup, setPopup] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [showNewOrderConfirm, setShowNewOrderConfirm] = useState(false);
    const [expandewontabledRow, setExpandewontabledRow] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletewonDataIndex, setDeletewonDataIndex] = useState(null);
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

    const fetchNewOrder = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getNewOrder")
            setOrders(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchNewOrder()
    }, [])

    const handleEditNewOrder = (id) => {
        const dataToEdit = orders.find((order) => order._id === id);
        if (dataToEdit) {
            navigate("/orders/edit-order", { state: { data: dataToEdit } });
        } else {
            console.error("Order not found");
        }
    };

    const handleDeleteNewOrder = async (id) => {
        setDeleteIndex(id);
        setShowNewOrderConfirm(true);
    }
    const HandleDeleteNewOrder = async (id) => {
        await axios.delete(`http://localhost:5000/api/deleteOrder/${id}`)
        setShowNewOrderConfirm(false);
        fetchNewOrder();
    }

    const fetchOPSdata = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getwonData")
            setWonorders(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchOPSdata()
    }, [])

    const handleEditwonData = (id) => {
        const dataToEdit = wonorders.find((order) => order._id === id);
        if (dataToEdit) {
            navigate("/orders/edit-wondata", { state: { data: dataToEdit } });
        } else {
            console.error("Order not found");
        }
    }
    const handleDeletewon = (id) => {
        setDeletewonDataIndex(id);
        setShowConfirm(true);
    }
    const handleDeletewonData = async (id) => {
        await axios.delete(`http://localhost:5000/api/deletewonData/${id}`)
        setShowConfirm(false);
        fetchOPSdata();
    }

    const filtereddata = orders.map(({ _id, __v,Certificate,Invoice, ...rest }) => ({
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
                <Header name="Total Order" />
                <section className="flex justify-end gap-4 mt-6 text-sm max-xl:text-xs font-normal">
                    <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] max-xl:py-[0.28rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
                        <i className="fa-solid fa-filter  text-[#E84000]"></i>
                        <input
                            type="text"
                            placeholder="Search Filter..."
                            onChange={handleSearch}
                            className="ml-2 border-none outline-none placeholder-gray-400 w-60"
                        />
                    </div>

                    <CSVLink data={filtereddata}>
                        <button className="flex items-center px-4 py-[0.35rem] max-xl:py-[0.28rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
                            <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
                            Export
                        </button>
                    </CSVLink>

                    <button
                        onClick={toggleSection}
                        className={`flex items-center px-4 py-[0.35rem] max-xl:py-[0.28rem] gap-2 rounded-md   font-medium transition ${isOpen
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
                    <h1 className="mx-1 my-1 font-medium text-xl max-xl:text-lg">New Orders</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
                            <thead className="bg-[#E84000] rounded-t-lg">
                                <tr>
                                    <th className="w-10 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2 font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                                    <th className="w-10 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium  text-center border-b border-gray-300 ">
                                        Sr No.
                                    </th>
                                    <th className="w-40 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium text-center border-b border-gray-300">
                                        OPS Id
                                    </th>
                                    <th className=" whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium text-center border-b border-gray-300">
                                        Sales Engineer
                                    </th>
                                    <th className=" whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium text-center border-b border-gray-300">
                                        Client Name
                                    </th>
                                    <th className=" whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium text-center border-b border-gray-300">
                                        Concern Person
                                    </th>
                                    <th className=" whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium text-center border-b border-gray-300">
                                        Email Id
                                    </th>
                                    <th className="w-96 whitespace-nowrap  text-white text-center border-b border-gray-300"></th>


                                    <th className="w-20 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs px-2  font-medium text-center border-b border-gray-300 rounded-tr-lg">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    orders.map((user, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td
                                                    onClick={() => toggleRow(index)}
                                                    className="leading-3 whitespace-nowrap px-2 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] text-sm max-xl:text-xs border-b text-center border-gray-300 cursor-pointer"
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
                                                <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {user.emailId}
                                                </td>
                                                <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3 max-xl:leading-none text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    <button
                                                        onClick={() => user.Certificate && window.open(user.Certificate, "_blank")}
                                                        className={`${user.Certificate ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-4 max-xl:py-[0.35rem] whitespace-nowrap mr-3 py-2 rounded-md text-white`}
                                                        disabled={!user.Certificate}
                                                    >
                                                        License Certificate
                                                    </button>
                                                    <button
                                                        onClick={() => user.Invoice && window.open(user.Invoice, "_blank")}
                                                        className={`${user.Invoice ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-4 py-2 max-xl:py-[0.35rem] whitespace-nowrap rounded-md text-white`}
                                                        disabled={!user.Invoice}
                                                    >
                                                        Tax Invoice
                                                    </button>
                                                </td>

                                                <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    <i
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPopup(true);
                                                        }}
                                                        className="fa-regular fa-eye cursor-pointer mr-3"
                                                    ></i>
                                                    <i
                                                        onClick={() => handleEditNewOrder(user._id)}
                                                        className="fa-regular fa-pen-to-square cursor-pointer mr-3"
                                                    ></i>
                                                    <i onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNewOrder(user._id);
                                                    }} className="fa-regular fa-trash-can cursor-pointer"></i>
                                                </td>
                                            </tr>
                                            {showNewOrderConfirm && (
                                                <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                                                    <div className="bg-white p-6 rounded shadow-lg">
                                                        <p className="mb-4">
                                                            Are you sure you want to delete this item?
                                                        </p>
                                                        <div className="flex  justify-stretch gap-4">
                                                            <button
                                                                className="px-4 py-2 w-full bg-gray-300 rounded"
                                                                onClick={() => setShowNewOrderConfirm(false)}
                                                            >
                                                                No
                                                            </button>
                                                            <button
                                                                className="px-4 py-2 w-full bg-[#E84000] text-white rounded"
                                                                onClick={() =>
                                                                    HandleDeleteNewOrder(deleteIndex)
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
                                                        className="bg-gray-100 text-sm max-xl:text-xs text-[#5A607F] px-4 py-2"
                                                    >
                                                        <div className="w-3/4 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                                            <table className="table-auto w-full border-collapse ">
                                                                <thead className="bg-[#848484]">
                                                                    <tr>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            Sr No
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            Product & Description
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            Qty
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            Rate
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            CGST
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            SGST
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            IGST
                                                                        </th>
                                                                        <th className="p-2 py-[0.35rem] max-xl:text-xs  text-sm font-medium text-center border border-[#E4E7EC] text-white">
                                                                            Amount
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {user.rows && user.rows.length > 0 ? (
                                                                        user.rows.map((row, rowIndex) => (
                                                                            <tr key={rowIndex} className="border-b">
                                                                                <td className="w-16 p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {rowIndex + 1}
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {row.SelectProducts}
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {row.Quantity}
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {row.Rate}
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {(row.CGST !== 0) ? row.CGST : 0}%
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {(row.SGST !== 0) ? row.SGST : 0}%
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                                                    {(row.CGST === 0) ? row.Tax : 0}%
                                                                                </td>
                                                                                <td className="p-2 border max-xl:text-xs  text-sm text-[#5A607F] border-[#E4E7EC] text-center">
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
                                                    <span>No New Orders Available.</span>
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
                    <h1 className="mx-1 my-1 font-medium text-xl max-xl:text-lg">Won Orders</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
                            <thead className="bg-[#E84000] rounded-t-lg">
                                <tr>
                                    <th className="px-2 w-10 text-sm max-xl:text-xs whitespace-nowrap py-[0.35rem] text-white  font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                                    <th className="px-2 w-10 text-sm max-xl:text-xs whitespace-nowrap py-[0.35rem] text-white  font-medium  text-center border-b border-gray-300 ">
                                        Sr No.
                                    </th>
                                    <th className=" py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300">
                                        OPS Id
                                    </th>
                                    <th className=" py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300">
                                        Sales Engineer
                                    </th>
                                    <th className=" py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300">
                                        Client Name
                                    </th>
                                    <th className=" py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300">
                                        Concern Person
                                    </th>
                                    <th className=" py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300">
                                        Email Id
                                    </th>
                                    <th className="w-96 py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300"></th>

                                    <th className="w-20 py-[0.35rem] text-white px-2 text-sm max-xl:text-xs whitespace-nowrap  font-medium text-center border-b border-gray-300 rounded-tr-lg">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(wonorders) && wonorders.length > 0 ? (
                                    wonorders.map((user, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td
                                                    onClick={() => toggleWontableRow(index)}
                                                    className=" px-2 leading-3 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] whitespace-nowrap text-sm max-xl:text-xs border-b text-center border-gray-300 cursor-pointer"
                                                >
                                                    <i
                                                        className={`fa-solid fa-angle-right text-sm max-xl:text-xs transition-transform duration-300 ${expandewontabledRow === index ? "rotate-90" : ""
                                                            }`}
                                                    ></i>
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {index + 1}
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {user.OPSId}
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {user.SalesEngineer}
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {user.ClientName}
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {user.fullName}
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    {user.emailId}
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    <button
                                                        onClick={() => user.Certificate && window.open(user.Certificate, "_blank")}
                                                        className={`${user.Certificate ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-4  mr-3 py-2 max-xl:py-1 rounded-md text-white`}
                                                        disabled={!user.Certificate}
                                                    >
                                                        License Certificate
                                                    </button>

                                                    <button
                                                        onClick={() => user.Invoice && window.open(user.Invoice, "_blank")}
                                                        className={`${user.Invoice ? "bg-[#E84000]" : "bg-[#cecdcd]"} px-4  py-2 max-xl:py-1 rounded-md text-white`}
                                                        disabled={!user.Invoice}
                                                    >
                                                        Tax Invoice
                                                    </button>
                                                </td>
                                                <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                    <i
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPopup(true);
                                                        }}
                                                        className="fa-regular fa-eye cursor-pointer mr-3"
                                                    ></i>
                                                    <i
                                                        onClick={() => handleEditwonData(user._id)}
                                                        className="fa-regular fa-pen-to-square cursor-pointer mr-3"
                                                    ></i>
                                                    <i onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletewon(user._id);
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
                                                        className="bg-gray-100 text-sm max-xl:text-xs text-[#5A607F] px-4 py-2"
                                                    >
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
                                        <td colSpan="10" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                            <div className="flex flex-col items-center justify-center">
                                                <img src={myImage} alt="Description" className="mb-2" />
                                                <span>No Won Orders Available.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default OrderPage