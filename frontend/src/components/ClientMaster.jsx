import React, { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";
import axios from "axios";
import { CSVLink } from "react-csv";
import Header from "../pages/Header";
import myImage from "../images/Group 736.png";
function ClientMaster() {
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
  const [admindata, setAdmindata] = useState([])
  const [departmentData, setDepartmentData] = useState([])
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
  const [pocSections, setPocSections] = useState([]);
  const [activeTable, setActiveTable] = useState("address");
  const [orderData, setOrderData] = useState([])
  const [userName, setUserName] = useState("");
  const [jobRole, setJobRole] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const storedjobRole = localStorage.getItem("jobrole");
    if (storedjobRole) {
      setJobRole(storedjobRole);
    }
  }, []);

  // Function to add a new POC section
  const addNewPocSection = () => {
    setPocSections([
      ...pocSections,
      { id: pocSections.length + 1, Name: '', designation: '', email: '', phone: '', department: "" },
    ]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://cednwenlms.onrender.com/api/cmdata");
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      try {
        const updatedcmProduct = {
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
        };
        await axios.put(
          `https://cednwenlms.onrender.com/api/cmdata/${editingIndex}`,
          updatedcmProduct
        );
        setUserCMdata((prev) =>
          prev.map((item) =>
            item._id === editingIndex ? { ...item, ...updatedcmProduct } : item
          )
        );
        setEditingIndex(null);
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating Client Master:", error);
      }
    } else {
      try {
        const res = await axios.post("https://cednwenlms.onrender.com/api/cmdata", {
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
          pocSections
        });
        setUserCMdata((prev) => [...prev, res.data]);
        const newCounter = counter + 1;
        setCounter(newCounter);
        localStorage.setItem("clientCounter", newCounter);
        setIsOpen(false);
      } catch (error) {
        console.error("Error Client Master :", error);
      }
    }
    setCompanyName("");
    setClientID("");
    setFullName("");
    setEmailId("");
    setPhoneNumber("");
    setGstNO("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setPincode("");
    setPAN("")
    setDepartment("")
    setCreatedBy("")
    setPocSections([{ id: 1, Name: '', designation: '', email: '', phone: '', department: "" }])
  };

  const handleEdit = (id) => {
    const client = userCMdata.find(user => user._id === id);
    if (client) {
      setEditingIndex(id);
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
      setPAN(client.PAN);
      setDepartment(client.department);
      setCreatedBy(client.createdBy);
      // if (jobRole === "Super Admin" || jobRole === "Admin") {
      //   setCreatedBy(client.createdBy);
      // }
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

  const handleDelete = async (id) => {
    try {

      await axios.delete(`https://cednwenlms.onrender.com/api/cmdata/${id}`);
      setUserCMdata((prev) => prev.filter(user => user._id !== id));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredData = userCMdata.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.companyName?.toLowerCase() || "").includes(term) ||
      (user.clientID?.toLowerCase() || "").includes(term) ||
      (user.fullName?.toLowerCase() || "").includes(term) ||
      (user.emailId?.toLowerCase() || "").includes(term) ||
      (user.phoneNumber?.toString() || "").includes(term) ||
      (user.gstNO?.toLowerCase() || "").includes(term) ||
      (user.address1?.toLowerCase() || "").includes(term) ||
      (user.address2?.toLowerCase() || "").includes(term) ||
      (user.city?.toLowerCase() || "").includes(term) ||
      (user.state?.toLowerCase() || "").includes(term) ||
      (user.pincode?.toLowerCase() || "").includes(term) ||
      (user.PAN?.toLowerCase() || "").includes(term) ||
      (user.department?.toLowerCase() || "").includes(term) ||
      (user.createdBy?.toLowerCase() || "").includes(term) ||
      (user.pocSections.some((section) =>
        Object.values(section).some((value) =>
          value.toLowerCase().includes(term)
        )
      ))
    );
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  const confirmDelete = (id) => {
    setDeleteIndex(id);
    setShowConfirm(true);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Calculate the current data slice
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endindex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

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
  const filtereddata = currentData.map(({ _id, __v, ...rest }) => ({
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

  const fetchadminData = async () => {
    try {
      const adminDataRes = await axios.get(
        "https://cednwenlms.onrender.com/api/adminData"
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
      const response = await axios.get("https://cednwenlms.onrender.com/api/getdepartment");
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

  const fetchOrderData = async () => {
    try {
      const response = await axios.get("https://cednwenlms.onrender.com/api/getNewOrder");
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

  const handleRemovePoc = (id) => {
    const updatedPocSections = pocSections.filter(section => section.id !== id);
    setPocSections(updatedPocSections);
  }

  const HandleClose = () => {
    setIsOpen(false)
    setEditingIndex(null)
    setCompanyName("");
    setClientID("");
    setFullName("");
    setEmailId("");
    setPhoneNumber("");
    setGstNO("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setPincode("");
    setPAN("")
    setDepartment("")
    setCreatedBy("")
    setPocSections([{ id: 1, Name: '', designation: '', email: '', phone: '', department: "" }])
  }
  return (
    <div>
      <Sidebar />
      <main className="ml-60 flex flex-col flex-1 gap-4 p-5">
        <Header name="Client Master" />
        <section>
          <div className="flex justify-end gap-3 text-sm max-xl:text-xs  font-normal">
            <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] max-xl:py-[0.28rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
              <i className="fa-solid fa-filter  text-[#E84000]"></i>
              <input
                type="text"
                placeholder="Search Filter..."
                onChange={handleSearch}
                className="ml-2 border-none outline-none placeholder-gray-400 text-sm max-xl:text-xs w-60 max-lg:w-40"
              />
            </div>
            <CSVLink data={filtereddata}>
              <button className="flex items-center px-4 max-xl:px-3 py-[0.35rem] max-xl:py-[0.28rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
                <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
                Export
              </button>
            </CSVLink>
            <button
              onClick={toggleSection}
              className="flex items-center px-4 max-xl:px-3  py-[0.35rem] max-xl:py-[0.28rem] gap-2  border rounded-md bg-[#E84000] text-[#fff] transition duration-300"
            >
              <i className="fa-solid fa-circle-plus"></i>
              {isOpen ? "Close Form" : "Add New Client "}
            </button>
          </div>
        </section>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white border rounded-lg shadow-lg w-[75%] max-w-6xl">
              <div className="flex justify-between items-center p-5 border-b">
                <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                  {editingIndex !== null
                    ? "Edit Client Master"
                    : "New Client Master"}
                </h1>
                <button
                  onClick={HandleClose}
                  // onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Form Fields */}
                  <div className="grid grid-cols-5 max-xl:grid-cols-4 gap-x-6 gap-y-4">
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Client Name
                      </label>
                      <input
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={companyName}
                        placeholder="Enter Company Name"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
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
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Concern Person Name
                      </label>
                      <input
                        onChange={(e) => setFullName(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        // value={concernPerson}
                        value={fullName}
                        placeholder="Enter Full Name"
                      />
                    </div>

                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs" >
                        Email ID
                      </label>
                      <input
                        onChange={(e) => setEmailId(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="email"
                        // required
                        value={emailId}
                        placeholder="info@xyz.com"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Phone No
                      </label>
                      <input
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="tel"
                        // required
                        value={phoneNumber}
                        placeholder="Enter Mobile Number"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        GST No.
                      </label>
                      <input
                        onChange={(e) => setGstNO(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={gstNO}
                        placeholder="Enter Gst Number"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
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
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Address Line 2
                      </label>
                      <input
                        onChange={(e) => setAddress2(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={address2}
                        placeholder="Nr. BSNL office, Jagatpur Road"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        City
                      </label>
                      <input
                        onChange={(e) => setCity(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={city}
                        placeholder="Enter City Name"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        State
                      </label>
                      <input
                        onChange={(e) => setState(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={state}
                        placeholder="Enter State"
                      />
                    </div>

                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Pincode
                      </label>
                      <input
                        onChange={(e) => setPincode(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="select"
                        // required
                        value={pincode}
                        placeholder="Enter Pincode"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        PAN
                      </label>
                      <input
                        onChange={(e) => setPAN(e.target.value)}
                        className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="select"
                        // required
                        value={PAN}
                        placeholder="Enter PAN Number"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs" for="created-by">Created By</label>
                      <select value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} className="border text-[#A1A7C4] px-3 py-[0.28rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]" name="pets" id="pet-select">
                        <option>--select Option--</option>
                        {jobRole === "Super Admin" || jobRole === "Admin" ? (
                          admindata.map((user, index) => (
                            <option key={index} value={user}>
                              {user}
                            </option>
                          ))
                        ) : (
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
                            <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Full Name</label>
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
                            <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Email ID</label>
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
                            <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Phone No</label>
                            <input
                              type="text"
                              value={section.phone}
                              onChange={(e) => handleInputChange(e, section.id, 'phone')}
                              placeholder="Enter Phone Number"
                              className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            />
                          </div>
                          {/* Designation Input */}
                          <div className="w-full">
                            <label className="font-normal text-[#202020] text-sm max-xl:text-xs">Designation</label>
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
                            <label className="font-normal text-[#202020] text-sm max-xl:text-xs" htmlFor={`department-${section.id}`}>Department</label>
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
                      className="px-4 py-[0.35rem] mt-2 text-sm max-xl:text-xs  font-medium border text-[#E84000] border-[#E84000] rounded-md hover:bg-[#d33900] hover:text-white"
                    >
                      Add New
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-0 flex justify-end gap-3">
                    <button
                      type="submit"
                      className="px-5 text-sm font-medium rounded-md py-[0.35rem] max-xl:text-xs border border-[#E84000] text-[#E84000] hover:bg-[#E84000] hover:text-white"
                    >
                      {editingIndex !== null ? "Update Client " : "Add Client "}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* table */}
        <section className="">
          <div className="overflow-x-auto">
            <table className="min-w-[100%] table-auto border rounded-lg shadow-sm border-separate border-spacing-0">
              <thead className="bg-[#E84000] rounded-t-lg ">
                <tr>
                  <th className="px-2 w-10 whitespace-nowrap py-[0.35rem] text-white  text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                  <th className="px-2 w-10 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 ">
                    Sr No.
                  </th>
                  <th className="px-2 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Client Name
                  </th>
                  <th className="px-2 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Client Code
                  </th>
                  <th className="px-2 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Concern Person
                  </th>
                  <th className="px-2 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Email ID
                  </th>
                  <th className="px-2 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Created By
                  </th>
                  <th className="px-2 w-32 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Phone No
                  </th>


                  <th className="px-2 w-20 whitespace-nowrap py-[0.35rem] text-white text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tr-lg"></th>
                </tr>
              </thead>

              <tbody className="font-normal">
                {Array.isArray(currentData) && currentData.length > 0 ? (
                  currentData.filter(user => jobRole === "Super Admin" || jobRole === "Admin" || user.createdBy === userName).map((user, index) => {
                    return (
                      <>
                        <tr
                          key={user._id}
                          className="border-t leading-3 font-normal hover:bg-[#FFF5F2] border-gray-300"
                        >
                          <td
                            onClick={() => toggleRow(index)}
                            className="leading-3 whitespace-nowrap px-2 max-xl:text-xs py-[0.40rem] hover:bg-slate-300 rounded text-[#5A607F]  text-sm border-b text-center border-gray-300 cursor-pointer"
                          >
                            <i
                              className={`fa-solid fa-angle-right  text-sm max-xl:text-xs transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                                }`}
                            ></i>
                          </td>
                          <td className=" px-2 whitespace-nowrap  leading-3 text-[#5A607F] py-[0.35rem] max-xl:text-xs  text-sm border-b text-center border-gray-300">
                            {startIndex + index + 1}
                          </td>
                          <td className=" px-2 whitespace-nowrap  py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.companyName}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.clientID}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem]  leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.fullName}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.emailId}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3  text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.createdBy}
                          </td>
                          <td className="px-2 whitespace-nowrap py-[0.35rem] leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            {user.phoneNumber}
                          </td>
                          <td className="py-[0.35rem] whitespace-nowrap px-2 leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(user._id);
                                setIsOpen(true);
                              }}
                            >
                              <i class="fa-regular fa-pen-to-square cursor-pointer pr-4"></i>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(user._id);
                              }}
                            >
                              <i class="fa-regular fa-trash-can cursor-pointer"></i>
                            </button>
                          </td>

                        </tr>
                        {showConfirm && (
                          <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded shadow-lg">
                              <p className="mb-4">
                                Are you sure you want to delete this client?
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
                                className={`border px-2 py-[0.15rem]  text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "address" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
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
                                            <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                              {user.address1} {user.address2}
                                            </td>
                                            <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                              {user.city}
                                            </td>
                                            <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                              {user.state}
                                            </td>
                                            <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                              {user.pincode}
                                            </td>
                                            <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                              {user.gstNO}
                                            </td>
                                          </tr>
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
                                )}

                                {/* second Table */}
                                {activeTable === "poc" && (
                                  <div className="w-3/4 max-xl:w-5/6 mx-auto border border-gray-300 rounded-lg overflow-hidden">
                                    <table className="table-auto w-full border-collapse ">
                                      <thead className="bg-[#848484]">
                                        <tr>
                                          <th className="p-2 w-16 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
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
                                              <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                {index + 1}
                                              </td>
                                              <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                {pocSection.Name}
                                              </td>
                                              <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                {pocSection.designation}
                                              </td>
                                              <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                {pocSection.department}
                                              </td>
                                              <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                {pocSection.email}
                                              </td>
                                              <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                {pocSection.phone}
                                              </td>
                                            </tr>))
                                        ) : (
                                          <>
                                            <tr>
                                              <td
                                                colSpan="8"
                                                className="text-center text-sm text-[#5A607F] py-5 border   rounded-md"
                                              >
                                                <div className="flex flex-col items-center justify-center">
                                                  <img src={myImage} alt="Description" className="mb-2" />
                                                  <span>No POC Details Available.</span>
                                                </div>
                                              </td>
                                            </tr>
                                          </>
                                        )}
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
                                          <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
                                            License
                                          </th>
                                          <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">
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
                                                <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {index + 1}
                                                </td>
                                                <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {order.PODate}
                                                </td>
                                                <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {order.rows.map((row, rowIndex) => (
                                                    <div key={rowIndex}>{row.SelectProducts}</div>
                                                  ))}
                                                </td>
                                                <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                  {order.rows.map((row, rowIndex) => (
                                                    <div key={rowIndex}>{row.Amount}</div>
                                                  ))}
                                                </td>
                                                <td></td>
                                                <td className="p-2 border max-xl:text-xs text-sm text-[#5A607F] border-[#E4E7EC] text-center">
                                                  <button
                                                    onClick={() => order.Certificate && window.open(order.Certificate, "_blank")}

                                                    disabled={!order.Certificate}
                                                  >
                                                    <i class="fa-regular fa-eye"></i>
                                                  </button>

                                                </td>
                                                <td className="p-2 border text-sm text-[#5A607F] border-[#E4E7EC] text-center">
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
                                            <td colSpan="10" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                              <div className="flex flex-col items-center justify-center">
                                                <img src={myImage} alt="Description" className="mb-2" />
                                                <span>No Order Details Available.</span>

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
                  <>
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center text-sm text-[#5A607F] py-5 border   rounded-md"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <img src={myImage} alt="Description" className="mb-2" />
                          <span>No Client Details Available.</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex justify-between items-center  text-sm font-normal">
          <button
            className={`px-4 py-[0.35rem] max-xl:py-[0.25rem] rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-[#E84000] text-white"
              }`}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="">
            <span className="text-base max-xl:text-sm font-medium">Page : </span>
            <select
              className="px-3 py-[0.35rem] max-xl:py-[0.20rem] max-xl:px-1 border rounded-md text-sm focus:outline-none border-[#5A607F]"
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
            className={`px-4 py-[0.35rem] max-xl:py-[0.25rem] rounded-md ${currentPage === totalPages
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
  );
}
export default ClientMaster;
