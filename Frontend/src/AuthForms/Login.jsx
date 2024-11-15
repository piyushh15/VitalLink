import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${process.env.BACKEND_API}/users/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const { user, accessToken, refreshToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("UserId", user._id);
      
      if (user.isAdmin) {
        navigate("/adminpanel");
      } else {
        navigate("/doctorpanel");
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0575E6] to-[#021B79] flex items-center justify-center font-poppins">
      <div className="relative p-6 sm:max-w-xl w-full ">
        <div className="relative w-full bg-slate-200 text-black backdrop-filter border border-slate-300 backdrop-blur-lg rounded-3xl pb-4 px-8">
          <h1 className="text-3xl pt-8 text-center font-semibold font-poppins">
            Welcome Back
          </h1>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 transition-all duration-500 ease-in-out opacity-95">
             
              <div>
                <label htmlFor="username"className="block text-sm font-medium leading-6 text-black">
                  Username
                </label>
                <input id="username" name="username" type="text"
                  className="mt-2 block w-full px-4 py-2 rounded-md bg-slate-300 text-black shadow-sm focus:ring-2 focus:ring-blue-600"
                  value={credentials.username}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password"className="block text-sm font-medium leading-6 text-black">
                  Password
                </label>
                <input id="password"name="password"type="password"
                  className="mt-2 block w-full px-4 py-2 rounded-md bg-slate-300 text-black shadow-sm focus:ring-2 focus:ring-blue-600"
                  value={credentials.password}onChange={onChange}required/>
              </div>

              <div className="col-span-2">
                <button type="submit"
                  className="w-full rounded-md bg-[#0575e6] px-4 py-2 text-white shadow-md hover:bg-[#059ae6] transition-all duration-200" >
                  Submit
                </button>
              </div>
            </div>
          </form>

          <p className="mt-4 text-center text-black">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
