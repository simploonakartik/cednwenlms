import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const [managerole, setManagerole] = useState({});
  const location = useLocation();
  const jobrole =
    location.state?.jobrole || localStorage.getItem("jobrole") || "";

  useEffect(() => {
    if (jobrole) {
      localStorage.setItem("jobrole", jobrole);
    }
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/manageroleData");
        const roleData = res.data.find((role) => role.roleName === jobrole);
        setManagerole(roleData || {});
      } catch (error) {
        console.error("Error fetching Job Role:", error);
        setManagerole({});
      }
    };  

    fetchData();
  }, [jobrole]);   

  const sidebarLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-square-poll-vertical" },
    {
      name: "Client Master",
      path: "/clientmaster",
      icon: "fa-users",
      permission: "manageClients",
    },
    {
      name: "Products",
      path: "/products",
      icon: "fa-cart-shopping",
      permission: "manageProducts",  
    },
    {
      name: "DCR",
      path: "/dcr",
      icon: "fa-cart-shopping",
      permission: "manageDCR",  
    },
    {
      name: "OPS",
      path: "/ops",
      icon: "fa-file-lines",
      permission: "manageOPS",
    },
    {
      name: "Orders",
      path: "/orders",
      icon: "fa-list-ul",
      permission: "manageOrder",
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: "fa-solid fa-flag",
      permission: "manageInvoice",
    },
    {
      name: "Users",
      path: "/users",
      icon: "fa-user-group",
      permission: "manageUser",
    },
    {
      name: "Department",
      path: "/Department",
      icon: "fa-solid fa-users-rectangle",
      permission: "manageDepartment",
    },
    {
      name: "Search",
      path: "/search",
      icon: "fa-solid fa-magnifying-glass",
    },
  ];

  const filteredLinks = sidebarLinks.filter(
    (link) => !link.permission || managerole?.[link.permission] === true
  );

  return (
    <div className="bg-[#FFF5F2] h-full fixed z-100 px-5 pt-8 border-r-2 border-[#E84000]">
      <div className="flex justify-center">
        <a href="/dashboard">
          <img
            className="shadow-md w-48"
            src="../../images/logo.png"
            alt="logo"
          />
        </a>
      </div>
      <div className="flex flex-col mt-5 gap-1 max-xl:text-sm text-base">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg  font-medium ${
                isActive
                  ? "bg-[#E84000] text-white shadow-md"
                  : "text-black hover:bg-[#E84000] hover:text-white"
              } transition-colors duration-200`
            }
          >
            <div className="flex gap-3 w-full align-middle px-4 py-2 rounded-lg items-center">
              <i className={`fa-solid ${link.icon}`}></i>
              <span className="font-medium">{link.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
