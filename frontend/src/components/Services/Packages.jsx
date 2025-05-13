import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightPackage from "../Packages/FlightPackage";
import CarPackage from "../Packages/CarPackage";
import StayPackage from "../Packages/StayPackage";
import {
  Search,
  ChevronDown,
  Home,
  Plane,
  Car,
  Check,
  Package,
  Building,
  Clock,
  DollarSign,
} from "lucide-react";

const Packages = () => {
  // State management
  const [stay, setStay] = useState(false);
  const [flight, setFlight] = useState(false);
  const [car, setCar] = useState(false);
  const [flightClass, setFlightClass] = useState("Economy");
  const [flightClassModal, setFlightClassModal] = useState(false);
  const flightClassModalRef = useRef();

  // Toggle flight class modal
  const toggleFlightClassModal = () => {
    setFlightClassModal(!flightClassModal);
  };

  // Set flight class and close modal
  const selectFlightClass = (newClass) => {
    setFlightClass(newClass);
    setFlightClassModal(false);
  };

  // Handle clicks outside the modal
  const handleOutsideClick = (event) => {
    if (
      flightClassModalRef.current &&
      !flightClassModalRef.current.contains(event.target)
    ) {
      setFlightClassModal(false);
    }
  };

  // Event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Flight class options with icons
  const flightClasses = [
    { name: "Economy", icon: <DollarSign size={16} /> },
    { name: "Premium economy", icon: <DollarSign size={16} /> },
    { name: "Business class", icon: <Building size={16} /> },
    { name: "First class", icon: <Clock size={16} /> },
  ];

  // Determine which package to display
  const getDisplayedPackage = () => {
    const selected = [stay, flight, car].filter(Boolean).length;

    if (selected < 2) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12 px-6 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 text-blue-600 rounded-full">
            <Package size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Build Your Travel Package
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Select two or more travel components to create a custom package and
            save up to 25% on your trip.
          </p>

          <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <Search size={16} className="mr-2" />
            Please select at least two travel components
          </div>
        </motion.div>
      );
    }

    if (stay && flight && car) {
      return <StayPackage />;
    }

    if (stay && flight) {
      return <StayPackage />;
    }

    if (stay && car) {
      return <CarPackage />;
    }

    if (flight && car) {
      return <FlightPackage />;
    }

    return null;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Package size={20} />
          Create Custom Travel Package
        </h2>
        <p className="text-blue-100 mt-1 text-sm">
          Combine and save on flights, hotels, and car rentals
        </p>
      </div>

      <div className="p-6">
        {/* Package selection options */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          <h3 className="text-gray-700 font-medium">
            What would you like to book?
          </h3>

          <div className="flex flex-wrap gap-3">
            {/* Stay Toggle */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStay(!stay)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-200 ${
                stay
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                  stay ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Home size={16} />
              </div>
              <span className="font-medium">
                {stay ? "Stay added" : "Stay"}
              </span>
              {stay && <Check size={16} className="ml-1 text-blue-600" />}
            </motion.button>

            {/* Flight Toggle */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFlight(!flight)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-200 ${
                flight
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                  flight
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Plane size={16} />
              </div>
              <span className="font-medium">
                {flight ? "Flight added" : "Flight"}
              </span>
              {flight && <Check size={16} className="ml-1 text-blue-600" />}
            </motion.button>

            {/* Car Toggle */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCar(!car)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-200 ${
                car
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                  car ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Car size={16} />
              </div>
              <span className="font-medium">{car ? "Car added" : "Car"}</span>
              {car && <Check size={16} className="ml-1 text-blue-600" />}
            </motion.button>

            {/* Flight Class Selector (conditionally rendered) */}
            <AnimatePresence>
              {((flight && stay) || (flight && car)) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                  ref={flightClassModalRef}
                >
                  <button
                    onClick={toggleFlightClassModal}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-blue-300 transition-colors"
                  >
                    <span className="font-medium">Cabin: {flightClass}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        flightClassModal ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Flight Class Dropdown */}
                  <AnimatePresence>
                    {flightClassModal && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100"
                      >
                        <div className="py-2">
                          {flightClasses.map((cls) => (
                            <button
                              key={cls.name}
                              onClick={() => selectFlightClass(cls.name)}
                              className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                                flightClass === cls.name
                                  ? "text-blue-600 bg-blue-50/60 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={
                                    flightClass === cls.name
                                      ? "text-blue-600"
                                      : "text-gray-500"
                                  }
                                >
                                  {cls.icon}
                                </span>
                                <span>{cls.name}</span>
                              </div>

                              {flightClass === cls.name && (
                                <Check size={16} className="text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Savings indicator - shown when at least two options are selected */}
        <AnimatePresence>
          {[stay, flight, car].filter(Boolean).length >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-1.5 rounded-md text-green-600">
                  <DollarSign size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-green-800 text-sm">
                    Package Savings Available!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Save up to 25% when you book these items together compared
                    to booking separately.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Package Content */}
        <div className="mt-6">{getDisplayedPackage()}</div>

        {/* Package Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <DollarSign size={16} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 text-sm">Save More</h3>
              <p className="text-xs text-gray-600 mt-1">
                Bundle your travel components and save up to 25%
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-full text-purple-600">
              <Package size={16} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 text-sm">One Booking</h3>
              <p className="text-xs text-gray-600 mt-1">
                Manage your entire trip in one convenient place
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
              <Check size={16} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 text-sm">Flexibility</h3>
              <p className="text-xs text-gray-600 mt-1">
                Customize your package to fit your exact needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
