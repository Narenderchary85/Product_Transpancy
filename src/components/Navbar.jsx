import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLayers, FiUser, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 py-4 relative shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Altibbe
            </span>
          </div>
        </Link>

      
        <div className="flex items-center space-x-4 relative">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-orange-600 font-medium"
              >
                Login
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          ) : (
            <>
              <div className="relative">
              <div className="flex gap-5">
              <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <FiUser className="text-slate-700 text-xl" />
                </button>

                <Link to="/addproduct">
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md"
                >
                  Add Product
                </motion.button>
              </Link>
              </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 p-4">
                    <p className="font-semibold text-slate-700">{user.name}</p>
                    <p className="text-sm text-slate-500 mb-2">{user.email}</p>
                    <hr className="my-2" />
                   
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-800 w-full"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
