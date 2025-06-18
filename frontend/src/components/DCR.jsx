import React, { useEffect, useState } from 'react'
import Sidebar from '../pages/Sidebar'
import Header from '../pages/Header'
import { CSVLink } from "react-csv";
import axios from 'axios';
import myImage from "../images/Group 736.png";

function DCR() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [cmData, setCmData] = useState([]);
  const [newDCRData, setNewDCRData] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([{ id: 1, value: "" }]);
  const [status, setStatus] = useState()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetecheData, setFetecheData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTable, setActiveTable] = useState("comment")
  const [searchTerm, setSearchTerm] = useState("");
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
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
  const [clientType, setClientType] = useState("Existing Client");
  const [counter, setCounter] = useState(1);
  const [pocSections, setPocSections] = useState([{ id: 1, Name: '', designation: '', email: '', phone: '', department: "" }]);
  const [userName, setUserName] = useState("")
  const [jobRole, setJobRole] = useState("")

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName")
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  useEffect(() => {
    const storedJobRole = localStorage.getItem("jobrole");
    if (storedJobRole) {
      setJobRole(storedJobRole)
    }
  }, [])
  const toggleSection = () => {
    setIsOpen(prevState => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/cmdata");
        setCmData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    const selectedCustomer = cmData.find(
      (customer) => customer.companyName === e.target.value
    );
    setNewDCRData(selectedCustomer)
    setCompanyName(selectedCustomer ? selectedCustomer.companyName : "")
    setAddress1(selectedCustomer ? selectedCustomer.address1 : "")
    setAddress2(selectedCustomer ? selectedCustomer.address2 : "")
    setCity(selectedCustomer ? selectedCustomer.city : "")
    setClientID(selectedCustomer ? selectedCustomer.clientID : "")
    setEmailId(selectedCustomer ? selectedCustomer.emailId : "")
    setFullName(selectedCustomer ? selectedCustomer.fullName : "")
    setGstNO(selectedCustomer ? selectedCustomer.gstNO : "")
    setPhoneNumber(selectedCustomer ? selectedCustomer.phoneNumber : "")
    setPincode(selectedCustomer ? selectedCustomer.pincode : "")
    setState(selectedCustomer ? selectedCustomer.state : "")
    setPAN(selectedCustomer ? selectedCustomer.PAN : "");
    setCreatedBy(selectedCustomer ? selectedCustomer.createdBy : "")
    setPocSections(selectedCustomer ? selectedCustomer.pocSections : "")
  }
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentsChange = (index, event) => {
    const newComments = [...comments];
    newComments[index].value = event.target.value;
    newComments[index].currentsDate = newComments[index].currentsDate || new Date().toLocaleDateString();
    newComments[index].currentsTime = newComments[index].currentsTime || new Date().toLocaleTimeString();
    setComments(newComments);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }
  useEffect(() => {
    const storedCounter = localStorage.getItem("clientCounter");
    if (storedCounter) {
      setCounter(parseInt(storedCounter, 10));
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (clientType === "New Client") {
        await axios.post("http://localhost:5000/api/cmdata", {
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
      }


      await axios.post("http://localhost:5000/api/saveddcr", {
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
        comment,
        currentDate,
        currentTime,
      });
      const newCounter = counter + 1;
      setCounter(newCounter);
      localStorage.setItem("clientCounter", newCounter);
      setIsOpen(false);
      fetchDCRdata();
    } catch (error) {
      console.log("Error during submission:", error);
    }
  };

  const fetchDCRdata = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getdcr");
      setFetecheData(response.data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchDCRdata()
  }, [])

  const handleDelete = (id) => {
    setShowConfirm(true)
    setDeleteIndex(id)
  }
  const handleDeleteProposal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deletedcr/${id}`);
      fetchDCRdata((prev) => prev.filter(user => user._id !== id));
      console.log("data deleted successfull")
      setShowConfirm(false);
    } catch (error) {
      console.log(error)
    }
    setShowConfirm(false)
  }

  const handleEditDCR = (id) => {
    setIsEditOpen(true)
    const client = fetecheData.find(user => user._id === id);

    if (client) {
      setEditingIndex(id)
      setComment(client.comment)
      setCompanyName(client.companyName)
      setAddress1(client.address1)
      setAddress2(client.address1)
      setCity(client.city)
      setState(client.state)
      setPincode(client.pincode)
      setGstNO(client.gstNO)
      setStatus(client.status)
      setComments(client.comments || [{ id: 1, value: "" }]);
      setClientID(client.clientID);
      setFullName(client.fullName);
      setEmailId(client.emailId);
      setPhoneNumber(client.phoneNumber);
      setPAN(client.PAN)
      setDepartment(client.department)
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
  }
  const handleEditSubmit = async () => {
    try {

      await axios.put(`http://localhost:5000/api/updatedcr/${editingIndex}`, {
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
        currentDate,
        currentTime,
        comment,
        comments,
        status,
      });
      console.log("data updated successfull")
      setIsEditOpen(false)
      fetchDCRdata()
    } catch (error) {
      console.log(error)
    }
    setIsEditOpen(false)
  }
  const addMoreComment = () => {
    const newComment = {
      id: comments.length + 1,
      value: "",
      currentsDate: new Date().toLocaleDateString(),
      currentsTime: new Date().toLocaleTimeString(),
    };
    setComments([...comments, newComment]);
  };

  const totalPages = Math.ceil(fetecheData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentPageData = fetecheData.slice(startIndex, startIndex + entriesPerPage)

  const handlePrev = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev - 1)
    }
  }
  const handleNext = () => {
    if (currentPage > totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  }

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = fetecheData.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.companyname?.toLowerCase() || "").includes(term) ||
      (user.clientid?.toLowerCase() || "").includes(term) ||
      (user.fullname?.toLowerCase() || "").includes(term) ||
      (user.emailid?.toLowerCase() || "").includes(term) ||
      (user.phonenumber?.toString() || "").includes(term) ||
      (user.gstno?.toLowerCase() || "").includes(term) ||
      (user.addressone?.toLowerCase() || "").includes(term) ||
      (user.addresstwo?.toLowerCase() || "").includes(term) ||
      (user.mycity?.toLowerCase() || "").includes(term) ||
      (user.mystate?.toLowerCase() || "").includes(term) ||
      (user.pinncode?.toLowerCase() || "").includes(term) ||
      (user.status?.toLowerCase() || "").includes(term) ||
      (user.currentDate?.toLowerCase() || "").includes(term) ||
      (user.pocSections?.some((section) =>
        Object.values(section).some((value) =>
          value?.toString().toLowerCase().includes(term)
        )
      ) || false)
    );
  });

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    setPocSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const addNewPocSection = () => {
    setPocSections([
      ...pocSections,
      { id: pocSections.length + 1, Name: '', designation: '', email: '', phone: '', department: "" },
    ]);
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

  const handleChangeDCR = (event) => {
    setClientType(event.target.id);
  };
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

  const handleRemoveEditPoc = (id) => {
    const updatePocSection = pocSections.filter(section => section.id !== id);
    setPocSections(updatePocSection);
  }
  const handleRemoveComments = (id) => {
    const updateComments = comments.filter(section => section.id !== id);
    setComments(updateComments);
  }

  const filtereddata = filteredData.map(({ _id, __v, ...rest }) => ({
    ...rest,
    comments: rest.comments
      ? Array.isArray(rest.comments)
        ? rest.comments.map(item =>
          Object.entries(item)
            .filter(([key]) => key !== "_id")
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        ).join(" | ")
        : Object.entries(rest.comments)
          .filter(([key]) => key !== "_id")
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      : "",

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

  const handleClose = () => {
    setIsOpen(false)
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
    setComments("")
    setComment("")
  }

  const handleEditClose = () => {
    setIsEditOpen(false)
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
    setComments("")
    setComment("")
  }
  return (
    <div>
      <Sidebar />
      <main className="ml-60 flex flex-col flex-1 gap-4 p-5">
        <Header name="DCR" />
        <section className="flex justify-end gap-4 mt-6 text-sm  max-xl:text-xs  font-normal">
          <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] max-xl:py-[0.28rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
            <i className="fa-solid fa-filter  text-[#E84000]"></i>
            <input
              type="text"
              placeholder="Search Filter..."
              onChange={handleSearch}
              className="ml-2 border-none outline-none placeholder-gray-400 w-60"
            />
          </div>
          {jobRole === "Super Admin" || jobRole === "Admin" ? (
            <CSVLink data={filtereddata}>
              <button className="flex items-center px-4 py-[0.35rem] max-xl:py-[0.28rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
                <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
                Export
              </button>
            </CSVLink>
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
            {isOpen ? "Close" : "Add New DCR"}
          </button>
        </section>
        {isOpen && (
          <>
            <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
              <div className='bg-white border rounded-lg shadow-lg w-[75%] max-w-6xl'>
                <div className="flex justify-between items-center p-5 max-xl:p-3 border-b">
                  <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                    New DCR
                  </h1>
                  <button
                    onClick={handleClose}
                    // onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className='px-5 py-3 text-sm font-medium'>
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
                <form className='' onSubmit={handleSubmit} action="">

                  {/* Existing Client master */}
                  {clientType === "Existing Client" && (
                    <div className='bg-[#E8E8E8] px-4 text-sm max-xl:text-xs font-medium py-8 '>
                      <label className="" htmlFor="">
                        Customer Name
                      </label>
                      <select
                        className="border px-2 w-96 text-sm max-xl:text-xs font-normal rounded-md ml-4 py-[0.12rem] h-8"
                        name="pets"
                        id="pet-select"
                        onChange={handleCustomerChange}
                      >
                        <option value="">--Select Option--</option>
                        {cmData
                          .filter(user =>
                            jobRole === "Super Admin" || jobRole === "Admin" || user.createdBy === userName
                          )
                          .map((user, index) => (
                            <option key={index} value={user.companyName}>
                              {user.companyName}
                            </option>
                          ))}
                      </select>
                      <div className="mt-3 pl-32 w-72 max-xl:text-xs text-sm">
                        <h2 className="font-semibold text-base  text-[#E84000]">
                          {companyName}
                        </h2>
                        <p className="font-font-medium">ADDRESS:</p>
                        <p className="font-normal">{address1}</p>
                        <p className="font-normal">{address2}</p>
                        <p className="font-normal">
                          {pincode}-<span>{state}</span>
                        </p>
                      </div>
                      <div className="flex pl-32 items-center mt-2">
                        <label className="text-sm max-xl:text-xs font-font-medium" htmlFor="">
                          GSTIN : {gstNO}
                        </label>
                      </div>
                    </div>
                  )}

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

                  <div className='px-4 text-sm max-xl:text-xs font-normal max-xl:font-medium py-8 max-xl:py-3'>
                    <label htmlFor="">Comment</label><br />
                    <input
                      id="comment"
                      className='border px-2 text-sm max-xl:text-xs font-normal rounded-md py-[0.12rem] w-full h-8'
                      type="text"
                      value={comment}
                      onChange={handleCommentChange}
                    />
                  </div>
                  <div className='flex justify-end px-4 py-8 max-xl:py-3'>
                    <button type='submit' className='px-4 py-[0.35rem] mt-2 text-sm max-xl:text-xs font-medium border text-[#E84000] border-[#E84000] rounded-md hover:bg-[#d33900] hover:text-white'>
                      Save DCR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
        {isEditOpen && (
          <>
            <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
              <div className='bg-white border rounded-lg shadow-lg w-[75%] max-w-6xl'>
                <div className="flex justify-between items-center p-5 max-xl:p-3 border-b">
                  <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                    Edit DCR
                  </h1>
                  <button
                    onClick={handleEditClose}
                    // onClick={() => setIsEditOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div className='px-5 py-3 text-sm font-medium'>
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
                <form className='' onSubmit={handleEditSubmit} action="">
                  {clientType === "Existing Client" && (
                    <div className='bg-[#E8E8E8] px-4 text-sm max-xl:text-xs font-normal py-8 '>
                      <label className="" htmlFor="">
                        Customer Name
                      </label>
                      <select
                        className="border w-96 px-2 text-sm max-xl:text-xs font-normal rounded-md ml-4 py-[0.12rem] h-8"
                        name="pets"
                        id="pet-select"
                        onChange={handleCustomerChange}
                      >
                        <option value="">--Select Customer--</option>
                        {cmData
                          .filter(user =>
                            jobRole === "Super Admin" || jobRole === "Admin" || user.createdBy === userName
                          )
                          .map((user, index) => (
                            <option key={index} value={user.companyName}>
                              {user.companyName}
                            </option>
                          ))}
                      </select>
                      <div className="mt-3 pl-32 w-72 text-sm max-xl:text-xs">
                        <h2 className="font-semibold text-base max-xl:text-sm text-[#E84000]">
                          {companyName}
                        </h2>
                        <p className="font-medium">ADDRESS:</p>
                        <p className="font-normal">{address1}</p>
                        <p className="font-normal">{address2}</p>
                        <p className="font-normal">
                          {pincode}-<span>{state}</span>
                        </p>
                      </div>
                      <div className="flex pl-32 items-center mt-2">
                        <label className="text-sm max-xl:text-xs font-medium" htmlFor="">
                          GSTIN : {gstNO}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* New client master form */}
                  {clientType === "New Client" && (
                    <form className="flex flex-col gap-5 px-4 py-4 bg-[#E8E8E8]">
                      <div className="grid grid-cols-5 max-xl:grid-cols-4 gap-x-6 max-xl:gap-x-3 gap-y-4 max-xl:gap-y-2">
                        <div>
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
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
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
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
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
                            Concern Person Name
                          </label>
                          <input
                            onChange={(e) => setFullName(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm  max-xl:text-xs mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="text"
                            // required
                            // value={concernPerson}
                            value={fullName}
                            placeholder="John"
                          />
                        </div>

                        <div>
                          <label className="font-normal text-[#202020] text-sm  max-xl:text-xs max-xl:font-medium">
                            Email ID
                          </label>
                          <input
                            onChange={(e) => setEmailId(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm mt-1 max-xl:text-xs w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="email"
                            // required
                            value={emailId}
                            placeholder="info@simploona.com"
                          />
                        </div>
                        <div>
                          <label className="font-normal text-[#202020] text-sm  max-xl:text-xs max-xl:font-medium">
                            Phone No
                          </label>
                          <input
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] text-sm mt-1 max-xl:text-xs w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="tel"
                            // required
                            value={phoneNumber}
                            placeholder="8460251074"
                          />
                        </div>
                        <div>
                          <label className="font-normal text-[#202020] text-sm  max-xl:text-xs max-xl:font-medium">
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
                          <label className="font-normal text-[#202020] text-sm  max-xl:text-xs max-xl:font-medium">
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
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
                            Address Line 2
                          </label>
                          <input
                            onChange={(e) => setAddress2(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="text"
                            // required
                            value={address2}
                            placeholder="E426, Ganesh Glory 11, Nr. BSNL office, Jagatpur Road"
                          />
                        </div>
                        <div>
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
                            City
                          </label>
                          <input
                            onChange={(e) => setCity(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="text"
                            // required
                            value={city}
                            placeholder="Ahmedabad"
                          />
                        </div>
                        <div>
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
                            State
                          </label>
                          <input
                            onChange={(e) => setState(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="text"
                            // required
                            value={state}
                            placeholder="Gujarat"
                          />
                        </div>

                        <div>
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
                            Pincode
                          </label>
                          <input
                            onChange={(e) => setPincode(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="select"
                            // required
                            value={pincode}
                            placeholder="India"
                          />
                        </div>
                        <div>
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">
                            PAN
                          </label>
                          <input
                            onChange={(e) => setPAN(e.target.value)}
                            className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                            type="select"
                            // required
                            value={PAN}
                            placeholder="PAN Number"
                          />
                        </div>
                        <div>
                          <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium" for="created-by">Created By</label>
                          <select value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} className="border text-[#A1A7C4] px-3 py-[0.28rem] max-xl:text-xs  text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]" name="pets" id="pet-select">
                            <option value="">-Select Option--</option>
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
                        <h3 className="text-[#2A467A] max-xl:text-sm text-base font-semibold">POC</h3>
                        <div className="flex flex-col gap-4 max-xl:gap-3">
                          {pocSections.map((section) => (
                            <div key={section.id} className="flex gap-4 max-xl:gap-3">
                              {/* Full Name Input */}
                              <div className="w-full">
                                <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">Full Name</label>
                                <input
                                  type="text"
                                  value={section.Name}
                                  onChange={(e) => handleInputChange(e, section.id, 'Name')}
                                  placeholder="Enter Full Name"
                                  className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                                />
                              </div>
                              {/* Email Input */}
                              <div className="w-full">
                                <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">Email ID</label>
                                <input
                                  type="text"
                                  value={section.email}
                                  onChange={(e) => handleInputChange(e, section.id, 'email')}
                                  placeholder="Enter Email id"
                                  className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                                />
                              </div>
                              {/* Phone Input */}
                              <div className="w-full">
                                <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">Phone No</label>
                                <input
                                  type="text"
                                  value={section.phone}
                                  onChange={(e) => handleInputChange(e, section.id, 'phone')}
                                  placeholder="Enter Phone no"
                                  className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                                />
                              </div>
                              {/* Designation Input */}
                              <div className="w-full">
                                <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium">Designation</label>
                                <input
                                  type="text"
                                  value={section.designation}
                                  onChange={(e) => handleInputChange(e, section.id, 'designation')}
                                  placeholder="Enter Designation"
                                  className="border text-[#A1A7C4] px-3 py-[0.35rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                                />
                              </div>
                              {/* Department Input */}
                              <div className="w-full">
                                <label className="font-normal text-[#202020] text-sm max-xl:text-xs max-xl:font-medium" htmlFor={`department-${section.id}`}>Department</label>
                                <select value={section.department || ''}
                                  id={`department-${section.id}`}
                                  name="department"
                                  onChange={(e) => handleInputChange(e, section.id, "department")} className="border text-[#A1A7C4] px-3 py-[0.28rem] max-xl:text-xs text-sm mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]" >
                                  <option value="">--Select Department--</option>
                                  {departmentData.map((department, index) => (
                                    <option key={index} value={department.name}>
                                      {department.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="justify-end items-end flex">
                                <i onClick={() => handleRemoveEditPoc(section.id)} class="fa-regular fa-circle-xmark text-lg font-medium text-red-600 cursor-pointer"></i>
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


                  <div className='px-4 text-sm font-normal py-8 max-xl:py-4'>

                    <label className='max-xl:font-medium max-xl:text-xs' htmlFor="">Comment</label><br />
                    <input
                      id="comment"
                      className='border px-2 text-sm max-xl:text-xs font-normal rounded-md py-[0.12rem] w-full h-8'
                      type="text"
                      value={comment}

                    />

                    {comments.map((comment, index) => (
                      <div key={index} className="mb-4 mt-5 flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-sm max-xl:text-xs max-xl:font-medium font-normal" htmlFor={`comments-${index}`}>
                            Comment {index + 1}
                          </label>
                          <input
                            id={`comments-${index}`}
                            className="border px-2 text-sm max-xl:text-xs font-normal rounded-md py-[0.12rem] w-full h-8"
                            type="text"
                            value={comment.value}
                            onChange={(e) => handleCommentsChange(index, e)}
                          />
                        </div>

                        <i
                          onClick={() => handleRemoveComments(comment.id)}
                          className="fa-regular fa-circle-xmark text-lg font-medium text-red-600 cursor-pointer"
                        ></i>
                      </div>

                    ))}
                    <button type='button' onClick={addMoreComment} className='px-4 py-[0.35rem] mt-2 text-sm max-xl:text-xs font-medium border text-[#E84000] border-[#E84000] rounded-md hover:bg-[#d33900] hover:text-white'>
                      Add More Comment
                    </button>
                  </div>

                  <div className='flex gap-3 justify-end items-center px-4 py-8 max-xl:py-4 text-sm max-xl:text-xs'>
                    <select
                      className="h-8 max-xl:h-7 border rounded-md  border-[#E84000] focus:outline-none"
                      onChange={handleStatusChange}
                      name="Status"
                      value={status}
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
                    <button type='submit' className='px-4 py-[0.35rem] text-sm max-xl:text-xs font-medium border text-[#E84000] border-[#E84000] rounded-md hover:bg-[#d33900] hover:text-white'>
                      Save DCR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
        {/* table */}
        <section className="overflow-x-auto">
          <table className="min-w-[100%] table-auto border rounded-lg shadow-sm border-separate border-spacing-0">
            <thead className="bg-[#E84000] rounded-t-lg ">
              <tr>
                <th className="px-2 w-10 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tl-lg"></th>
                <th className="px-2 w-10 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Sr. No.</th>
                <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Client Name</th>
                <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Client Code</th>
                <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Concern Person</th>
                <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Email Id</th>
                <th className="px-2 w-32 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Phone No.</th>
                <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Created By</th>
                <th className="px-2 w-40 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 ">Status</th>
                <th className="px-2 w-20 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-center border-b border-gray-300 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="text-base font-normal">
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.filter(user => jobRole === "Super Admin" || jobRole === "Admin" || user.createdBy === userName).map((user, index) => {
                  return (
                    <>
                      <tr key={user._id} className="border-t   leading-3 hover:bg-[#FFF5F2] border-gray-300">
                        <td onClick={() => toggleRow(index)} className="leading-3 px-2 whitespace-nowrap py-[0.35rem] hover:bg-slate-300 rounded text-[#5A607F] max-xl:text-xs  text-sm border-b text-center border-gray-300 cursor-pointer">
                          <i
                            className={`fa-solid fa-angle-right text-base transition-transform duration-300 ${expandedRow === index ? "rotate-90" : ""
                              }`}
                          ></i>
                        </td>
                        <td className=" px-2  leading-3 text-[#5A607F] py-[0.35rem] whitespace-nowrap text-sm max-xl:text-xs border-b text-center border-gray-300">
                          {index + 1}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          {user.companyName}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          {user.clientID}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          {user.fullName}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          {user.emailId}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          {user.phoneNumber}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          {user.createdBy}
                        </td>
                        <td className=" px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          <button className="bg-[#0346C1] px-4 max-xl:py-1 py-2 rounded-full text-white">
                            {user.status}
                          </button>
                        </td>
                        <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                          <i onClick={() => handleEditDCR(user._id)} class="fa-regular fa-pen-to-square mr-5 cursor-pointer"></i>
                          <i onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user._id);
                          }} class="fa-regular fa-trash-can cursor-pointer"></i>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr>
                          <td colSpan="11" className="bg-gray-100 text-sm max-xl:text-xs text-[#5A607F] px-4 py-2">
                            <button
                              onClick={() => setActiveTable("comment")}
                              className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "comment" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                }`}
                            >
                              Comment
                            </button>
                            <button
                              onClick={() => setActiveTable("address")}
                              className={`border px-2 py-[0.15rem] text-sm max-xl:text-xs rounded-md mr-2 text-[#2A467A] font-medium ${activeTable === "address" ? "bg-[#EAF1FD]" : "bg-[#ffffff]"
                                }`}
                            >
                              Address
                            </button>
                            {/* First Table */}
                            {activeTable === "address" && (
                              <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden">
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
                                      <>
                                        <tr className="border-b">
                                          <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                            {user.address1} {user.address1}
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
                                      </>
                                    ) : (
                                      <>
                                        <tr>
                                          <td colSpan="8" className="text-center text-sm  text-[#5A607F] py-5 border rounded-md">
                                            <div className="flex flex-col items-center justify-center">
                                              <img src={myImage} alt="Description" className="mb-2" />
                                              <span>No Address Details Available.</span>
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    )}

                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* second Table */}
                            {activeTable === "comment" && (
                              <div className="w-3/4 mx-auto border border-gray-300 rounded-lg overflow-hidden mt-3">
                                <table className="table-auto w-full border-collapse">
                                  <thead className="bg-[#848484]">
                                    <tr>
                                      {/* <th className="p-2 py-[0.35rem] ftext-base font-medium text-center border border-[#E4E7EC] text-white">#</th> */}
                                      <th className="p-2 py-[0.35rem] text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">Comments</th>
                                      <th className="p-2 py-[0.35rem] w-36text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">Date</th>
                                      <th className="p-2 py-[0.35rem] w-36 text-sm max-xl:text-xs font-medium text-center border border-[#E4E7EC] text-white">Time</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {user.comment ? (
                                      <>
                                        <tr className="border-b">
                                          <td className="p-2 border text-sm  max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">
                                            {user.comment}
                                          </td>
                                          <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">{user.currentDate}</td>
                                          <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">{user.currentTime}</td>
                                        </tr>
                                        {user.comments && user.comments.length > 0 ? (
                                          user.comments.map((comment, commentIndex) => (
                                            <tr key={comment._id} className="border-b">

                                              <td className="p-2 border text-sm max-xl:text-xs  text-[#5A607F] border-[#E4E7EC] text-center">
                                                {comment.value}
                                              </td>
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">{comment.currentsDate}</td>
                                              <td className="p-2 border text-sm max-xl:text-xs text-[#5A607F] border-[#E4E7EC] text-center">{comment.currentsTime}</td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>

                                          </tr>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <tr>
                                          <td colSpan="8" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                                            <div className="flex flex-col items-center justify-center">
                                              <img src={myImage} alt="Description" className="mb-2" />
                                              <span>No comments Available.</span>
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    )}

                                  </tbody>
                                </table>
                              </div>
                            )}

                          </td>
                        </tr>
                      )}
                    </>
                  )
                })) : (
                <>
                  <tr>
                    <td colSpan="10" className="text-center text-sm text-[#5A607F] py-5 border rounded-md">
                      <div className="flex flex-col items-center justify-center">
                        <img src={myImage} alt="Description" className="mb-2" />
                        <span>No DCR Available.</span>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </section>
        {showConfirm && (
          <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="mb-4">
                Are you sure you want to delete this DCR?
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
        <section className="flex justify-between  items-center max-xl:text-xs  text-sm font-normal">
          <button
            className={`px-4 py-[0.35rem] max-xl:py-[0.25rem] rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-[#E84000] text-white"
              }`}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="">
            <span className="text-base font-medium max-xl:text-sm">Page : </span>
            <select
              className="px-3 py-[0.35rem] max-xl:py-[0.20rem] max-xl:px-1  border rounded-md  focus:outline-none border-[#5A607F]"
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
            className={`px-4 py-[0.35rem]  max-xl:py-[0.25rem] rounded-md ${currentPage === totalPages
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

export default DCR  