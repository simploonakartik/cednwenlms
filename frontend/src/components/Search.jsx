import React, { useEffect, useState } from 'react'
import SideBar from "../pages/Sidebar"
import Header from "../pages/Header"
import axios from "axios"
import myImage from "../images/Group 736.png";
import { CSVLink } from "react-csv";
function Search() {
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
  const [PAN, setPAN] = useState("");
  const [admindata, setAdmindata] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [department, setDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userCMdata, setUserCMdata] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(1);
  const [pocSections, setPocSections] = useState([{ id: 1, Name: '', designation: '', email: '', phone: '', department: "" }]);
  const [activeTable, setActiveTable] = useState("address");
  const [orderData, setOrderData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [filterForm, setFilterForm] = useState({})
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
  const [filters, setFilters] = useState({
    clientName: "",
    clientCode: "",
    invoiceId: "",
    orderId: "",
    opsId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cmdata");
        setUserCMdata(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getNewOrder");
      setOrderData(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchOrderData();
  }, []);
  const matchingOrders = orderData.filter(order =>
    userCMdata.some(user => user.companyName === order.ClientName)
  );

  const mergedData = [...userCMdata, ...matchingOrders];

  const filteredData = mergedData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.companyName?.toLowerCase() || "").includes(term) ||
      (item.clientID?.toLowerCase() || "").includes(term) ||
      (item.fullName?.toLowerCase() || "").includes(term) ||
      (item.emailId?.toLowerCase() || "").includes(term) ||
      (item.phoneNumber?.toString() || "").includes(term) ||
      (item.gstNO?.toLowerCase() || "").includes(term) ||
      (item.address1?.toLowerCase() || "").includes(term) ||
      (item.address2?.toLowerCase() || "").includes(term) ||
      (item.city?.toLowerCase() || "").includes(term) ||
      (item.state?.toLowerCase() || "").includes(term) ||
      (item.pincode?.toLowerCase() || "").includes(term) ||
      (item.PAN?.toLowerCase() || "").includes(term) ||
      (item.department?.toLowerCase() || "").includes(term) ||
      (item.createdBy?.toLowerCase() || "").includes(term) ||
      (item.clientID?.toLowerCase() || "").includes(term) ||
      (item.OPSId?.toLowerCase() || "").includes(term) ||
      (item.PODate?.toLowerCase() || "").includes(term) ||
      (
        Array.isArray(item.pocSections) && item.pocSections.some((section) =>
          Object.values(section).some((value) =>
            (typeof value === "string" ? value.toLowerCase() : "").includes(term)
          )
        ))
    );
  });

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filteredResults = mergedData.filter((item) => {
      return (
        (!filters.clientName || item.companyName?.toLowerCase().includes(filters.clientName.toLowerCase())) &&
        (!filters.clientCode || item.clientID?.toLowerCase().includes(filters.clientCode.toLowerCase())) &&
        (!filters.invoiceId || item.invoiceId?.toLowerCase().includes(filters.invoiceId.toLowerCase())) &&
        (!filters.orderId || item.orderId?.toLowerCase().includes(filters.orderId.toLowerCase())) &&
        (!filters.opsId || item.OPSId?.toLowerCase().includes(filters.opsId.toLowerCase()))
      );
    });

    setFilterForm(filteredResults)
    setShowTable(true);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cmdata");
        setUserCMdata(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const storedCounter = localStorage.getItem("clientCounter");
    if (storedCounter) {
      setCounter(parseInt(storedCounter, 10));
    }
  }, []);

  const handleEdit = (index) => {
    const client = userCMdata[index];
    if (client) {
      setEditingIndex(index);
      setCompanyName(client.companyName);
      setClientID(client.clientID);
      setFullName(client.fullName);
      setEmailId(client.emailId);
      setPhoneNumber(client.phoneNumber);
      setGstNO(client.gstNO);
      setAddress1(client.address1);
      setAddress2(client.address2);
      setCity(client.city);
      setState(client.state);
      setPincode(client.pincode);
      setPAN(client.PAN)
      setDepartment(client.department)
      setCreatedBy(client.createdBy)
      if (client.pocSections && client.pocSections.length > 0) {
        const formattedPocSections = client.pocSections.map((section, idx) => ({
          id: idx + 1,
          Name: section.Name || '',
          designation: section.designation || '',
          email: section.email || '',
          phone: section.phone || '',
          department: section.department || ''
        }));
        setPocSections(formattedPocSections);
      } else {
        setPocSections([{ id: 1, Name: '', designation: '', email: '', phone: '', department: "" }]);
      }
    }
  };

  const handleDelete = async (index) => {
    try {
      const id = userCMdata[index]._id;
      await axios.delete(`http://localhost:5000/api/cmdata/${id}`);
      setUserCMdata((prev) => prev.filter((_, i) => i !== index));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Calculate the current data slice
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endindex = startIndex + entriesPerPage;
  const finalFilteredData = filterForm.length > 0 ? filterForm : filteredData;
  const currentData = finalFilteredData.slice(startIndex, startIndex + entriesPerPage);


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

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
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
  // fetchadminData();
  useEffect(() => {
    fetchadminData();
  }, []);

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
    if (companyName) {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
      setClientID(`CEDWEN${currentYear}${currentMonth}${counter}`);
    }
  }, [companyName, counter])

  const handleFilterClick = () => {
    setShowFilterForm((prev) => !prev)
  }

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filtereddata = currentData.map(({ _id, __v, CertificateNote, InvoiceNote, Certificate, Invoice, ...rest }) => ({
    ...rest,
    pocSections: rest.pocSections
      ? Array.isArray(rest.pocSections)
        ? rest.pocSections.map(item =>
          Object.entries(item)
            .filter(([key]) => key !== "_id")
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        ).join(" | ")
        : Object.entries(rest.pocSections)
          .filter(([key]) => key !== "_id")
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      : ""
  }));

  return (
    <div>
      <SideBar />
      <main className="ml-60 2xl:ml-50 flex flex-col flex-1 gap-4 p-5">
        <Header name="Search" />
        <section className='flex gap-2 justify-between flex-wrap items-center'>
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-[0.3rem] rounded-full border border-gray-300 bg-[#EAF1FB] focus:outline-none "
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i className="fa-solid fa-magnifying-glass text-gray-500 "></i>
            </div>
          </div>
          <div className='flex items-end gap-3'>
            <div>
              <label className='text-sm max-xl:text-xs font-medium' htmlFor="">Start Date</label><br />
              <input className='border px-2 py-1 rounded-md border-gray-300 text-sm max-xl:text-xs' type="date" placeholder='Start Date' />
            </div>
            <div>
              <label className='text-sm max-xl:text-xs font-medium' htmlFor="">End Date</label><br />
              <input className='border px-2 py-1 rounded-md border-gray-300 text-sm max-xl:text-xs' type="date" placeholder='Start Date' />
            </div>
            <div>

              <button onClick={handleFilterClick} className='px-4 py-1 border text-sm max-xl:text-xs border-gray-300 rounded-md flex gap-2 justify-center items-center'><i class="fa-regular fa-rectangle-list text-[#E84000]"></i>Filters</button>

            </div>

            <div>
              {jobRole === "Super Admin" || jobRole === "Admin" ? (<CSVLink data={filtereddata}><button className='px-4 text-sm max-xl:text-xs py-1 border border-gray-300 rounded-md flex gap-2 justify-center items-center'> <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>Export</button> </CSVLink>) : (<></>)}
            </div>
          </div>
        </section>
        {showFilterForm && (
          <>
            <section className="px-5 text-sm max-xl:text-xs py-8 border border-gray-300 rounded-md bg-[#FFF8F5]">
              <h2 className="text-base max-xl:text-sm font-medium text-[#2A467A]">Filter</h2>

              <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-5 pt-2">
                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Client Name</label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    onChange={handleGeneralChange}
                    value={filters.clientName}
                    name="clientName"
                    placeholder="Enter Client Name"
                  />
                </div>

                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Client Code</label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    onChange={handleGeneralChange}
                    value={filters.clientCode}
                    name="clientCode"
                    placeholder="Enter Client Code"
                  />
                </div>

                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Invoice ID</label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    onChange={handleGeneralChange}
                    value={filters.invoiceId}
                    name="invoiceId"
                    placeholder="Enter Invoice ID"
                  />
                </div>

                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Order ID</label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    onChange={handleGeneralChange}
                    value={filters.orderId}
                    name="orderId"
                    placeholder="Enter Order ID"
                  />
                </div>

                <div>
                  <label className="font-normal text-[#202020] text-sm max-xl:text-xs">OPS ID</label>
                  <input
                    className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                    type="text"
                    onChange={handleGeneralChange}
                    value={filters.opsId}
                    name="opsId"
                    placeholder="Enter OPS ID"
                  />
                </div>

                <div className="flex gap-5">
                  <button type="submit" className="self-end bg-[#E84000] text-white border border-[#E84000] px-4 py-1 rounded-md">
                    Apply Filter
                  </button>
                  <button
                    type="reset"
                    onClick={() => {
                      setFilters({ clientName: "", clientCode: "", invoiceId: "", orderId: "", opsId: "" });
                      setShowTable(false);
                    }}
                    className="self-end border border-[#E84000] text-[#E84000] px-4 py-1 rounded-md"
                  >
                    Clear Filter
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
        {showTable ? (
          <section>
            <div className="overflow-x-auto">
              <table className="min-w-[100%] table-auto border rounded-lg shadow-sm border-separate border-spacing-0">
                <thead className="bg-[#E84000] rounded-t-lg ">
                  <tr>
                    <th className="w-10 px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                    <th className="w-10 px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300 ">
                      Sr No.
                    </th>
                    <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300">
                      Client Name
                    </th>
                    <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300">
                      Client Code
                    </th>
                    <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300">
                      Concern Person
                    </th>
                    <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300">
                      Email ID
                    </th>
                    <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300">
                      Created By
                    </th>
                    <th className="w-32 px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300">
                      Phone No
                    </th>


                    <th className="w-20 px-2 py-[0.35rem] text-white text-sm max-xl:text-xs  whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tr-lg"></th>
                  </tr>
                </thead>

                <tbody className="text-sm max-xl:text-xs font-normal">
                  {Array.isArray(currentData) && currentData.length > 0 ? (
                    currentData.map((user, index) => {
                      return (
                        <>
                          <tr
                            key={user._id}
                            className="border-t  leading-3 text-sm max-xl:text-xs hover:bg-[#FFF5F2] border-gray-300"
                          >
                            <td
                              onClick={() => toggleRow(index)}
                              className="leading-3  whitespace-nowrap px-2 py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F]  text-sm max-xl:text-xs border-b text-center border-gray-300 cursor-pointer"
                            >
                              <i
                                className={`fa-solid fa-angle-right text-base max-xl:text-sm transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                                  }`}
                              ></i>
                            </td>
                            <td className=" px-2 whitespace-nowrap  leading-3 text-[#5A607F] py-[0.35rem] text-sm max-xl:text-xs border-b text-center border-gray-300">
                              {startIndex + index + 1}
                            </td>
                            <td className=" px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.companyName}
                            </td>
                            <td className=" px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.clientID}
                            </td>
                            <td className=" px-2 whitespace-nowrap py-[0.35rem]  leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.fullName}
                            </td>
                            <td className=" px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.emailId}
                            </td>
                            <td className=" px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.createdBy}
                            </td>
                            <td className=" px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              {user.phoneNumber}
                            </td>
                            <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(startIndex + index);
                                  setIsOpen(true);
                                }}
                              >
                                <img
                                  className="pl-0"
                                  src="./images/edit.svg"
                                  alt="Edit"
                                  height="15"
                                  width="15"
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(startIndex + index);
                                }}
                              >
                                <img
                                  className="pl-0 ml-3"
                                  src="../images/delete.svg"
                                  alt="Delete"
                                  height="15"
                                  width="15"
                                />
                              </button>
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
                                    onClick={() => handleDelete(deleteIndex)}
                                  >
                                    Yes
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {expandedRow === index && (
                            <tr>
                              <td colSpan="10" className="p-4 border-b">
                                <button
                                  onClick={() => setActiveTable("address")}
                                  className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "address" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                    }`}
                                >
                                  Address
                                </button>
                                <button
                                  onClick={() => setActiveTable("poc")}
                                  className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "poc" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                    }`}
                                >
                                  POC Details
                                </button>
                                <button
                                  onClick={() => setActiveTable("other")}
                                  className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "other" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                    }`}
                                >
                                  Order Details
                                </button>
                                <div className="flex flex-col gap-5 mt-5">
                                  {/* First Table */}
                                  {activeTable === "address" && (
                                    <div className="w-3/4 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                      <table className="table-auto w-full border-collapse ">
                                        <thead className="bg-[#848484]">
                                          <tr>
                                            <th className="p-2 py-[0.35rem] w-[50%] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Address
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              City
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              State
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Pincode
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              GST No.
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {user.address1 || user.address2 || user.city || user.state || user.pincode || user.gstNO ? (
                                            <tr className="border-b">
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                {user.address1} {user.address2}
                                              </td>
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                {user.city}
                                              </td>
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                {user.state}
                                              </td>
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                {user.pincode}
                                              </td>
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                {user.gstNO}
                                              </td>
                                            </tr>
                                          ) : (
                                            <tr>
                                              <td colSpan="5" className="text-center text-sm max-xl:text-xs text-[#5A607F] py-5 border rounded-md">
                                                <div className="flex flex-col items-center justify-center">
                                                  <img src={myImage} alt="Description" className="mb-2" />
                                                  <span>No Address Details Available.</span>
                                                  <button onClick={() => setIsOpen(true)} className="border-blue-800 border px-2 py-[0.20rem] rounded-md text-[#2A467A] hover:bg-[#2A467A] hover:text-white mt-2 font-medium">Add Address</button>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  {/* second Table */}
                                  {activeTable === "poc" && (
                                    <div className="w-3/4 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                      <table className="table-auto w-full border-collapse ">
                                        <thead className="bg-[#848484]">
                                          <tr>
                                            <th className="w-16 p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Sr NO
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Full Name
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Designation
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Department
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Email id
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Phone No
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {user.pocSections && user.pocSections.length > 0 ? (

                                            user.pocSections.map((pocSection, index) => (
                                              <tr key={index} className="border-b">
                                                <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {index + 1}
                                                </td>
                                                <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {pocSection.Name}
                                                </td>
                                                <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {pocSection.designation}
                                                </td>
                                                <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {pocSection.department}
                                                </td>
                                                <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {pocSection.email}
                                                </td>
                                                <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {pocSection.phone}
                                                </td>
                                              </tr>))
                                          ) : (
                                            <>
                                              <tr>
                                                <td
                                                  colSpan="10"
                                                  className="text-center text-sm max-xl:text-xs text-[#5A607F] py-5 border   rounded-md"
                                                >
                                                  <div className="flex flex-col items-center justify-center">
                                                    <img src={myImage} alt="Description" className="mb-2" />
                                                    <span>No POC Details Available.</span>
                                                    <button onClick={() => setIsOpen(true)} className="border-blue-800 border px-2 py-[0.20rem] rounded-md text-[#2A467A] hover:bg-[#2A467A] hover:text-white mt-2 font-medium">Add POC</button>
                                                  </div>
                                                </td>
                                              </tr>
                                            </>)}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  {/* third Table */}
                                  {activeTable === "other" && (
                                    <div className="w-2/3 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                      <table className="table-auto w-full border-collapse text-left">
                                        <thead className="bg-[#848484]">
                                          <tr>
                                            <th className="p-2 w-16 py-[0.35rem] text-sm max-xl:text-xs font-medium  text-center border border-[#E4E7EC] text-white">
                                              Sr No
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Order ID
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Product
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Amount
                                            </th>
                                            <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              Exp Date
                                            </th>
                                            <th className="p-2 py-[0.35rem] w-[15%] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              License
                                            </th>
                                            <th className="p-2 py-[0.35rem] w-[15%] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                              invoice
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderData && orderData.length > 0 ? (
                                            orderData
                                              .filter(order => order.ClientName === user.companyName)
                                              .map((order, index) => (
                                                <tr key={index} className="border-b">
                                                  <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                    {index + 1}
                                                  </td>
                                                  <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                    {order.PODate}
                                                  </td>
                                                  <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                    {order.rows.map((row, rowIndex) => (
                                                      <div key={rowIndex}>{row.SelectProducts}</div>
                                                    ))}
                                                  </td>
                                                  <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                    {order.rows.map((row, rowIndex) => (
                                                      <div key={rowIndex}>{row.Amount}</div>
                                                    ))}
                                                  </td>
                                                  <td></td>
                                                  <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                    <button
                                                      onClick={() => order.Certificate && window.open(order.Certificate, "_blank")}

                                                      disabled={!order.Certificate}
                                                    >
                                                      <i class="fa-regular fa-eye"></i>
                                                    </button>

                                                  </td>
                                                  <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                                    <button
                                                      onClick={() => order.Invoice && window.open(order.Invoice, "_blank")}
                                                      disabled={!order.Invoice}
                                                    >
                                                      <i class="fa-regular fa-eye"></i>
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))
                                          ) : (
                                            <tr>
                                              <td colSpan="6" className="text-center text-sm max-xl:text-xs text-[#5A607F] py-5 border rounded-md">
                                                <div className="flex flex-col items-center justify-center">
                                                  <img src={myImage} alt="Description" className="mb-2" />
                                                  <span>No Order Details Available.</span>
                                                  <button
                                                    onClick={() => setIsOpen(true)}
                                                    className="border-blue-800 border px-2 py-[0.20rem] rounded-md text-[#2A467A] hover:bg-[#2A467A] hover:text-white mt-2 font-medium"
                                                  >
                                                    Add POC
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>

                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        No Client Masters Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>


            </div>
          </section>) : (<section>
            <div className='border-2 border-dashed p-10 flex flex-col justify-center items-center rounded-md'>
              <i class="fa-brands fa-searchengin text-2xl max-xl:text-xl text-gray-400"></i>
              <p className='text-gray-400 text-sm'>Search by Client Name, Client Code, Invoice ID, Order ID, OPS ID</p>
            </div>
          </section>)}

        {/* table section */}
        <section className="flex justify-between items-center  text-sm max-xl:text-xs font-normal">
          <button
            className={`px-4 py-[0.35rem] rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-[#E84000] text-white"
              }`}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="">
            <span className="text-base max-xl:text-sm font-medium">Page : </span>
            <select
              className="px-3 py-[0.35rem] border rounded-md text-sm max-xl:text-xs focus:outline-none border-[#5A607F]"
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
    </div>
  )
}

export default Search