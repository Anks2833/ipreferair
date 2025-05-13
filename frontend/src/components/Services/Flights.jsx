import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoundTrip from "../FlightClass/RoundTrip";
import OneWay from "../FlightClass/OneWay";
import MultiCity from "../FlightClass/MultiCity";
import {
  Plane,
  ArrowRight,
  RotateCw,
  Globe,
  ChevronDown,
  Check,
  Users,
  ChevronsUp,
  CreditCard,
  Shield,
} from "lucide-react";

const Flights = () => {
  // State management
  const [visible, setVisible] = useState("round-trip");
  const [flightClass, setFlightClass] = useState("Economy");
  const [flightClassModal, setFlightClassModal] = useState(false);

  // Refs for DOM manipulation
  const flightClassModalRef = useRef();
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  // Toggle flight class modal
  const toggleFlightClassModal = () => {
    setFlightClassModal(!flightClassModal);
  };

  // Select flight class and close modal
  const selectFlightClass = (newClass) => {
    setFlightClass(newClass);
    setFlightClassModal(false);
  };

  // Change active tab
  const OpenTab = (tabname) => {
    setVisible(tabname);
  };

  // Handle click outside of modal
  const handleOutsideClick = (event) => {
    if (
      flightClassModalRef.current &&
      !flightClassModalRef.current.contains(event.target)
    ) {
      setFlightClassModal(false);
    }
  };

  // Set up event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Update indicator position when tab changes
  useEffect(() => {
    const tabs = tabContainerRef.current?.querySelectorAll(".tab-button");
    const activeTab = Array.from(tabs).find(
      (tab) => tab.getAttribute("data-tab") === visible
    );

    if (activeTab && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeTab;
      indicatorRef.current.style.width = `${offsetWidth}px`;
      indicatorRef.current.style.left = `${offsetLeft}px`;
    }
  }, [visible]);

  // Flight class options with icons
  const flightClassOptions = [
    { value: "Economy", icon: <Users size={16} /> },
    { value: "Premium economy", icon: <Users size={16} /> },
    { value: "Business class", icon: <ChevronsUp size={16} /> },
    { value: "First class", icon: <CreditCard size={16} /> },
  ];

  // Tab content animations
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="rounded-xl bg-white shadow-md overflow-hidden">
      {/* Header section with background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Plane className="rotate-45" size={22} />
          Find and compare flights
        </h2>
        <p className="text-blue-100 mt-1 text-sm">
          Search hundreds of travel sites at once
        </p>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Top control panel */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Tab navigation */}
            <div
              className="relative border rounded-lg bg-gray-50 p-1 flex"
              ref={tabContainerRef}
            >
              {/* Round Trip Tab */}
              <button
                className="tab-button px-4 py-2 rounded-md text-sm font-medium relative z-10 flex items-center gap-2"
                data-tab="round-trip"
                onClick={() => OpenTab("round-trip")}
              >
                <RotateCw
                  size={16}
                  className={`transition-colors ${
                    visible === "round-trip" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span>Round Trip</span>
              </button>

              {/* One-way Tab */}
              <button
                className="tab-button px-4 py-2 rounded-md text-sm font-medium relative z-10 flex items-center gap-2"
                data-tab="one-way"
                onClick={() => OpenTab("one-way")}
              >
                <ArrowRight
                  size={16}
                  className={`transition-colors ${
                    visible === "one-way" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span>One-way</span>
              </button>

              {/* Multi-city Tab */}
              <button
                className="tab-button px-4 py-2 rounded-md text-sm font-medium relative z-10 flex items-center gap-2"
                data-tab="multi-city"
                onClick={() => OpenTab("multi-city")}
              >
                <Globe
                  size={16}
                  className={`transition-colors ${
                    visible === "multi-city" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span>Multi-city</span>
              </button>

              {/* Active tab indicator (background pill) */}
              <div
                ref={indicatorRef}
                className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm z-0 transition-all duration-300 ease-in-out"
              />
            </div>

            {/* Flight Class Selector */}
            <div className="relative" ref={flightClassModalRef}>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:border-blue-500 text-gray-700 text-sm font-medium transition-colors"
                onClick={toggleFlightClassModal}
              >
                <span>Cabin: {flightClass}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    flightClassModal ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Flight Class Dropdown Menu */}
              <AnimatePresence>
                {flightClassModal && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-100 py-2 z-30"
                  >
                    {flightClassOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between text-sm hover:bg-blue-50 transition-colors ${
                          flightClass === option.value
                            ? "text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => selectFlightClass(option.value)}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              flightClass === option.value
                                ? "text-blue-600"
                                : "text-gray-500"
                            }
                          >
                            {option.icon}
                          </span>
                          <span>{option.value}</span>
                        </div>

                        {flightClass === option.value && (
                          <Check size={16} className="text-blue-600" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={visible}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="min-h-[280px]"
            >
              {visible === "round-trip" && <RoundTrip />}
              {visible === "one-way" && <OneWay />}
              {visible === "multi-city" && <MultiCity />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Featured Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">
                Price Protection
              </h3>
              <p className="text-sm text-gray-600">
                If the price drops after you book, we'll refund the difference
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
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
              <h3 className="font-medium text-gray-800 mb-1">No Hidden Fees</h3>
              <p className="text-sm text-gray-600">
                Know exactly what you're paying with transparent pricing
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">
                Flexible Booking
              </h3>
              <p className="text-sm text-gray-600">
                Change or cancel your flight with minimal fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer tip section */}
      <div className="bg-blue-50 border-t border-blue-100 p-4">
        <div className="flex items-center gap-2 text-blue-800 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022zM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Flight Tip:</span>
          <span>
            Tuesday and Wednesday are typically the cheapest days to fly. Book
            3-4 weeks in advance for the best rates.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Flights;
