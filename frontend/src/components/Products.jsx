import React, { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";
import axios from "axios";
import { CSVLink } from "react-csv";
import Header from "../pages/Header";
import { v4 as uuidv4 } from "uuid";
import myImage from "../images/Group 736.png";
function Products() {
  const [productName, setProductName] = useState("");
  const [skuId, setSkuId] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [userdata, setUsedata] = useState([]);
  const [file, setFile] = useState(null);
  const [GST, setGST] = useState(18)
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://cednwenlms.onrender.com/api/userdata");
        setUsedata(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postId = uuidv4();
    let newFile = null;
    if (file) {
      const blob = file.slice(0, file.size, "image/jpeg");
      newFile = new File([blob], `${postId}_post.jpeg`, {
        type: "image/jpeg",
      });
    }

    const formData = new FormData();
    formData.append("imageUrl", newFile);
    formData.append("productName", productName);
    formData.append("licenseType", licenseType);
    formData.append("skuId", skuId);
    formData.append("description", description);
    formData.append("sellingPrice", sellingPrice);
    formData.append("GST", GST);

    if (editingIndex !== null) {
      try {
        const id = userdata[editingIndex]._id;
        const updatedProduct = {
          productName,
          licenseType,
          skuId,
          description,
          sellingPrice,
          GST,
          newFile,
        };

        await axios.put(
          `https://cednwenlms.onrender.com/api/userdata/${id}`,
          updatedProduct
        );
        setUsedata((prev) =>
          prev.map((item, index) =>
            index === editingIndex ? { ...item, ...updatedProduct } : item
          )
        );
        setEditingIndex(null);
        setIsOpen(false);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      try {

        const res = await axios.post(
          "https://cednwenlms.onrender.com/userdata",
          formData
        );
       
        setUsedata((prev) => [...prev, res.data]);
        setIsOpen(false);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
    setProductName("");
    setLicenseType("");
    setSkuId("");
    setDescription("");
    setSellingPrice("");
    setFile("");
    setGST("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setProductName(userdata[index].productName);
    setLicenseType(userdata[index].licenseType);
    setSkuId(userdata[index].skuId);
    setDescription(userdata[index].description);
    setSellingPrice(userdata[index].sellingPrice);
    setFile(userdata[index].imageUrl);
    setGST(userdata[index].GST)
  };

  const handleDelete = async (index) => {
    try {
      const id = userdata[index]._id;
      await axios.delete(`https://cednwenlms.onrender.com/api/userdata/${id}`);
      setUsedata((prev) => prev.filter((_, i) => i !== index));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Enhanced filter logic
  const filteredData = userdata.filter((user) => {
    return (
      !searchTerm || // General search term
      (user.productName &&
        user.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.licenseType &&
        user.licenseType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.skuId &&
        user.skuId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.description &&
        user.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.sellingPrice && user.sellingPrice.toString().includes(searchTerm))
    );
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index); // Store the index to delete
    setShowConfirm(true); // Show confirmation popup
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

  const filtereddata = userdata.map(({ _id, __v, imageUrl, ...rest }) => rest);

  const HandleClose = () => {
    setIsOpen(false);
    setEditingIndex(null)
    setProductName("");
    setLicenseType("");
    setSkuId("");
    setDescription("");
    setSellingPrice("");
    setFile("");
    setGST("");

  }
  return (
    <div>
      <Sidebar />
      <main className="ml-60 flex-1 p-5 ">
        <Header name=" Products" />
        <section className="flex justify-end gap-4 mt-6 text-sm max-xl:text-xs font-normal">
          <div className="relative flex items-center border rounded-md px-3 py-[0.35rem] max-xl:py-[0.28rem] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#E84000] transition">
            <i className="fa-solid fa-filter  text-[#E84000]"></i>
            <input
              type="text"
              placeholder="Search Filter..."
              onChange={handleSearch}
              className="ml-2 border-none outline-none placeholder-gray-400  w-60 max-lg:w-40"
            />
          </div>
          <CSVLink data={filtereddata}>
            <button className="flex items-center px-4 py-[0.35rem] gap-2 text-[#505050] max-xl:py-[0.28rem] border rounded-md  transition duration-300">
              <i className="fa-solid fa-cloud-arrow-up text-[#E84000]"></i>
              Export
            </button>
          </CSVLink>
          <button
            onClick={toggleSection}
            className={`flex items-center px-4 py-[0.35rem] gap-2 rounded-md max-xl:py-[0.28rem] font-medium transition ${isOpen
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-[#E84000] text-white hover:bg-[#d33900]"
              }`}
          >
            <i className="fa-solid fa-circle-plus"></i>
            {isOpen ? "Close Form" : "Add Product"}
          </button>
        </section>

        {isOpen && (
          <div className="fixed max-xl:text-xs text-sm inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white border rounded-lg shadow-lg w-3/4 max-w-3xl">
              <div className="flex justify-between items-center p-5 border-b">
                <h1 className="font-semibold text-xl max-xl:text-lg text-[#E84000]">
                  {editingIndex !== null ? "Edit Product" : "New Product"}
                </h1>
                <button
                  onClick={HandleClose}
                  // onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
              {/* form */}
              <div className="p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] "
                      >
                        Product Name
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setProductName(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4] font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        required
                        value={productName}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] "
                      >
                        SKU Id
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setSkuId(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4]  font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        value={skuId}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] "
                      >
                        Product Description
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setDescription(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4]  font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        value={description}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="productName"
                        className="font-normal text-[#202020] "
                      >
                        Selling Price
                      </label>
                      <input
                        id="productName"
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4]  font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="text"
                        value={sellingPrice}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="licenseType"
                        className="font-normal text-[#202020] "
                      >
                        License Type
                      </label>
                      <select
                        id="licenseType"
                        onChange={(e) => setLicenseType(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4]  font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        value={licenseType}
                      >
                        <option value="" disabled>
                          Select License Type
                        </option>
                        <option value="Perpetual (Life-time)">
                          Perpetual (Life-time)
                        </option>
                        <option value="Subscription">Subscription</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="GST"
                        className="font-normal text-[#202020] "
                      >
                        GST %
                      </label>
                      <input
                        id="GST"
                        onChange={(e) => setGST(e.target.value)}
                        className="border px-3 py-[0.35rem] text-[#A1A7C4]  font-normal rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E84000]"
                        type="number"
                        value={GST}
                        placeholder="Enter GST%"

                      />
                    </div>
                  </div>
                  <div className="">
                    <div className="flex items-center rounded-md border border-gray-300">
                      {/* Hidden File Input */}
                      <input
                        id="file_input"
                        type="file"
                        accept="image/*"
                        name="image"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {/* Styled Button */}
                      <label
                        htmlFor="file_input"
                        className="flex items-center font-medium text-white  justify-center gap-3 px-4 py-[0.35rem] bg-[#E84000] rounded-md shadow cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upload Photo
                      </label>
                      {/* Helper Text */}
                      <span className="text-gray-500 ml-2 font-normal  ">
                        Upload profile photo
                      </span>
                    </div>
                    {/* Display Feedback */}
                    {file ? (
                      <p className="mt-1  text-gray-600">
                        <strong>{file.name}</strong>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  {file && (
                    <div>
                      <img
                        src={file}
                        alt="Uploaded"
                        className="w-32 h-20 object-cover rounded border mt-2"
                      />
                    </div>
                  )}
                  <div className="mt-0 flex justify-start gap-3">
                    <button
                      type="submit"
                      className="bg-[#E84000] text-white font-medium rounded-md px-5 py-2 h-10 max-xl:px-3 max-xl:py-1  w-full md:w-auto hover:bg-[#d03800] transition"
                    >
                      {editingIndex !== null ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <section className="mt-5">
          <div className="overflow-x-auto">
            <table className="min-w-[100%] table-auto rounded-lg shadow-sm border border-separate border-spacing-0">
              <thead className="bg-[#E84000] rounded-t-lg">
                <tr>
                  <th className="px-2 w-10 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium  text-left border-b border-gray-300 rounded-tl-lg">
                    Sr No.
                  </th>
                  <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300">
                    Product Name
                  </th>
                  <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300">
                    Product Description
                  </th>
                  <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300">
                    License Type
                  </th>
                  <th className="px-2 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300">
                    SKU id
                  </th>
                  <th className="px-2 w-32 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300">
                    selling Price
                  </th>
                  <th className="px-2 w-32 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300">
                    Refrence Doc.
                  </th>

                  <th className="px-2 w-20 py-[0.35rem] text-white text-sm max-xl:text-xs whitespace-nowrap font-medium text-left border-b border-gray-300 rounded-tr-lg"></th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(currentData) && currentData.length > 0 ? (
                  currentData.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-[#FFF5F2] border-gray-300"
                    >
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap  text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {user.productName}
                      </td>
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {user.description}
                      </td>
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {user.licenseType}
                      </td>
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {user.skuId}
                      </td>
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {user.sellingPrice}
                      </td>
                      <td className="px-2 py-[0.35rem] leading-3 whitespace-nowrap text-sm max-xl:text-xs text-[#5A607F] border-b border-gray-300">
                        {" "}
                        <img
                          className="w-16 h-8 object-cover rounded"
                          src={user.imageUrl}
                          alt="productImage"
                          srcset=""
                        />
                      </td>
                      <td className="px-2 leading-3  text-sm max-xl:text-xs whitespace-nowrap border-b text-center text-[#5A607F] border-gray-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(startIndex + index);
                            setIsOpen(true);
                          }}
                        >
                          <i class="fa-regular fa-pen-to-square  cursor-pointer pr-4"></i>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(startIndex + index);
                          }}
                        >
                          <i class="fa-regular fa-trash-can cursor-pointer"></i>
                        </button>
                      </td>

                      {showConfirm && (
                        <div className="fixed inset-0 bg-[#2424242a] bg-opacity-50 flex justify-center items-center">
                          <div className="bg-white p-6 rounded shadow-lg">
                            <p className="mb-4">
                              Are you sure you want to delete this Product?
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
                    </tr>

                  ))
                ) : (
                  <>
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center text-sm text-[#5A607F] py-5 border   rounded-md"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <img src={myImage} alt="Description" className="mb-2" />
                          <span>No Products Available.</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

          </div>
        </section>
        <div className="w-[100%] flex justify-between items-center mt-4 text-sm max-xl:text-xs font-normal">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-[0.35rem] max-xl:py-[0.25rem] font-normal rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-[#E84000] text-white"
              }`}
          >
            Previous
          </button>
          <div className="">
            <span className="text-base max-xl:text-sm font-medium">Page : </span>
            <select
              className="px-3 py-[0.35rem] max-xl:py-[0.20rem] max-xl:px-1 border rounded-md text-sm max-xl:text-xs focus:outline-none border-[#E84000]"
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
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-[0.35rem] max-xl:py-[0.25rem] rounded-md ${currentPage === totalPages
              ? "bg-gray-300"
              : "bg-[#E84000] text-white"
              }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Products;
