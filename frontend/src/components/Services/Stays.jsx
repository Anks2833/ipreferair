import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import DestinationInput from "../Common/Inputs/DestinationInput";
import { locations } from "../../Data/Locations.jsx";
import DateRangePicker from "../Common/Date Picker/DateRangePicker";
import TravelersInput from "../Common/Inputs/TravelerInput";
import OriginInput from "../Common/Inputs/OriginInput";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  PlaneTakeoff,
  Car,
} from "lucide-react";

const Stays = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [errors, setErrors] = useState({ origin: "", destination: "" });
  const [addFlight, setAddFlight] = useState(false);
  const [addCar, setAddCar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: dayjs().format("YYYY-MM-DD"),
    returnDate: dayjs().add(2, "day").format("YYYY-MM-DD"),
    adults: 1,
    rooms: 1,
  });

  const navigate = useNavigate();

  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format("YYYY-MM-DD"),
      returnDate: endDate.format("YYYY-MM-DD"),
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Clear errors after 3 seconds
  useEffect(() => {
    const hasErrors = errors.origin || errors.destination;
    if (hasErrors) {
      const timer = setTimeout(() => {
        setErrors({ origin: "", destination: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleSearch = () => {
    let hasError = false;
    const newErrors = { origin: "", destination: "" };

    if (!currentUser) {
      newErrors.destination = "You are not signed in.";
      hasError = true;
    }

    if (addFlight === true && !formData.origin) {
      newErrors.origin = "Please select an origin.";
      hasError = true;
    }

    if (!formData.destination) {
      newErrors.destination = "Please select a destination.";
      hasError = true;
    }

    if (
      addFlight === true &&
      formData.destination &&
      formData.origin &&
      formData.origin === formData.destination
    ) {
      newErrors.destination = "Origin and destination cannot be the same.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Add loading effect
    setIsSubmitting(true);
    setTimeout(() => {
      navigate("/hotel-search", {
        state: {
          origin: formData.origin,
          destination: formData.destination,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate,
          adults: formData.adults,
          rooms: formData.rooms,
        },
      });
      setIsSubmitting(false);
    }, 800);
  };

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

  const optionVariants = {
    initial: { opacity: 0, y: 10, height: 0 },
    animate: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 sm:p-8 rounded-xl"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col space-y-3 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Find your perfect stay
        </h2>
        <p className="text-gray-600">
          Search deals on hotels, homes, and much more...
        </p>
      </motion.div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <motion.div
          variants={itemVariants}
          className="grid gap-6 lg:grid-cols-4 md:grid-cols-2 items-end"
        >
          {/* Destination Input */}
          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <MapPin size={18} />
              </div>
              <DestinationInput
                formData={formData}
                setFormData={setFormData}
                locations={locations}
                className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <AnimatePresence>
              {errors.destination && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm absolute"
                >
                  {errors.destination}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in / Check-out
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

          {/* Travelers Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests & Rooms
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Users size={18} />
              </div>
              <div className="pl-10">
                <TravelersInput formData={formData} setFormData={setFormData} />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              type="button"
              onClick={handleSearch}
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 w-full flex items-center justify-center transition-all ${
                isSubmitting ? "opacity-80" : ""
              }`}
            >
              {isSubmitting ? (
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
              {isSubmitting ? "Searching..." : "Search"}
            </motion.button>
          </div>
        </motion.div>

        {/* Options Row */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-wrap gap-6"
        >
          {/* Checkbox to add flight */}
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                className="sr-only"
                checked={addFlight}
                onChange={() => setAddFlight(!addFlight)}
              />
              <div
                className={`w-5 h-5 border-2 rounded transition-colors ${
                  addFlight
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              >
                {addFlight && (
                  <svg
                    className="w-full h-full text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12L10 17L19 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <PlaneTakeoff
                size={16}
                className={`${addFlight ? "text-blue-600" : "text-gray-500"}`}
              />
              <span
                className={`text-sm font-medium ${
                  addFlight ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Add a flight
              </span>
            </div>
          </label>

          {/* Checkbox to add car */}
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                className="sr-only"
                checked={addCar}
                onChange={() => setAddCar(!addCar)}
              />
              <div
                className={`w-5 h-5 border-2 rounded transition-colors ${
                  addCar
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              >
                {addCar && (
                  <svg
                    className="w-full h-full text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12L10 17L19 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <Car
                size={16}
                className={`${addCar ? "text-blue-600" : "text-gray-500"}`}
              />
              <span
                className={`text-sm font-medium ${
                  addCar ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Add a car
              </span>
            </div>
          </label>
        </motion.div>

        {/* Origin Input (Shown conditionally) */}
        <AnimatePresence>
          {addFlight && (
            <motion.div
              variants={optionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-6 overflow-hidden"
            >
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-3">
                  Flight Details
                </h3>
                <div className="space-y-1 relative max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <MapPin size={18} />
                    </div>
                    <OriginInput
                      formData={formData}
                      setFormData={setFormData}
                      locations={locations}
                      className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.origin && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {errors.origin}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Travel Tips */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
      >
        <div className="flex items-center space-x-2 text-blue-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-medium text-sm">Travel Tip</h3>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Book your stay at least 30 days in advance for the best rates. Sign in
          to save your preferences and access exclusive deals.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Stays;
