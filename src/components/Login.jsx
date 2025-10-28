import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { FiMail, FiLock, FiTrendingUp } from "react-icons/fi";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`http://localhost:1000/auth/login`, loginData, {
        withCredentials: true,
      });
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
      setLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) return <Navigate to="/products" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-6"
    >

      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Welcome Back</h2>
        <p className="text-center text-slate-500 mb-6">Login to access your account</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="pl-10 w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400" />
              <input
                name="password"
                type="password"
                required
                value={loginData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-10 w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition ${
              loading ? "bg-indigo-400" : "bg-[#f97316] hover:bg-[#f97316cc]"
            }`}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          New to LeadFlow?{" "}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
