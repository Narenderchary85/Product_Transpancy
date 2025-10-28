import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiFileText, FiSearch, FiTrendingUp, FiLayers, FiTarget } from 'react-icons/fi';
import Navbar from './Navbar';

const Homepage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Dynamic Product Forms",
      description: "Collect detailed product data through smart, multi-step forms that adapt based on user input.",
      icon: <FiLayers className="text-2xl" />,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "AI-Driven Follow-up Questions",
      description: "Use intelligent logic to generate meaningful follow-up questions powered by LLM models.",
      icon: <FiSearch className="text-2xl" />,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Transparency Report Generation",
      description: "Instantly generate structured Product Transparency Reports in downloadable PDF format.",
      icon: <FiFileText className="text-2xl" />,
      color: "from-orange-600 to-red-500"
    },
    {
      title: "Data Insights & Scoring",
      description: "Get analytics and transparency scoring to evaluate ethical, sustainable, and health-first standards.",
      icon: <FiTrendingUp className="text-2xl" />,
      color: "from-yellow-500 to-orange-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 overflow-hidden">
      <Navbar />

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-orange-900 mb-6"
            >
              Build Trust Through Transparency
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-orange-700 max-w-3xl mx-auto mb-10"
            >
              Altibbe | Hedamo helps companies collect detailed product data, generate transparency reports, and empower ethical, health-first decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg shadow-orange-200 hover:shadow-orange-300 flex items-center"
                >
                  Login
                </motion.button>
              </Link>

              <Link to="/signup">
                <button className="bg-white text-orange-800 border border-orange-200 hover:border-orange-400 px-6 py-3 rounded-lg font-medium transition flex items-center shadow-sm">
                  Sign Up
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-60 -left-32 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-orange-900 mb-4"
            >
              Smarter Product Transparency Tools
            </motion.h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Everything your company needs to build credible, transparent, and trust-based product insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border border-orange-100 transition-all cursor-pointer ${
                    activeFeature === index ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mr-4`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-orange-900 mb-2">{feature.title}</h3>
                      <p className="text-orange-700">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-80 bg-orange-50 rounded-xl overflow-hidden relative shadow-inner"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 bg-white rounded-lg shadow-lg p-4 border border-orange-100">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 bg-orange-200 rounded w-1/4"></div>
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <FiTarget className="text-orange-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="h-20 bg-orange-50 rounded-lg p-3">
                        <div className="h-4 bg-orange-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-orange-600 rounded w-3/4"></div>
                      </div>
                      <div className="h-20 bg-amber-50 rounded-lg p-3">
                        <div className="h-4 bg-amber-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-amber-500 rounded w-2/3"></div>
                      </div>
                      <div className="h-20 bg-yellow-50 rounded-lg p-3">
                        <div className="h-4 bg-yellow-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-yellow-600 rounded w-1/2"></div>
                      </div>
                    </div>

                    <div className="h-32 bg-orange-50 rounded-lg p-3">
                      <div className="flex justify-between mb-3">
                        <div className="h-4 bg-orange-200 rounded w-1/4"></div>
                        <div className="h-4 bg-orange-200 rounded w-1/6"></div>
                      </div>
                      <div className="flex items-end h-20 space-x-1">
                        {[30, 50, 70, 90, 60, 40, 80].map((height, index) => (
                          <div
                            key={index}
                            className={`flex-1 rounded-t ${
                              activeFeature === 0
                                ? 'bg-orange-500'
                                : activeFeature === 1
                                ? 'bg-amber-500'
                                : activeFeature === 2
                                ? 'bg-orange-600'
                                : 'bg-yellow-500'
                            }`}
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-orange-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-orange-600 p-2 rounded-lg mr-3">
                  <FiCheckCircle className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold">Altibbe | Hedamo</span>
              </div>
              <p className="text-orange-200">
                Empowering companies to build trust through transparency and ethical product insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-orange-200">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-orange-200">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-orange-200">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-300">
            <p>© {new Date().getFullYear()} Altibbe | Hedamo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
