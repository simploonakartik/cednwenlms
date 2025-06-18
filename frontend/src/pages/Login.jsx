import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminData, setadminData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/adminData");
        setadminData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
console.log("kk",adminData)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = adminData.find(
      (admin) => admin.emailId === email && admin.password === password
    );
    console.log(user);
    if (!user) {
      alert("Email or Password are not found");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/login", { email, password });
      console.log("successfull");
      localStorage.setItem("userName", user.userName);
      localStorage.setItem("imageURL", user.imagefile);
      // Navigate to dashboard with user role
      toast.success("Login Successful..")
      navigate("/dashboard", { state: { jobrole: user.jobrole } });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center  min-h-screen bg-gray-100">
        <div className="bg-white p-12 rounded-2xl shadow-lg border border-[#E84000] w-[500px]">
          <div className="mb-6 flex justify-center">
            <img src="./images/logo.png" alt="Logo" className="h-16 w-auto" />
          </div>

          <h2 className="text-2xl font-semibold text-[#233B7C] mb-6 text-center">
            Welcome Back!
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 ">
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-[#202020] text-start"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-[0.35rem]  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#E84000] "
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-start  text-lg font-semibold text-[#202020]"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 py-[0.35rem] text-sm mt-1 font-normal text-[#202020] w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000] pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 ${showMessage ? "top-[55%]" : "top-[75%]"
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
            </div>

            <button
              type="submit"
              className="w-full bg-[#E84000] text-white text-lg font-semibold py-3 rounded-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
