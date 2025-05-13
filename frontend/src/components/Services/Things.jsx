import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import DestinationInput from "../Common/Inputs/DestinationInput";
import { locations } from "../../Data/Locations.jsx";
import DateRangePicker from "../Common/Date Picker/DateRangePicker";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Calendar,
  Ticket,
  Map,
  Compass,
  Music,
  Utensils,
  Wine,
  Bike,
} from "lucide-react";

const Things = () => {
  // Access the current user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State for form data and errors
  const [errors, setErrors] = useState({ origin: "", destination: "" });
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: dayjs().format("YYYY-MM-DD"),
    returnDate: dayjs().add(2, "day").format("YYYY-MM-DD"),
    adults: 1,
    rooms: 1,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Initialize the navigate function
  const navigate = useNavigate();

  // Handle date changes
  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format("YYYY-MM-DD"),
      returnDate: endDate.format("YYYY-MM-DD"),
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    let hasError = false;
    const newErrors = { origin: "", destination: "" };

    // Validation
    if (!currentUser) {
      newErrors.origin = "You are not signed in.";
      hasError = true;
    }

    if (!formData.origin) {
      newErrors.origin = "Please select an origin.";
      hasError = true;
    }

    if (!formData.destination) {
      newErrors.destination = "Please select a destination.";
      hasError = true;
    }

    if (
      formData.destination &&
      formData.origin &&
      formData.origin === formData.destination
    ) {
      newErrors.destination = "Origin and destination cannot be the same.";
      hasError = true;
    }

    // If there are errors, set them and return
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Show searching state
    setIsSearching(true);

    // Navigate to search results after a short delay to show loading effect
    setTimeout(() => {
      navigate("/flight-search", {
        state: {
          origin: formData.origin,
          destination: formData.destination,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate,
          adults: formData.adults,
          rooms: formData.rooms,
        },
      });
      setIsSearching(false);
    }, 800);
  };

  // Clear errors after 3 seconds
  useEffect(() => {
    if (errors.origin || errors.destination) {
      const timer = setTimeout(() => {
        setErrors({ origin: "", destination: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  // Activity categories
  const activityCategories = [
    { name: "Tours & Sightseeing", icon: <Compass size={24} /> },
    { name: "Cultural Activities", icon: <Map size={24} /> },
    { name: "Entertainment", icon: <Ticket size={24} /> },
    { name: "Food & Dining", icon: <Utensils size={24} /> },
    { name: "Outdoor Adventures", icon: <Bike size={24} /> },
    { name: "Nightlife", icon: <Wine size={24} /> },
  ];

  return (
    <div className="rounded-xl shadow-md bg-white overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Ticket size={22} />
            Discover Things to Do
          </h2>
          <p className="text-purple-100 mt-1 text-sm">
            Find experiences, tours, and activities for your trip
          </p>
        </div>

        {/* Background patterns */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-6"
        >
          {/* Search Form */}
          <motion.div
            variants={itemVariants}
            className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4 items-end p-6 bg-gray-50 rounded-xl border border-gray-100"
          >
            {/* Destination Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Where are you going?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <MapPin size={18} />
                </div>
                <DestinationInput
                  formData={formData}
                  setFormData={setFormData}
                  locations={locations}
                  className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                />
              </div>
              <AnimatePresence>
                {errors.destination && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-sm mt-1 absolute"
                  >
                    {errors.destination}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Date Range Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                When are you going?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Calendar size={18} />
                </div>
                <div className="pl-10">
                  <DateRangePicker
                    onDateChange={handleDateChange}
                    defaultDates={[
                      dayjs(formData.departureDate),
                      dayjs(formData.returnDate),
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className={`bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg px-6 py-3 w-full flex items-center justify-center transition-colors ${
                  isSearching ? "opacity-80" : ""
                }`}
              >
                {isSearching ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <Search size={18} className="mr-2" />
                )}
                {isSearching ? "Searching..." : "Search Activities"}
              </motion.button>
            </div>
          </motion.div>

          {/* Activity Categories */}
          <motion.div variants={itemVariants} className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {activityCategories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer"
                >
                  <div className="text-purple-600 mb-2">{category.icon}</div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div variants={itemVariants} className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Why Book With Us
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Verified Activities
                  </h3>
                  <p className="text-sm text-gray-600">
                    All activities are verified for quality and safety
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Best Experiences
                  </h3>
                  <p className="text-sm text-gray-600">
                    Curated selection of top-rated experiences
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Instant Confirmation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get immediate confirmation and vouchers
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tip Section */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-purple-600"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022zM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Pro Tip: Book activities in advance to secure your spot, especially
            during peak travel seasons.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Things;
