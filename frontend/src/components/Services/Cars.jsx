import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RentalCars from "../Cars/RentalCars";
import AirportTransportation from "../Cars/AirportTransportation";
import { Car, Bus, ChevronRight } from "lucide-react";

const Cars = () => {
  // State to track the currently visible tab
  const [visible, setVisible] = useState("rental-cars");
  const [initialLoad, setInitialLoad] = useState(true);

  // Refs for the tabs
  const indicatorRef = useRef();
  const tabContainerRef = useRef();

  // Function to switch the tab based on the provided tab name
  const OpenTab = (tabname) => {
    setVisible(tabname);
    if (initialLoad) setInitialLoad(false);
  };

  // Update indicator position when tab changes
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

  // Animation variants for tab content
  const tabContentVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Define tab items
  const tabItems = [
    {
      id: "rental-cars",
      label: "Rental Cars",
      icon: <Car size={18} />,
      component: <RentalCars />,
    },
    {
      id: "airport-transportation",
      label: "Airport Transportation",
      icon: <Bus size={18} />,
      component: <AirportTransportation />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5">
        <h2 className="text-xl font-semibold">Find the perfect vehicle</h2>
        <p className="text-blue-100 mt-1 text-sm">
          Compare deals from top rental companies and local providers
        </p>
      </div>

      {/* Tabs and Content */}
      <div className="p-5">
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs text-gray-500 mb-5">
          <span>Travel</span>
          <ChevronRight size={14} className="mx-1" />
          <span>Transportation</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-blue-600 font-medium">
            {visible === "rental-cars" ? "Rental Cars" : "Airport Transfers"}
          </span>
        </div>

        {/* Tab Navigation */}
        <div
          className="relative border-b border-gray-200 mb-6"
          ref={tabContainerRef}
        >
          <div className="flex space-x-1">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                className={`tab-item px-5 py-3 flex items-center space-x-2 font-medium text-sm rounded-t-lg relative transition-colors duration-200 ${
                  visible === tab.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                }`}
                onClick={() => OpenTab(tab.id)}
              >
                <span
                  className={`transition-colors duration-200 ${
                    visible === tab.id ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}

            {/* The active indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={visible}
            variants={tabContentVariants}
            initial={initialLoad ? "visible" : "hidden"}
            animate="visible"
            exit="exit"
            className="min-h-[300px]"
          >
            {tabItems.find((tab) => tab.id === visible)?.component}
          </motion.div>
        </AnimatePresence>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              Free Cancellation
            </h3>
            <p className="text-sm text-gray-600">
              Flexible plans with free cancellation on most bookings
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              Price Match Guarantee
            </h3>
            <p className="text-sm text-gray-600">
              Found a better price? We'll match it plus 10% discount
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">No Hidden Fees</h3>
            <p className="text-sm text-gray-600">
              Know exactly what you're paying with transparent pricing
            </p>
          </div>
        </div>
      </div>

      {/* Footer with tips */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
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
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <span className="font-medium">Pro Tip:</span> Book early to secure the
          best rates, especially during peak travel seasons.
        </div>
      </div>
    </div>
  );
};

export default Cars;
