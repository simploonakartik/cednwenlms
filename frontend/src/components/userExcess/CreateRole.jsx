import React, { useEffect, useState } from "react";
import Sidebar from "../../pages/Sidebar";
import axios from "axios";

function CreateRole() {

  const [roleName, setRoleName] = useState("");
  const [manageroleData, setManageroleData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [access, setAccess] = useState({
    manageUser: false,
    manageRole: false,
    manageOrder: false,
    manageClients: false,
    manageOPS: false,
    manageInvoice: false,
    manageDepartment: false,
    manageDCR:false
   
  });

  const handleToggle = (field) => {
    setAccess((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };


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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      try {
        const id = manageroleData[editingIndex]._id;
        const updatejobrole = { roleName };
        await axios.put(
          `http://localhost:5000/api/manageroleData/${id}`,
          updatejobrole
        );
        setManageroleData((prev) =>
          prev.map((item, index) =>
            index === editingIndex ? { ...item, ...updatejobrole } : item
          )
        );
        setEditingIndex(null);

      } catch (error) {
        console.error("Error updating Job Role:", error);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/manageroleData", { roleName });
        setManageroleData((prev) => [...prev, res.data]);

      } catch (error) {
        console.error("Error adding Job Role:", error);
      }
    }
    setRoleName("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setRoleName(manageroleData[index].roleName);
  };

  const handleDelete = async (index) => {
    try {
      const id = manageroleData[index]._id;
      await axios.delete(`http://localhost:5000/api/manageroleData/${id}`);
      setManageroleData((prev) => prev.filter((_, i) => i !== index));

    } catch (error) {
      console.error("Error deleting Job Role:", error);
    }
  };


  return (
    <div className='flex '>
      <Sidebar />
      <main className="ml-60 2xl:ml-50 flex flex-col flex-1 gap-4 p-6">
        <section className="flex justify-between items-center gap-6">
          <h2 className="text-3xl max-lg:text-xl font-bold text-[#233B7C] text-center">
            Create New Roles
          </h2>
          <div className="flex flex-1 max-w-[60%] min-w-40">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 border rounded-full border-[#E84000] focus:outline-none focus:bg-[#fff5f233] focus:ring-1 focus:ring-[#E84000]"
            />
          </div>
          <div className="flex items-center bg-white border rounded-full px-3 py-2">
            <img
              src="../../images/userprofile.svg"
              alt="User Profile"
              className="w-11 rounded-full"

            />
            <div className="text-sm flex flex-col px-3">
              <div className="font-medium max-lg:text-base text-lg text-[#000000]">
                Yogendra Panchal
              </div>
            </div>
          </div>
        </section>



        {/* Second Div */}
        <section className="mt-5">
          <div className=" z-50 flex ">
            <div className="bg-white border rounded-lg inset-0 m-auto w-full max-w-4xl ">
              <div className="border rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-center pb-3 border-b ">
                    <h1 className="font-bold text-xl text-center text-[#E84000]">
                      Add User Role
                    </h1>
                    <button

                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button></div>
                  <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-5"
                  >
                    <div className="flex flex-col gap-3 ">
                      <div>
                        <label
                          htmlFor="productName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Product Name
                        </label>
                        <input
                          id="User Role"
                          onChange={(e) => setRoleName(e.target.value)}
                          className="border px-3 py-1.5 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
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
                        { label: "Manage OPS", field: "manageOPS" },
                        { label: "Manage Invoice", field: "manageInvoice" },
                        { label: "Manage Department", field: "manageDepartment" },
                        { label: "Manage DCR", field: "manageDCR" }
                      ].map(({ label, field }) => (
                        <div
                          key={field}
                          className="flex justify-between items-center mb-4"
                        >
                          <label className="text-lg font-medium">{label}</label>
                          <button
                            type="button"
                            className={`w-12 h-6 flex items-center rounded-full p-1 ${access[field] ? "bg-[#E84000]" : "bg-gray-300"
                              }`}
                            onClick={() => handleToggle(field)}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${access[field] ? "translate-x-6" : ""
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
                          Add User Role
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

  )
}

export default CreateRole