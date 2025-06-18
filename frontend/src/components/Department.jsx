import React, { useEffect, useState } from 'react'
import Sidebar from '../pages/Sidebar'
import Header from '../pages/Header'
import axios from 'axios';
import { toast } from "react-toastify"
function Department() {
    const [name, setName] = useState("");
    const [savedData, setSaveData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null)
    const toggleSection = () => setIsOpen(!isOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const id = savedData[editingIndex]._id;
            await axios.put(`https://cednwenlms.onrender.com/api/updatedepartment/${id}`, { name });
            setSaveData((prevData) => prevData.map((item, index) => index === editingIndex ? { ...item, name } : item));
            toast.success("Update Department Successfully..");
            setEditingIndex(null);
            setIsOpen(false);
            return;
        }
        if (!name) {
            toast.error("Department name cannot be empty");
            return;
        }
        try {
            const response = await axios.post("https://cednwenlms.onrender.com/api/savedepartment", { name });
            setSaveData((prevData) => [...prevData, response.data]);
            toast.success("Add Department Successfully..");
            setName("");
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to add department");
        }
    };

    const fetchdepartmentData = async () => {
        try {
            const response = await axios.get("https://cednwenlms.onrender.com/api/getdepartment");
            setSaveData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchdepartmentData();
    }, []);

    const handleDelete = async (index) => {
        const id = savedData[index]._id;
        try {
            await axios.delete(`https://cednwenlms.onrender.com/api/deletedepartment/${id}`);
            toast.success("Delete Department Successfully..");
            setSaveData((prevData) => prevData.filter((_, idx) => idx !== index));
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete department");
        }
    };

    const handleEdit = (index) => {
        const user = savedData[index];
        if (user) {
            setEditingIndex(index)
            setName(user.name);
        } else {
            toast.error("No department selected to edit");
        }
    }
    return (
        <div>
            <Sidebar />
            <main className="ml-60 2xl:ml-50 flex flex-col flex-1 gap-4 p-5">
                <Header name="Departments" />
                <section>
                    <div className="flex justify-end gap-3 text-sm max-xl:text-xs font-normal">
                        <button
                            onClick={toggleSection}
                            className="flex items-center px-4 py-[0.35rem] gap-2  border rounded-md bg-[#E84000] text-[#fff] transition duration-300"
                        >
                            <i className="fa-solid fa-circle-plus"></i>
                            {isOpen ? "Close Form" : "Add Department "}
                        </button>
                    </div>
                </section>   
                <section>
                    <div className="overflow-x-auto">
                        <table className="min-w-[50%] table-auto border shadow-sm border-separate border-spacing-0">
                            <thead className="bg-[#E84000] rounded-t-lg ">
                                <tr>
                                    <th className="w-16 px-2 py-[0.35rem] text-white text-base max-xl:text-sm font-medium text-center border-b border-gray-300 ">
                                        Sr No.
                                    </th>
                                    <th className="px-2 py-[0.35rem] text-white text-base max-xl:text-sm font-medium text-center border-b border-gray-300">
                                        Department Name
                                    </th>
                                    <th className="w-20 px-2 py-[0.35rem] text-white text-base max-xl:text-sm font-medium text-center border-b border-gray-300">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody className=" font-normal">
                                {Array.isArray(savedData) && savedData.map((user, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className=" py-2 leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                {index + 1}
                                            </td>
                                            <td className=" py-2 leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                {user.name}
                                            </td>
                                            <td className="flex gap-5 justify-center py-2 leading-3 text-sm max-xl:text-xs text-[#5A607F] border-b text-center border-gray-300">
                                                <i onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(index);
                                                    setIsOpen(true);
                                                }} class="fa-solid fa-pen-to-square"></i>
                                                <i onClick={() => { handleDelete(index) }}
                                                    className="fa-regular fa-trash-can cursor-pointer"
                                                ></i>

                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white border rounded-lg shadow-lg w-[75%] max-w-3xl">
                            <div className="flex justify-between items-center p-5 border-b">
                                <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                                    Add New Department
                                </h1>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="p-5">
                                <form action="" onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="flex justify-between items-end gap-x-6 gap-y-4">
                                        <div>
                                            <label className="font-normal text-[#202020] text-sm max-xl:text-xs">
                                                Department Name
                                            </label>
                                            <input
                                                onChange={(e) => setName(e.target.value)}
                                                className="border px-3 py-[0.35rem] text-sm max-xl:text-xs font-normal text-[#A1A7C4] mt-1 w-full rounded-md border-[#d8d8d8] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                                                type="text"
                                                // required
                                                value={name}
                                                placeholder="Enter Department Name"
                                            />
                                        </div>
                                        <div>
                                            <button type='submit' className='px-4 py-[0.35rem] mt-2 text-sm max-xl:text-xs hover:text-white font-medium border text-[#E84000] border-[#E84000] rounded-md hover:bg-[#d33900] hover:text-white"'>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}

export default Department