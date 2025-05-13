import {
  AlertCircle,
  Search,
  ArrowRight,
  PlaneTakeoff,
  Calendar,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { locations } from "../Data/Locations.jsx";
import OriginInput from "../components/Common/Inputs/OriginInput.jsx";
import DestinationInput from "../components/Common/Inputs/DestinationInput.jsx";
import TravelersInput from "../components/Common/Inputs/TravelerInput.jsx";
import DateRangePicker from "../components/Common/Date Picker/DateRangePicker.jsx";
import FlightsList from "../components/Common/FlightsList.jsx";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

function SearchPage() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  const [flights, setFlights] = useState("");
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({ origin: "", destination: "" });
  const [loading, setLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: dayjs().format("YYYY-MM-DD"),
    returnDate: dayjs().add(2, "day").format("YYYY-MM-DD"),
    adults: 1,
    rooms: 1,
  });

  const [searchPerformed, setSearchPerformed] = useState(false);

  // Update form data from location state
  useEffect(() => {
    if (location.state) {
      setFormData({
        origin: location.state.origin,
        destination: location.state.destination,
        departureDate: location.state.departureDate,
        returnDate: location.state.returnDate,
        adults: location.state.adults,
        rooms: location.state.rooms,
      });
      setTriggerSearch(true);
    }
  }, [location.state]);

  // Trigger search when required
  useEffect(() => {
    if (triggerSearch && formData.origin && formData.destination) {
      handleSubmit();
      setTriggerSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSearch]);

  // Handle date change
  const handleDateChange = ([startDate, endDate]) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: startDate.format("YYYY-MM-DD"),
      returnDate: endDate.format("YYYY-MM-DD"),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSearchPerformed(true);
    setLoading(true);
    setError(null);

    let hasError = false;
    const newErrors = { origin: "", destination: "" };

    if (!formData.origin) {
      newErrors.origin = "Please select an origin city";
      hasError = true;
    }

    if (!formData.destination) {
      newErrors.destination = "Please select a destination city";
      hasError = true;
    }

    if (
      formData.destination &&
      formData.origin &&
      formData.origin === formData.destination
    ) {
      newErrors.destination = "Origin and destination cannot be the same";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      setTimeout(() => {
        setErrors({ origin: "", destination: "" });
      }, 3000);
      return;
    }

    try {
      const payload = {
        userId: currentUser._id,
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        adults: parseInt(formData.adults, 10),
      };

      const response = await fetch("https://ipreferstay.onrender.com/api/flight/search-flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch flights. Please try again.");
      }

      setFlights(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate flight duration
  const getFlightDuration = (flight) => {
    const segments = flight.itineraries[0]?.segments;
    const departureTime = new Date(segments[0].departure.at).getTime();
    const arrivalTime = new Date(
      segments[segments.length - 1].arrival.at
    ).getTime();
    return (arrivalTime - departureTime) / (1000 * 60);
  };

  // Helper function to format flight times
  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(date));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-10 md:py-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Find Your Perfect Flight
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Search across hundreds of airlines and find the best deals for your
            journey
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
        >
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Origin Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <PlaneTakeoff size={18} className="transform -rotate-45" />
                  </div>
                  <div className="pl-10">
                    <OriginInput
                      formData={formData}
                      setFormData={setFormData}
                      locations={locations}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {errors.origin && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.origin}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Destination Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <PlaneTakeoff size={18} className="transform rotate-45" />
                  </div>
                  <div className="pl-10">
                    <DestinationInput
                      formData={formData}
                      setFormData={setFormData}
                      locations={locations}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
                <AnimatePresence>
                  {errors.destination && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.destination}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Date Range Picker */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Dates
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
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
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travelers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Users size={18} />
                  </div>
                  <div className="pl-10">
                    <TravelersInput
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            {(formData.origin || formData.destination) && (
              <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">
                    Trip Summary:
                  </span>
                  {formData.origin && (
                    <span className="flex items-center">
                      {formData.origin}
                      {formData.destination && (
                        <ArrowRight size={16} className="mx-1" />
                      )}
                    </span>
                  )}
                  {formData.destination && <span>{formData.destination}</span>}
                  {formData.origin && formData.destination && (
                    <>
                      <span className="mx-1 text-gray-400">|</span>
                      <span>
                        {dayjs(formData.departureDate).format("MMM D")} -{" "}
                        {dayjs(formData.returnDate).format("MMM D, YYYY")}
                      </span>
                      <span className="mx-1 text-gray-400">|</span>
                      <span>
                        {formData.adults}{" "}
                        {parseInt(formData.adults) === 1
                          ? "traveler"
                          : "travelers"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Search size={18} />
                <span>Search Flights</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-16 flex flex-col items-center justify-center min-h-64 border border-gray-100"
            >
              <BounceLoader color="#3b82f6" size={60} />
              <p className="mt-6 text-gray-600 font-medium">
                Searching for the best flights...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few moments
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center min-h-64 border border-gray-100"
            >
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Unable to Find Flights
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                We're currently experiencing some technical difficulties. Please
                try again later or modify your search.
              </p>
              <button
                onClick={(e) => handleSubmit(e)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : searchPerformed && flights ? (
            <motion.div variants={itemVariants}>
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {flights.data?.length
                    ? `${flights.data?.length} flights found`
                    : "Flight Results"}
                </h2>
                {flights.data?.length > 0 && (
                  <p className="text-gray-600">
                    From {formData.origin} to {formData.destination} •{" "}
                    {dayjs(formData.departureDate).format("MMM D")} -{" "}
                    {dayjs(formData.returnDate).format("MMM D")}
                  </p>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FlightsList
                  flights={flights}
                  formatTime={formatTime}
                  getFlightDuration={getFlightDuration}
                />
              </motion.div>
            </motion.div>
          ) : (
            !searchPerformed && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100"
              >
                <div className="flex flex-col items-center max-w-xl mx-auto">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <PlaneTakeoff size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Ready to Take Off?
                  </h3>
                  <p className="text-gray-600">
                    Enter your travel details above and discover amazing flight
                    deals from hundreds of airlines. We'll help you find the
                    perfect flight for your journey.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="text-center">
                      <div className="bg-blue-50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                        <Search size={20} className="text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">Search</h4>
                      <p className="text-sm text-gray-600">
                        Find flights across multiple airlines
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">
                        Compare
                      </h4>
                      <p className="text-sm text-gray-600">
                        Compare prices, times & airlines
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">Book</h4>
                      <p className="text-sm text-gray-600">
                        Securely book your perfect flight
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SearchPage;
