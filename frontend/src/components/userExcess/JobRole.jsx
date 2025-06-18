import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import axios from "axios";
import Header from "../../pages/Header";

function JobRole() {
  const [roleName, setRoleName] = useState("");
  const [manageroleData, setManageroleData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [access, setAccess] = useState({
    manageUser: false,
    manageRole: false,
    manageOrder: false,
    manageClients: false,
    manageOPS: false,
    manageInvoice: false,
    manageProducts:false,
    manageDepartment:false,
    manageDCR:false
  
  });

  const handleToggle = (field) => {
    setAccess((prevAccess) => ({
      ...prevAccess,
      [field]: !prevAccess[field],
    }));
  };

  useEffect(() => {
    localStorage.setItem("manageroleData", JSON.stringify(manageroleData));
  }, [manageroleData]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/manageroleData");
        setManageroleData(res.data);
      } catch (error) {
        console.error("Error fetching Job Role:", error);
      }
    };
    fetchData();
  }, []);

  // Save or update job role
  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleData = {
      roleName,
      ...access,
    };

    if (editingIndex !== null) {
      // Update existing role
      try {
        const id = manageroleData[editingIndex]._id;
        await axios.put(
          `http://localhost:5000/api/manageroleData/${id}`,
          roleData
        );

        setManageroleData((prev) =>
          prev.map((item, index) =>
            index === editingIndex ? { ...item, ...roleData } : item
          )
        );

        setEditingIndex(null);
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating Job Role:", error);
      }
    } else {
      // Add new role
      try {
        const res = await axios.post(
          "http://localhost:5000/api/manageroleData",
          roleData
        );
        setManageroleData((prev) => [...prev, res.data]);
        setIsOpen(false);
      } catch (error) {
        console.error("Error adding Job Role:", error);
      }
    }
    // Reset form
    setRoleName("");
    setAccess({
      manageUser: false,
      manageRole: false,
      manageOrder: false,
      manageClients: false,
      manageOPS: false,
      manageInvoice: false,
      manageProducts:false,
      manageDepartment:false,
      manageDCR:false
     
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const selectedRole = manageroleData[index];
    setRoleName(selectedRole.roleName);
    setAccess({
      manageUser: selectedRole.manageUser,
      manageRole: selectedRole.manageRole,
      manageOrder: selectedRole.manageOrder,
      manageClients: selectedRole.manageClients,
      manageOPS: selectedRole.manageOPS,
      manageInvoice: selectedRole.manageInvoice,
      manageProducts:selectedRole.manageProducts,
      manageDepartment:selectedRole.manageDepartment,
      manageDCR: selectedRole.manageDCR
     
    });
    setIsOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = manageroleData[index]._id;
      await axios.delete(`http://localhost:5000/api/manageroleData/${id}`);
      setManageroleData((prev) => prev.filter((_, i) => i !== index));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting Job Role:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = manageroleData.filter((user) =>
    user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index); // Store the index to delete
    setShowConfirm(true); // Show confirmation popup
  };

  return (
    <div className="flex ">
      <Sidebar />
      <div className="w-full flex flex-col ml-60 max-xl:ml-[14rem]  gap-4 p-5 ">
        <Header name=" Job Role" />
        {isOpen && (
          <section className="fixed inset-0 z-50 flex items-center justify-center  bg-black bg-opacity-50">
            <div className=" z-50 flex ">
              <div className="bg-white border rounded-lg inset-0 m-auto w-[800px]">
                <div className="border rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-center pb-3 border-b ">
                      <h1 className="font-bold text-xl max-xl:text-lg text-center text-[#E84000]">
                        {editingIndex !== null
                          ? "Edit User Role"
                          : "New User Role"}
                      </h1>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                      <div className="flex flex-col gap-3 ">
                        <div>
                          <label
                            htmlFor="productName"
                            className="block text-lg max-xl:text-base font-bold text-gray-700 mb-2"
                          >
                            Product Name
                          </label>
                          <input
                            id="User Role"
                            onChange={(e) => setRoleName(e.target.value)}
                            className="border border-[#ff6131] px-3 py-1.5 rounded-md w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                            type="text"
                            required
                            value={roleName}
                            placeholder="Enter User Role"
                          />
                        </div>
                        {[
                          { label: "Manage User", field: "manageUser" },
                          { label: "Manage Role", field: "manageRole" },
                          { label: "Manage Order", field: "manageOrder" },
                          { label: "Manage Clients", field: "manageClients" },
                          { label: "Manage OPS",field: "manageOPS",},
                          { label: "Manage Invoice", field: "manageInvoice" },
                          { label: "Manage Products", field: "manageProducts" },
                          { label: "Manage Department", field: "manageDepartment" },
                          { label: "Manage DCR", field: "manageDCR" }
                        
                        ].map(({ label, field }) => (
                          <div
                            key={field}
                            className="flex justify-between items-center mb-4"
                          >
                            <label className="text-base max-xl:text-sm font-medium">
                              {label}
                            </label>
                            <button
                              type="button"
                              className={`w-12 h-6 flex items-center rounded-full p-1 ${
                                access[field] ? "bg-[#E84000]" : "bg-gray-300"
                              }`}
                              onClick={() => handleToggle(field)}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  access[field] ? "translate-x-6" : ""
                                }`}
                              ></div>
                            </button>
                          </div>
                        ))}

                        <div className="flex justify-center">
                          <button
                            type="submit"
                            className="bg-[#E84000] mt-6 text-white font-medium rounded-md px-5 py-2 h-10  w-full md:w-auto hover:bg-[#d03800] transition"
                          >
                            {editingIndex !== null
                              ? "Edit Job Role"
                              : "Add Job Role"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="w-[70%] inset-0 m-auto mt-5 bg-[#FFF5F2] border rounded-lg p-8   gap-3">
            <section className="flex justify-between">
              <h2 className="text-2xl max-xl:text-xl font-bold text-[#233B7C] text-center">
                Manage Access
              </h2>

              <button
                onClick={toggleSection}
                className="flex items-center px-4 py-2 gap-2  border rounded-lg bg-[#E84000] text-[#fff] transition duration-300"
              >
                <i class="fa-regular fa-square-plus"></i>
                {isOpen ? "Close User Role" : "Add User Role "}
              </button>
            </section>

            <section>
              <div className="w-full inset-0 m-auto mt-5 bg-[#FFF5F2] flex flex-col gap-4 rounded-lg">
                {filteredData.map((item, index) => (
                  <div key={item._id} className="border-gray-200">
                    <div className="flex justify-between items-center py-3 px-5 bg-white shadow-sm rounded-lg">
                      <span className="text-md font-bold text-[#222222]">
                        {item.roleName}
                      </span>
                      <div className="flex gap-3">
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                            setIsOpen(true);
                          }}
                        >
                          <img
                            className="pl-0"
                            src="../images/edit.svg"
                            alt="Edit"
                            height="18"
                            width="18"
                          />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(index);
                          }}
                        >
                          <img
                            className="pl-0"
                            src="../images/delete.svg"
                            alt="Delete"
                            height="18"
                            width="18"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Confirmation Modal */}
                    {showConfirm && deleteIndex === index && (
                      <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg">
                          <p className="mb-4">
                            Are you sure you want to delete this item?
                          </p>
                          <div className="flex justify-stretch gap-4">
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
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JobRole;
