import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import axios from "axios";
import { CSVLink } from "react-csv";
import { NavLink } from "react-router-dom";
import Header from "../../pages/Header";
import { v4 as uuidv4 } from "uuid";
import myImage from "../../images/Group 736.png";
function Users() {
  const [managerole, setManagerole] = useState([]);
  const [userName, setUserName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [jobrole, setJobrole] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminData, setadminData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [jobroleData, setJobroledata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const fetchData = async () => {
    try {
      const manageroleRes = await axios.get(
        "http://localhost:5000/api/manageroleData"
      );
      const adminDataRes = await axios.get("http://localhost:5000/api/getUser");
      const jobroleRes = await axios.get("http://localhost:5000/api/cmdata");
      const imagesRes = await axios.get("http://localhost:5000/upload");
      setManagerole(manageroleRes.data);
      setadminData(adminDataRes.data);
      setJobroledata(jobroleRes.data);
      setImages(imagesRes.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!file) {
    //   alert("please upload a file!");
    //   return;
    // }

    // const postId = uuidv4();
    // const blob = file.slice(0, file.size, "image/jpeg");
    // const newFile = new File([blob], `${postId}_post.jpeg`, {
    //   type: "image/jpeg",
    // });

    // const formData = new FormData();
    // formData.append("userName", userName);
    // formData.append("employeeId", employeeId);
    // formData.append("emailId", emailId);
    // formData.append("password", password);
    // formData.append("jobrole", jobrole);
    // formData.append("mobileNo", mobileNo);
    // formData.append("location", location);

    const payload = {
      userName,
      employeeId,
      emailId,
      password,
      jobrole,
      mobileNo,
      location,
    };

    try {
      if (editingIndex !== null) {
        // Update existing user
        const userId = adminData[editingIndex]._id;
        const updatedProduct = {
          userName,
          employeeId,
          emailId,
          password,
          jobrole,
          mobileNo,
          location,
          // newFile,
        };
        const res = await axios.put(
          `http://localhost:5000/api/updateUser/${userId}`,
          updatedProduct
        );
        const updatedAdminData = [...adminData];
        updatedAdminData[editingIndex] = res.data;
        setadminData(updatedAdminData);
        setEditingIndex(null);
      } else {
        // Add new user
        const res = await axios.post(
          "http://localhost:5000/api/postUser",
          payload
        );
        setadminData((prev) => [...prev, res.data]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    // Reset form fields
    setUserName("");
    setEmployeeId("");
    setEmailId("");
    setPassword("");
    setPassword2("");
    setJobrole("");
    setMobileNo("");
    setLocation("");
    // setFile("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setUserName(adminData[index].userName);
    setEmployeeId(adminData[index].employeeId);
    setEmailId(adminData[index].emailId);
    setPassword(adminData[index].password);
    setJobrole(adminData[index].jobrole);
    setMobileNo(adminData[index].mobileNo);
    setLocation(adminData[index].location);
    setFile(adminData[index].imagefile);
  };

  const handleDelete = async (index) => {
    try {
      const id = adminData[index]._id;
      await axios.delete(`http://localhost:5000/api/deleteUser/${id}`);
      setadminData((prev) => prev.filter((_, i) => i !== index));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredData = adminData.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.userName?.toLowerCase() || "").includes(term) ||
      (user.mobileNo?.toLowerCase() || "").includes(term) ||
      (user.location?.toLowerCase() || "").includes(term) ||
      (user.jobrole?.toLowerCase() || "").includes(term) ||
      (user.employeeId?.toLowerCase() || "").includes(term) ||
      (user.emailId?.toLowerCase() || "").includes(term)
    );
  });
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  // Calculate the current data slice
  const startIndex = (currentPage - 1) * entriesPerPage;
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      alert("No file selected");
    }
  };

  const filtereddata = adminData.map(
    ({ password, _id, __v, imageUrl, imagefile, uploadPhoto, ...rest }) => rest
  );

  return (
    <div>
      <Sidebar />
      <main className="ml-60 flex flex-col flex-1 gap-4 p-5">
        <Header name="Users" />

        <section>
          <div className="flex justify-end gap-3  text-sm max-xl:text-xs font-normal">
            <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
              <i className="fa-solid fa-filter  text-[#E84000]"></i>
              <input
                type="text"
                placeholder="Search Filter..."
                onChange={handleSearch}
                className="ml-2 border-none outline-none placeholder-gray-400 text-sm max-xl:text-xs w-40 sm:w-60"
              />
            </div>
            <CSVLink data={filtereddata}>
              <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
                <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
                Export
              </button>
            </CSVLink>
            <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] border rounded-md  transition duration-300">
              <NavLink to="/users/roles">
                <i className="fa-solid fa-shield-halved text-[#E84000]"></i>{" "}
                Manage Access
              </NavLink>
            </button>

            <button
              onClick={toggleSection}
              className="flex items-center px-4 py-[0.35rem] gap-2  border rounded-md bg-[#E84000] text-[#fff] transition duration-300"
            >
              <i className="fa-solid fa-circle-plus"></i>
              {isOpen ? "Close Form" : "Add User "}
            </button>
          </div>
        </section>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white border rounded-lg shadow-lg w-3/4 max-w-3xl">
              <div className="flex justify-between items-center p-5 border-b">
                <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                  {editingIndex !== null ? "Edit User" : "New User"}
                </h1>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Employee Name
                      </label>
                      <input
                        onChange={(e) => setUserName(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full font-normal text-[#A1A7C4] rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={userName}
                        placeholder="Yogendra Panchal"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Employee ID
                      </label>
                      <input
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 font-normal text-[#A1A7C4] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={employeeId}
                        placeholder="SIMP12345"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Email ID
                      </label>
                      <input
                        onChange={(e) => setEmailId(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 font-normal text-[#A1A7C4] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="email"
                        // required
                        value={emailId}
                        placeholder="info@simploona.com"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Phone Number
                      </label>
                      <input
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 font-normal text-[#A1A7C4] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={mobileNo}
                        placeholder="9876543210"
                      />
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Job Role
                      </label>
                      <select
                        onChange={(e) => setJobrole(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 font-normal text-[#A1A7C4] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        value={jobrole}
                        // required
                      >
                        <option value="" disabled>
                          --Select Job Role--
                        </option>
                        {managerole.map((user, index) => (
                          <option key={index} value={user.roleName}>
                            {user.roleName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Location
                      </label>
                      <input
                        onChange={(e) => setLocation(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 font-normal text-[#A1A7C4] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                        type="text"
                        // required
                        value={location}
                        placeholder="Gujarat"
                      />
                    </div>

                    <div className="relative">
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Password
                      </label>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 font-normal text-[#202020] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000] pr-10"
                        type={showPassword ? "text" : "password"}
                        placeholder="*********"
                        value={password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={`absolute right-3 ${
                          showMessage ? "top-[55%]" : "top-[55%]"
                        } transform -translate-y-1/2 text-[#A1A7C4] hover:text-[#E84000]`}
                      >
                        <i
                          className={
                            showPassword
                              ? "fa-regular fa-eye-slash"
                              : "fa-regular fa-eye"
                          }
                        ></i>
                      </button>
                      <span className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        (A-Z; a-z; 0-9; @, #, $, %)
                      </span>
                    </div>

                    <div className="relative">
                      <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                        Re-Enter Password
                      </label>
                      <input
                        onChange={(e) => {
                          setPassword2(e.target.value);
                          if (password !== e.target.value && password !== "") {
                            setShowMessage(true);
                          } else {
                            setShowMessage(false);
                          }
                        }}
                        className={`border px-3 py-[0.35rem] text-sm max-xl:text-xs mt-1 w-full font-normal text-[#202020] rounded-md ${
                          showMessage ? "border-red-500" : "border-[#aaaaaa]"
                        } focus:outline-none focus:ring-1 ${
                          showMessage
                            ? "focus:ring-red-500"
                            : "focus:ring-[#E84000]"
                        } pr-10`}
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Re-Enter Password"
                        value={password2}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword2((prev) => !prev)}
                        className={`absolute right-3 ${
                          showMessage ? "top-[55%]" : "top-[55%]"
                        } transform -translate-y-1/2 text-[#A1A7C4] hover:text-[#E84000]`}
                      >
                        <i
                          className={
                            showPassword2
                              ? "fa-regular fa-eye-slash"
                              : "fa-regular fa-eye"
                          }
                        ></i>
                      </button>
                      {showMessage && (
                        <p className="text-red-500 text-xs mt-1">
                          Passwords does not match.
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className="">
                    <div className="flex items-center rounded-md border border-gray-300">
                     
                      <input
                        id="file_input"
                        type="file"
                        accept="image/*"
                        name="image"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    
                      <label
                        htmlFor="file_input"
                        className="flex items-center font-medium text-white text-sm max-xl:text-xs justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upload Photo
                      </label>
                      
                      <span className="text-gray-500 ml-2 font-normal  text-sm max-xl:text-xs">
                        Upload profile photo
                      </span>
                    </div>
                   
                    {file ? (
                      <p className="mt-1 text-sm max-xl:text-xs text-gray-600">
                        <strong>{file.name}</strong>
                      </p>
                    ) : (
                      ""
                    )}
                  </div> */}

                  {/* {file && (
                    <div>
                      <img
                        src={file}
                        alt="Uploaded"
                        className="w-20 h-20 object-cover rounded-full border"
                      />
                    </div>
                  )} */}
                  {/* Submit Button */}
                  <div className="mt-0 flex justify-start gap-3">
                    <button
                      type="submit"
                      className="px-5 py-[0.35rem] font-medium border border-[#E84000] rounded-md text-[#E84000] hover:bg-[#E84000] hover:text-white"
                    >
                      {editingIndex !== null ? "Edit User" : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <section className="">
          <div className="overflow-x-auto">
            <table className="min-w-[100%] table-auto border rounded-lg shadow-sm border-separate border-spacing-0">
              <thead className="bg-[#E84000] rounded-t-lg">
                <tr>
                  <th className="w-10 px-4 py-[0.35rem] text-white  whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tl-lg">
                    Sr No.
                  </th>
                  <th className="px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    User Name
                  </th>
                  <th className="px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Employee Id
                  </th>
                  <th className="px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Email ID
                  </th>
                  {/* <th className="px-4 py-3 text-white font-semibold text-center border-b border-gray-300">Password</th> */}
                  <th className="px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Job Role
                  </th>
                  <th className="w-32 px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Mobile No
                  </th>
                  <th className="px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300">
                    Location
                  </th>
                  <th className="px-4 py-[0.35rem] text-white whitespace-nowrap text-sm max-xl:text-xs font-medium text-center border-b border-gray-300 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user, index) => {
                    const key = user._id || `user-${startIndex + index}`;
                    return (
                      <tr
                        key={key}
                        className="border-t leading-3 hover:bg-[#FFF5F2] border-gray-300"
                      >
                        <td className="px-4 py-2 leading-3 text-[#5A607F] border-b whitespace-nowrap text-sm max-xl:text-xs text-center border-gray-300">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-2 leading-3 text-[#5A607F] text-sm max-xl:text-xs whitespace-nowrap border-b text-center border-gray-300">
                          {user.userName}
                        </td>
                        <td className="px-6 py-2 leading-3 text-[#5A607F] whitespace-nowrap border-b text-center border-gray-300 text-sm max-xl:text-xs">
                          {user.employeeId}
                        </td>
                        <td className="px-6 py-2 leading-3 text-[#5A607F] whitespace-nowrap  border-b text-center border-gray-300 text-sm max-xl:text-xs">
                          {user.emailId}
                        </td>
                        <td className="px-6 py-2 leading-3 text-[#5A607F] whitespace-nowrap border-b text-center border-gray-300 text-sm max-xl:text-xs">
                          {user.jobrole}
                        </td>
                        <td className="px-6 py-2 leading-3 text-[#5A607F] whitespace-nowrap border-b text-center border-gray-300 text-sm max-xl:text-xs">
                          {user.mobileNo}
                        </td>
                        <td className="px-6 py-2 leading-3 text-[#5A607F] whitespace-nowrap border-b text-center border-gray-300 text-sm max-xl:text-xs">
                          {user.location}
                        </td>
                        <td className="w-20 leading-3 ml-3 py-2 text-[#5A607F] border-b whitespace-nowrap text-center border-gray-300 text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(startIndex + index);
                              setIsOpen(true);
                            }}
                          >
                            <i class="fa-solid fa-pen-to-square text-[#5A607F]"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(startIndex + index);
                            }}
                          >
                            <i className="fa-regular fa-trash-can text-[#5A607F] ml-3"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center text-sm max-xl:text-xs text-[#5A607F] py-5 border rounded-md"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <img
                            src={myImage}
                            alt="Description"
                            className="mb-2"
                          />
                          <span>No User Available.</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            {showConfirm && (
              <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded shadow-lg">
                  <p className="mb-4">
                    Are you sure you want to delete this User?
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
          </div>
          <section className="flex justify-between items-center mt-4 text-sm max-xl:text-xs font-normal">
            <button
              className={`px-4 py-[0.35rem] rounded-md ${
                currentPage === 1 ? "bg-gray-300" : "bg-[#E84000] text-white"
              }`}
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="">
              <span className="text-base max-xl:text-sm font-medium">
                Page :{" "}
              </span>
              <select
                className="px-3 py-[0.35rem] border rounded-md text-sm max-xl:text-xs focus:outline-none border-[#E84000]"
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
              className={`px-4 py-[0.35rem] rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-[#E84000] text-white"
              }`}
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Users;
