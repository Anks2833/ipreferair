import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Globe,
  Search,
  X,
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  FaHotel,
  FaPlane,
  FaCar,
  FaSuitcase,
  FaMapMarkedAlt,
  FaPercent,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { countries } from "../Data/Locations.jsx";
import { setActiveTab } from "../redux/tab/tabSlice.js";
import { signOutSuccess } from "../redux/user/userSlice.js";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState(false);
  const [sidebarServices, setSidebarServices] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [profile, setProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();

  const sidebarRef = useRef(null);
  const servicesRef = useRef(null);
  const sidebarServicesRef = useRef(null);
  const languageRef = useRef(null);
  const profileRef = useRef();

  // Check if we're scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleProfile = () => {
    setProfile(!profile);
  };

  const toggleServices = () => {
    setServices(!services);
  };

  const toggleSidebarServices = () => {
    setSidebarServices(!sidebarServices);
  };

  const toggleSidebar = () => {
    if (sidebarServices === true) {
      setSidebarServices(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await axios.post(
        "/api/user/signout",
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        console.log(res.data.message);
        dispatch(signOutSuccess());
        window.scrollTo(0, 0);
      } else {
        console.error("Unexpected response:", res.data.message);
      }
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
  };

  useEffect(() => {
    const closeSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServices(false);
      }

      if (
        sidebarServicesRef.current &&
        !sidebarServicesRef.current.contains(event.target)
      ) {
        setSidebarServices(false);
      }

      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageModal(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfile(false);
      }
    };

    document.addEventListener("mousedown", closeSidebar);

    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, []);

  const handleServiceClick = (service) => {
    dispatch(setActiveTab(service));
  };

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { x: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const profileDropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <nav ref={sidebarRef}>
      <div
        className={`px-4 sm:px-6 lg:px-20 py-4 flex justify-between items-center fixed top-0 w-full z-[10000] transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center gap-8">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-1"
            onClick={() => {
              setIsOpen(false);
              setServices(false);
            }}
          >
            <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              ipreferstay
            </div>
          </Link>

          {/* Services Dropdown Section */}
          <div className="relative" ref={servicesRef}>
            <button
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
              onClick={toggleServices}
            >
              <Briefcase size={16} />
              <span>Services</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  services ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Services Dropdown Menu */}
            <AnimatePresence>
              {services && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 bg-white rounded-xl shadow-xl lg:flex flex-col overflow-hidden border border-gray-100 w-64"
                >
                  {/* Service Options */}
                  <div className="flex flex-col w-full">
                    {/* Stays Service */}
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        toggleServices();
                        handleServiceClick("stays");
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <FaHotel className="text-lg" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Stays</p>
                        <p className="text-xs text-gray-500">
                          Hotels & apartments
                        </p>
                      </div>
                    </Link>

                    {/* Flights Service */}
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        toggleServices();
                        handleServiceClick("flights");
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <FaPlane className="text-lg" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Flights</p>
                        <p className="text-xs text-gray-500">
                          Search & book flights
                        </p>
                      </div>
                    </Link>

                    {/* Cars Service */}
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        toggleServices();
                        handleServiceClick("cars");
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <FaCar className="text-lg" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Cars</p>
                        <p className="text-xs text-gray-500">Rent vehicles</p>
                      </div>
                    </Link>

                    {/* Packages Service */}
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        toggleServices();
                        handleServiceClick("packages");
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <FaSuitcase className="text-lg" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Packages</p>
                        <p className="text-xs text-gray-500">
                          Flight + Hotel bundles
                        </p>
                      </div>
                    </Link>

                    {/* Things to do Service */}
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        toggleServices();
                        handleServiceClick("things-to-do");
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <FaMapMarkedAlt className="text-lg" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Things to do
                        </p>
                        <p className="text-xs text-gray-500">
                          Tours & activities
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Additional Links */}
                  <div className="border-t border-gray-100 mt-1">
                    <Link
                      to="/deals"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors"
                      onClick={toggleServices}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                        <FaPercent className="text-lg" />
                      </div>
                      <span className="font-medium text-gray-800">
                        Deals & Offers
                      </span>
                    </Link>
                    <Link
                      to="/meeting"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors"
                      onClick={toggleServices}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <FaUsers className="text-lg" />
                      </div>
                      <span className="font-medium text-gray-800">
                        Groups & Meetings
                      </span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Language Selector, Links, Notifications, and Profile */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language Selector */}
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm"
            onClick={() => setLanguageModal(!languageModal)}
          >
            <Globe size={16} />
            <span>English</span>
          </button>

          {/* Links */}
          {/* <Link
            to="/property"
            className="px-3 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm"
          >
            List your property
          </Link> */}

          {/* <Link
            to="/trips"
            className="px-3 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm"
          >
            Trips
          </Link> */}

          {/* <Link
            to="/notifications"
            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 relative"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              2
            </span>
          </Link> */}

          {/* Profile Section */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="font-medium text-sm text-gray-800">
                  {currentUser.firstName}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${
                    profile ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profile && (
                  <motion.div
                    variants={profileDropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.profilePicture}
                          alt="profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {currentUser.firstName} {currentUser.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfile(false)}
                      >
                        <User size={18} className="text-gray-500" />
                        <span className="text-gray-700">My Account</span>
                      </Link>

                      {currentUser.isAdmin && (
                        <Link
                          to="/Dashboard?tab=collection"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setProfile(false)}
                        >
                          <Settings size={18} className="text-gray-500" />
                          <span className="text-gray-700">Dashboard</span>
                        </Link>
                      )}

                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                        onClick={handleSignOut}
                      >
                        <LogOut size={18} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/signin"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200 text-sm font-medium"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-[9999] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.aside
              ref={sidebarServicesRef}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 w-80 max-w-full h-full bg-white shadow-xl overflow-y-auto z-[10000]"
            >
              {/* Mobile Sidebar Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link
                  to="/"
                  className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                  onClick={toggleSidebar}
                >
                  ipreferstay
                </Link>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={toggleSidebar}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation menu */}
              <div className="p-4">
                {/* User Profile or Sign In */}
                {currentUser ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={currentUser.profilePicture}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        className="px-4 py-2 bg-white rounded-lg text-center text-sm font-medium text-gray-700 border border-gray-200 shadow-sm"
                        onClick={toggleSidebar}
                      >
                        My Account
                      </Link>
                      <button
                        className="px-4 py-2 bg-red-50 rounded-lg text-center text-sm font-medium text-red-600 border border-red-100"
                        onClick={() => {
                          handleSignOut();
                          toggleSidebar();
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Link
                      to="/signin"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center font-medium"
                      onClick={toggleSidebar}
                    >
                      Sign in
                    </Link>
                  </div>
                )}

                {/* Services Accordion */}
                <div className="mb-4">
                  <button
                    className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg text-gray-800 font-medium"
                    onClick={toggleSidebarServices}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} />
                      <span>View services</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        sidebarServices ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Services Dropdown for Mobile */}
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate={sidebarServices ? "open" : "closed"}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-1 pl-2">
                      {/* Stays */}
                      <Link
                        to="/"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={() => {
                          toggleSidebar();
                          handleServiceClick("stays");
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <FaHotel className="text-lg" />
                        </div>
                        <span>Stays</span>
                      </Link>

                      {/* Flights */}
                      <Link
                        to="/"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={() => {
                          toggleSidebar();
                          handleServiceClick("flights");
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                          <FaPlane className="text-lg" />
                        </div>
                        <span>Flights</span>
                      </Link>

                      {/* Cars */}
                      <Link
                        to="/"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={() => {
                          toggleSidebar();
                          handleServiceClick("cars");
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
                          <FaCar className="text-lg" />
                        </div>
                        <span>Cars</span>
                      </Link>

                      {/* Packages */}
                      <Link
                        to="/"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={() => {
                          toggleSidebar();
                          handleServiceClick("packages");
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                          <FaSuitcase className="text-lg" />
                        </div>
                        <span>Packages</span>
                      </Link>

                      {/* Things to do */}
                      <Link
                        to="/"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={() => {
                          toggleSidebar();
                          handleServiceClick("things-to-do");
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600">
                          <FaMapMarkedAlt className="text-lg" />
                        </div>
                        <span>Things to do</span>
                      </Link>

                      {/* Deals */}
                      <Link
                        to="/deals"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={toggleSidebar}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                          <FaPercent className="text-lg" />
                        </div>
                        <span>Deals</span>
                      </Link>

                      {/* Groups & meetings */}
                      <Link
                        to="/meeting"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        onClick={toggleSidebar}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                          <FaUsers className="text-lg" />
                        </div>
                        <span>Groups & meetings</span>
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Language Selector for Mobile */}
                <button
                  className="flex items-center gap-2 p-3 mb-4 w-full rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    toggleSidebar();
                    setLanguageModal(!languageModal);
                  }}
                >
                  <Globe size={18} className="text-gray-600" />
                  <span>Language: English</span>
                </button>

                {/* Footer Links for Mobile */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <Link
                    to="/property"
                    className="block p-3 rounded-lg hover:bg-gray-50"
                    onClick={toggleSidebar}
                  >
                    List your property
                  </Link>
                  <Link
                    to="/trips"
                    className="block p-3 rounded-lg hover:bg-gray-50"
                    onClick={toggleSidebar}
                  >
                    My trips
                  </Link>
                  <Link
                    to="/notifications"
                    className="block p-3 rounded-lg hover:bg-gray-50"
                    onClick={toggleSidebar}
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/feedback"
                    className="block p-3 rounded-lg hover:bg-gray-50"
                    onClick={toggleSidebar}
                  >
                    Send feedback
                  </Link>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {languageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl p-6 bg-white w-96 max-w-[90%] shadow-xl"
              ref={languageRef}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Language settings
                </h3>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={() => setLanguageModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Region dropdown */}
              <div className="mb-4">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Region
                </label>
                <div className="relative">
                  <select
                    id="travelDocument.country"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {countries.map((country, i) => (
                      <option key={i} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Language dropdown */}
              <div className="mb-4">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Language
                </label>
                <div className="relative">
                  <select
                    id="travelDocument.language"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {countries.map((country, i) => (
                      <option key={i} value={country.language}>
                        {country.language}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Currency dropdown */}
              <div className="mb-6">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Currency
                </label>
                <div className="relative">
                  <select
                    id="currency"
                    disabled
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-8 bg-gray-50 text-gray-500 appearance-none focus:outline-none"
                  >
                    <option value="$ USD">$ USD</option>
                    <option value="€ EURO">€ EURO</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setLanguageModal(false)}
              >
                Save changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
