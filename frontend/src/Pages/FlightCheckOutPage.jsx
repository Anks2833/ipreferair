import {
  CheckCheck,
  ChevronDown,
  CreditCard,
  Wallet,
  Shield,
  Plane,
  Clock,
  Calendar,
  User,
  Phone,
  Flag,
  Check,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DebitCard from "../components/DebitCard";
import ClickToPay from "../components/ClickToPay";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listItems, subListItems } from "../Data/ListItems";
import { countries } from "../Data/Locations.jsx";
import { SyncLoader } from "react-spinners";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { motion, AnimatePresence } from "framer-motion";

const FlightCheckOutPage = () => {
  // React router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Redux hooks
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // State management
  const [receiveSMS, setRecieveSMS] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [visible, setVisible] = useState("debit-card");
  const [validationError, setValidationError] = useState(false);
  const [activeSection, setActiveSection] = useState("traveler-details");

  // Refs
  const indicatorRef = useRef(null);
  const tabContainerRef = useRef(null);
  const travelerFormRef = useRef(null);
  const paymentFormRef = useRef(null);

  // Extract flight, tax, and total values
  const { flight, tax, total } = location.state || {};

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  // Populate form data with user info
  useEffect(() => {
    if (currentUser) {
      const userData = {
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        middleName: currentUser.middleName || "",
        number: currentUser.number || "",
        countryCode: currentUser.countryCode || "",
        DOB: currentUser.DOB || "",
        travelDocument: {
          country: currentUser.travelDocument?.country || "",
        },
      };
      setFormData(userData);
    }
  }, [currentUser]);

  // Handle debit card form changes
  const handleDebitCardChange = (updatedData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  // Handle validation error changes
  const handleValidateError = (hasError) => {
    setValidationError(hasError);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      const keys = id.split(".");
      let updatedData = { ...prev };

      let currentLevel = updatedData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          currentLevel[key] = value;
        } else {
          currentLevel[key] = { ...currentLevel[key] };
          currentLevel = currentLevel[key];
        }
      });

      return updatedData;
    });
  };

  // Handle phone number input
  const handleNumberChange = (e) => {
    const { value } = e.target;
    const isValid = /^\d*$/.test(value);
    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        number: value,
      }));
    }
  };

  // Validate date of birth
  const isValidDOB = (month, day, year) => {
    if (!month || !day || !year) return false;

    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    if (
      isNaN(m) ||
      isNaN(d) ||
      isNaN(y) ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31 ||
      y < 1900 ||
      y > new Date().getFullYear() - 16
    ) {
      return false;
    }

    const date = new Date(y, m - 1, d);
    return (
      date.getMonth() + 1 === m &&
      date.getDate() === d &&
      date.getFullYear() === y
    );
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setRecieveSMS(!receiveSMS);
  };

  // Handle tab switching
  const OpenTab = (tabname) => {
    setVisible(tabname);
  };

  // Handle section navigation
  const handleSectionChange = (section) => {
    if (section === "payment" && !validateTravelerForm()) {
      setUpdateUserError(
        "Please complete all required fields in traveler details"
      );
      return;
    }

    setActiveSection(section);

    // Scroll to the appropriate section
    setTimeout(() => {
      if (section === "traveler-details" && travelerFormRef.current) {
        travelerFormRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (section === "payment" && paymentFormRef.current) {
        paymentFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Validate traveler form
  const validateTravelerForm = () => {
    if (!formData.firstName || !formData.lastName) {
      return false;
    }

    if (!/^\d{10,15}$/.test(formData.number)) {
      return false;
    }

    const [month, day, year] = formData.DOB?.split("/") || [];
    if (!isValidDOB(month, day, year)) {
      return false;
    }

    return true;
  };

  // Update tab indicator
  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll(".tab-item");
    const activeTab = Array.from(tabs).find(
      (tab) => tab.getAttribute("data-tab") === visible
    );

    if (activeTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]);

  // Clear success/error messages after delay
  useEffect(() => {
    if (updateUserSuccess || updateUserError) {
      const timer = setTimeout(() => {
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateUserSuccess, updateUserError]);

  // Helper functions for flight data
  const getFlightDuration = (flight) => {
    const segments = flight.itineraries[0]?.segments;
    const departureTime = new Date(segments[0].departure.at).getTime();
    const arrivalTime = new Date(
      segments[segments.length - 1].arrival.at
    ).getTime();
    return (arrivalTime - departureTime) / (1000 * 60);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getArrivalDate = (flight) => {
    const segments = flight.itineraries[0]?.segments;
    const departureTime = new Date(segments[0].departure.at).getTime();
    const flightDurationInMinutes = getFlightDuration(flight);

    const arrivalTime = departureTime + flightDurationInMinutes * 60 * 1000;
    return new Date(arrivalTime);
  };

  const arrivalDate = flight ? getArrivalDate(flight) : null;

  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(date));

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const formatDay = (dateString) => {
    const options = { weekday: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const formatWord = (word) => {
    return word?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // Validation checks
    if (!formData.firstName || !formData.lastName) {
      setUpdateUserError("Please fill in all required fields.");
      return;
    }

    if (!/^\d{10,15}$/.test(formData.number)) {
      setUpdateUserError("Please enter a valid phone number.");
      return;
    }

    const [month, day, year] = formData.DOB?.split("/") || [];
    if (!isValidDOB(month, day, year)) {
      setUpdateUserError("Please provide a valid Date of Birth.");
      return;
    }

    if (validationError) {
      setUpdateUserError(
        "Please fix the highlighted errors before submitting."
      );
      return;
    }

    try {
      dispatch(updateStart());
      setLoading(true);

      const res = await fetch(`/api/user/book/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, flight }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        setLoading(false);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Update successful");
        setLoading(false);

        setTimeout(() => {
          navigate("/booking-completed");
        }, 3000);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
      setLoading(false);
    }
  };

  // If flight, tax, or total data is missing, navigate back
  if (!flight || !tax || !total) {
    navigate(-1);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Checkout Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeSection === "traveler-details"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-2 border-blue-600"
                }`}
              >
                <User size={20} />
              </div>
              <span
                className={`text-sm font-medium ${
                  activeSection === "traveler-details"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Traveler Details
              </span>
            </div>

            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div
                className={`h-full bg-blue-600 transition-all duration-500 ${
                  activeSection === "payment" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeSection === "payment"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-400 border-2 border-gray-300"
                }`}
              >
                <CreditCard size={20} />
              </div>
              <span
                className={`text-sm font-medium ${
                  activeSection === "payment"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Flight Summary Card - Mobile Only */}
              <div className="lg:hidden">
                <FlightSummaryCard
                  flight={flight}
                  total={total}
                  formatWord={formatWord}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  formatDay={formatDay}
                  arrivalDate={arrivalDate}
                  getFlightDuration={getFlightDuration}
                  formatDuration={formatDuration}
                />
              </div>

              {/* Traveler Details Section */}
              <motion.div
                ref={travelerFormRef}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`}
              >
                <div className="border-b border-gray-200 bg-blue-50 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <User size={22} className={`text-blue-600`} />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Traveler Details
                    </h2>
                  </div>

                  {activeSection === "payment" && (
                    <button
                      type="button"
                      onClick={() => handleSectionChange("traveler-details")}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {activeSection === "traveler-details" && (
                    <motion.div
                      variants={sectionVariants}
                      initial="visible"
                      animate="visible"
                      exit="hidden"
                      className="p-6"
                    >
                      <div className="flex flex-col gap-6">
                        <div className="text-gray-600 text-sm">
                          <p>
                            * Traveler names must match government-issued photo
                            ID exactly.
                          </p>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col gap-1.5">
                            <label
                              htmlFor="firstName"
                              className="text-sm font-medium text-gray-700"
                            >
                              First name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              placeholder="Enter first name"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label
                              htmlFor="middleName"
                              className="text-sm font-medium text-gray-700"
                            >
                              Middle name{" "}
                              <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                              type="text"
                              id="middleName"
                              placeholder="Enter middle name"
                              value={formData.middleName}
                              onChange={handleChange}
                              className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label
                              htmlFor="lastName"
                              className="text-sm font-medium text-gray-700"
                            >
                              Last name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              placeholder="Enter last name"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-5">
                          <h3 className="font-medium">Contact Information</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                              <label
                                htmlFor="countryCode"
                                className="text-sm font-medium text-gray-700"
                              >
                                Country/Territory Code{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Flag size={18} className="text-gray-500" />
                                </div>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                                <select
                                  id="countryCode"
                                  value={formData.countryCode}
                                  onChange={handleChange}
                                  required
                                  className="appearance-none rounded-lg border border-gray-300 w-full py-3 pl-10 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                >
                                  <option value="" disabled>
                                    Select country code
                                  </option>
                                  {countries.map((country, i) => (
                                    <option key={i} value={country.phone_code}>
                                      {country.name} ({country.phone_code})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label
                                htmlFor="number"
                                className="text-sm font-medium text-gray-700"
                              >
                                Phone number{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Phone size={18} className="text-gray-500" />
                                </div>
                                <input
                                  type="text"
                                  id="number"
                                  placeholder="Enter phone number"
                                  value={
                                    formData.number !== "Not provided"
                                      ? formData.number
                                      : ""
                                  }
                                  onChange={handleNumberChange}
                                  required
                                  className="rounded-lg border border-gray-300 w-full py-3 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                id="receiveSMS"
                                checked={receiveSMS}
                                onChange={handleCheckboxChange}
                                className="sr-only"
                              />
                              <label
                                htmlFor="receiveSMS"
                                className="flex items-center cursor-pointer gap-3"
                              >
                                <div
                                  className={`relative w-5 h-5 flex items-center justify-center rounded-md border-2 transition-colors ${
                                    receiveSMS
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {receiveSMS && (
                                    <Check size={16} className="text-white" />
                                  )}
                                </div>
                                <span className="text-gray-700 text-sm">
                                  Receive text alerts about this trip.
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Travel Document Information */}
                        <div className="space-y-5 border-t border-gray-100 pt-5">
                          <h3 className="font-medium">
                            Travel Document Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                              <label
                                htmlFor="travelDocument.country"
                                className="text-sm font-medium text-gray-700"
                              >
                                Passport Country{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Flag size={18} className="text-gray-500" />
                                </div>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                                <select
                                  id="travelDocument.country"
                                  value={formData.travelDocument?.country}
                                  onChange={handleChange}
                                  required
                                  className="appearance-none rounded-lg border border-gray-300 w-full py-3 pl-10 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                >
                                  <option value="" disabled>
                                    Select passport country
                                  </option>
                                  {countries.map((country, i) => (
                                    <option key={i} value={country.name}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-sm font-medium text-gray-700">
                                Date of Birth{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar
                                      size={16}
                                      className="text-gray-500"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="MM"
                                    value={
                                      formData.DOB === "Not provided"
                                        ? ""
                                        : formData.DOB?.split("/")[0]
                                    }
                                    maxLength={2}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      );
                                      setFormData((prev) => ({
                                        ...prev,
                                        DOB: `${value}/${
                                          prev.DOB?.split("/")[1] || ""
                                        }/${prev.DOB?.split("/")[2] || ""}`,
                                      }));
                                    }}
                                    className="rounded-lg border border-gray-300 w-full py-3 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                  />
                                </div>

                                <input
                                  type="text"
                                  placeholder="DD"
                                  maxLength={2}
                                  value={formData.DOB?.split("/")[1] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      DOB: `${
                                        prev.DOB?.split("/")[0] || ""
                                      }/${value}/${
                                        prev.DOB?.split("/")[2] || ""
                                      }`,
                                    }));
                                  }}
                                  className="rounded-lg border border-gray-300 w-full py-3 px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                />

                                <input
                                  type="text"
                                  placeholder="YYYY"
                                  maxLength={4}
                                  value={formData.DOB?.split("/")[2] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      DOB: `${prev.DOB?.split("/")[0] || ""}/${
                                        prev.DOB?.split("/")[1] || ""
                                      }/${value}`,
                                    }));
                                  }}
                                  className="rounded-lg border border-gray-300 w-full py-3 px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Must be at least 16 years old
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSectionChange("payment")}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                ref={paymentFormRef}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`}
              >
                <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CreditCard
                      size={22}
                      className={`${
                        activeSection === "payment"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <h2
                      className={`text-lg font-semibold ${
                        activeSection === "payment"
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      Payment Method
                    </h2>
                  </div>
                </div>

                <AnimatePresence>
                  {activeSection === "payment" && (
                    <motion.div
                      variants={sectionVariants}
                      initial="visible"
                      animate="visible"
                      exit="hidden"
                      className="p-6"
                    >
                      <div className="flex flex-col gap-6">
                        {/* Payment Method Tabs */}
                        <div className="flex flex-col gap-4">
                          <div
                            className="relative border-b border-gray-200"
                            ref={tabContainerRef}
                          >
                            <div className="flex">
                              <button
                                type="button"
                                className={`tab-item relative flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                                  visible === "debit-card"
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                                onClick={() => OpenTab("debit-card")}
                                data-tab="debit-card"
                              >
                                <CreditCard size={18} />
                                <span>Debit Card</span>
                              </button>

                              <button
                                type="button"
                                className={`tab-item relative flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                                  visible === "click-to-pay"
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                                onClick={() => OpenTab("click-to-pay")}
                                data-tab="click-to-pay"
                              >
                                <Wallet size={18} />
                                <span>Click to Pay</span>
                              </button>
                            </div>

                            <div
                              ref={indicatorRef}
                              className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out"
                            />
                          </div>

                          <div className="mt-4">
                            {visible === "debit-card" && (
                              <DebitCard
                                onDataChange={handleDebitCardChange}
                                onValidationError={handleValidateError}
                              />
                            )}
                            {visible === "click-to-pay" && <ClickToPay />}
                          </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-medium text-gray-800 mb-3">
                            Review and Confirm
                          </h3>

                          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 mb-4">
                            {listItems.map((item, index) => (
                              <React.Fragment key={index}>
                                <li>
                                  {item}
                                  {index === 2 && (
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-500">
                                      {subListItems.map((subItem, i) => (
                                        <li key={i}>{subItem}</li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              </React.Fragment>
                            ))}
                          </ol>

                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <Shield
                              size={16}
                              className="flex-shrink-0 mt-0.5 text-blue-600"
                            />
                            <p>
                              By clicking on "Complete Booking", I acknowledge
                              that I have reviewed the{" "}
                              <Link
                                to="/policy"
                                className="text-blue-600 hover:underline"
                              >
                                Privacy Statement
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/user-data-deletion-policy"
                                className="text-blue-600 hover:underline"
                              >
                                User data policy
                              </Link>
                              .
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row-reverse gap-3 justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg ${
                              loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            } text-white transition-colors`}
                          >
                            {loading ? (
                              <SyncLoader
                                color="#fff"
                                loading={loading}
                                size={6}
                                margin={3}
                              />
                            ) : (
                              <>
                                <span>Complete Booking</span>
                                <Check size={16} />
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleSectionChange("traveler-details")
                            }
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                          >
                            Back to Traveler Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {updateUserError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 max-w-md"
                >
                  <AlertCircle size={20} />
                  <span>{updateUserError}</span>
                </motion.div>
              )}

              {updateUserSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 max-w-md"
                >
                  <Check size={20} />
                  <span>{updateUserSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Flight Summary */}
          <div className="w-full lg:w-96 xl:w-[420px] flex-shrink-0 hidden lg:block">
            <div className="sticky top-28">
              <FlightSummaryCard
                flight={flight}
                total={total}
                formatWord={formatWord}
                formatDate={formatDate}
                formatTime={formatTime}
                formatDay={formatDay}
                arrivalDate={arrivalDate}
                getFlightDuration={getFlightDuration}
                formatDuration={formatDuration}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Flight Summary Card Component
const FlightSummaryCard = ({
  flight,
  total,
  formatWord,
  formatDate,
  formatTime,
  formatDay,
  arrivalDate,
  getFlightDuration,
  formatDuration,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between">
        <h3 className="font-medium">Trip Summary</h3>
        <div className="text-xl font-semibold">${total.toFixed(2)}</div>
      </div>

      <div className="p-5">
        {/* Flight Details */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Plane size={20} className="text-blue-600" />
            <div className="text-sm font-medium text-gray-800">
              {formatWord(flight.itineraries[0].segments[0].departure.cityName)}{" "}
              to{" "}
              {formatWord(
                flight.itineraries[0].segments.slice(-1)[0].arrival.cityName
              )}
            </div>
          </div>

          <div className="space-y-5">
            {/* Departure Info */}
            <div className="flex">
              <div className="w-1/4 flex flex-col items-center">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mb-1">
                  <span className="font-semibold text-blue-700">
                    {flight.itineraries[0].segments[0].departure.iataCode}
                  </span>
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  {formatTime(flight.itineraries[0].segments[0].departure.at)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDay(flight.itineraries[0].segments[0].departure.at)}
                </span>
              </div>

              <div className="w-1/2 flex flex-col items-center justify-center">
                <div className="w-full flex items-center gap-1">
                  <div className="h-0.5 flex-grow bg-gray-300"></div>
                  <Plane
                    size={16}
                    className="text-gray-400 transform rotate-90"
                  />
                  <div className="h-0.5 flex-grow bg-gray-300"></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formatDuration(getFlightDuration(flight))}
                </span>
              </div>

              <div className="w-1/4 flex flex-col items-center">
                <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mb-1">
                  <span className="font-semibold text-green-700">
                    {
                      flight.itineraries[0].segments.slice(-1)[0].arrival
                        .iataCode
                    }
                  </span>
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  {formatTime(
                    flight.itineraries[0].segments.slice(-1)[0].arrival.at
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDay(
                    flight.itineraries[0].segments.slice(-1)[0].arrival.at
                  )}
                </span>
              </div>
            </div>

            {/* Airline Info */}
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                  {flight.validatingAirlineCodes[0]?.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {flight.itineraries[0].segments[0].carrierCode}
                    {flight.itineraries[0].segments[0].number}
                  </div>
                  <div className="text-xs text-gray-500">
                    {flight.itineraries[0].segments.length > 1
                      ? `${flight.itineraries[0].segments.length} stops`
                      : "Nonstop"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={14} />
                <span>
                  {formatDate(flight.itineraries[0].segments[0].departure.at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Price Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fare</span>
              <span>${(total - tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes and fees</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span className="text-blue-700">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mt-5 bg-blue-50 rounded-lg p-3 flex items-start gap-2">
          <CheckCheck
            size={18}
            className="text-blue-600 flex-shrink-0 mt-0.5"
          />
          <div className="text-sm">
            <p className="font-medium text-gray-800">Free cancellation</p>
            <p className="text-gray-600">
              Cancel for free within 24 hours of booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCheckOutPage;
