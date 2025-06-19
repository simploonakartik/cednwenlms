import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ name }) {
  const [toggle, setToggle] = useState(false);
  const [userName, setUserName] = useState("");
  const [userimage, setUserimage] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserimage = localStorage.getItem("imageURL");
    if (storedUserimage) {
      setUserimage(storedUserimage);
    }
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const navigate = useNavigate();
  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("userName");
    localStorage.removeItem("imageURL");
  };
  

  return (
    <section className="flex justify-between items-center gap-6">
      <h2 className="text-2xl xl:text-3xl font-bold text-[#233B7C] text-center">
        {name}
      </h2>
      {/* <div className="flex flex-1 max-w-[70%] min-w-40">
        <input
          type="text"
          placeholder="Search..."
          className="w-96 bg-[#EAF1FB] px-5 py-2 border text-sm font-normal rounded-full  focus:outline-none focus:bg-[#fff5f233] focus:ring-1"
        />
      </div> */}
      <div className="relative flex flex-col items-start">
        <div
          onClick={handleToggle}
          className="flex items-center bg-white border border-gray-300 rounded-full px-2 py-1 cursor-pointer hover:shadow-md transition-shadow"
        >
          
        </div>
        {toggle && (
          <div
            onClick={handleLogout}
            className="absolute top-10 right-0 bg-white border border-gray-300 shadow-lg   rounded-lg py-1 px-4 z-10 cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <i class="fa-solid fa-user text-xs  xl:text-sm"></i>
              <span className=" text-gray-700 max-xl:text-xs text-sm font-medium">
                Profile
              </span>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <i class="fa-solid fa-arrow-right-from-bracket text-xs  xl:text-sm"></i>
              <span className=" text-gray-700 text-sm font-medium max-xl:text-xs  xl:text-sm">LogOut</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Header;
