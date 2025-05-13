import React, { useEffect, useRef, useState } from "react";
import Stays from "../components/Services/Stays";
import Flights from "../components/Services/Flights";
import Packages from "../components/Services/Packages";
import Things from "../components/Services/Things";
import Cars from "../components/Services/Cars";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../redux/tab/tabSlice";
import SearchData from "../components/SearchData";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion, AnimatePresence } from "framer-motion";
import Favorites from "../components/Favorites";
import Destinations from "../components/Destinations";
import Explore from "../components/Explore";

import { Home as HomeIcon, Plane, Car, Package, Map } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tab.activeTab);
  const indicatorRef = useRef();
  const tabContainerRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const OpenTab = (tabName) => {
    dispatch(setActiveTab(tabName.toLowerCase().replace(/\s+/g, "-")));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll(".tab-item");
    const activeTabElement = Array.from(tabs).find(
      (tab) => tab.getAttribute("data-tab").toLowerCase() === activeTab
    );

    if (activeTabElement && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [activeTab]);

  const tabs = [
    { name: "Stays", icon: <HomeIcon size={18} /> },
    { name: "Flights", icon: <Plane size={18} /> },
    { name: "Cars", icon: <Car size={18} /> },
    { name: "Packages", icon: <Package size={18} /> },
    { name: "Things to do", icon: <Map size={18} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-12"
    >
      <div className="w-full bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Journey
            </h1>
            <p className="text-lg sm:text-xl opacity-90 mb-6">
              Discover amazing places, best deals, and unforgettable experiences
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg mb-12 overflow-hidden"
        >
          <div
            className="flex justify-center items-center border-b relative overflow-x-auto"
            ref={tabContainerRef}
          >
            {tabs.map((tab) => (
              <div
                key={tab.name}
                data-tab={tab.name.toLowerCase().replace(/\s+/g, "-")}
                className={`tab-item py-4 px-5 cursor-pointer transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.name.toLowerCase().replace(/\s+/g, "-")
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => OpenTab(tab.name)}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </div>
            ))}

            {/* Underline indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-1 bg-blue-600 rounded-t-full transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Tab Contents with Animation */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "stays" && <Stays />}
                {activeTab === "flights" && <Flights />}
                {activeTab === "cars" && <Cars />}
                {activeTab === "packages" && <Packages />}
                {activeTab === "things-to-do" && <Things />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Recent Searches */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Searches
            </h2>
            <SearchData />
          </motion.div>

          {/* Favorite Stays */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Favorites
            </h2>
            <Favorites />
          </motion.div>

          {/* Destinations */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Popular Destinations
            </h2>
            <Destinations />
          </motion.div>

          {/* Explore */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Explore The World
            </h2>
            <Explore />
          </motion.div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default Home;
