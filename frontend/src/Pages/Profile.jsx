import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileDetails from "../components/ProfileDetails";
import ProfileReviews from "../components/ProfileReviews";
import ProfileSettings from "../components/ProfileSettings";
import ProfilePayment from "../components/ProfilePayment";
import BasicDetails from "../components/BasicDetails";
import ContactDetails from "../components/ContactDetails";
import ProfileBookings from "../components/ProfileBookings";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CreditCard,
  Star,
  Settings,
  FileText,
  Phone,
  Calendar,
} from "lucide-react";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("collection");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set the active tab from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (!tabFromUrl && location.pathname === "/profile") {
      navigate("/profile?tab=details", { replace: true });
      setTab("details");
    } else if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search, location.pathname, navigate]);

  // Function to navigate to a tab
  const navigateToTab = (tabName) => {
    navigate(`/profile?tab=${tabName}`);
    setTab(tabName);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Get tab information
  const getTabInfo = (tabName) => {
    const tabMap = {
      details: {
        title: "Personal Details",
        icon: <User size={20} />,
        description: "Manage your personal information and account details",
      },
      payment: {
        title: "Payment Methods",
        icon: <CreditCard size={20} />,
        description: "Manage your payment options and transaction history",
      },
      reviews: {
        title: "My Reviews",
        icon: <Star size={20} />,
        description: "View and manage your reviews for past bookings",
      },
      settings: {
        title: "Account Settings",
        icon: <Settings size={20} />,
        description: "Configure your account preferences and notifications",
      },
      edit_basic_details: {
        title: "Edit Basic Details",
        icon: <FileText size={20} />,
        description:
          "Update your name, date of birth, and other basic information",
      },
      edit_contact_details: {
        title: "Edit Contact Information",
        icon: <Phone size={20} />,
        description: "Update your contact information and address details",
      },
      bookings: {
        title: "My Bookings",
        icon: <Calendar size={20} />,
        description: "View and manage your current and past bookings",
      },
    };

    return (
      tabMap[tabName] || {
        title: "Profile",
        icon: <User size={20} />,
        description: "",
      }
    );
  };

  const currentTabInfo = getTabInfo(tab);

  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-500 h-48 md:h-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
          <h1 className="text-white text-3xl font-bold">My Profile</h1>
          <p className="text-blue-100 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
          >
            {sidebarOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <User size={24} />
            )}
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:mt-20 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <ProfileSidebar activeTab={tab} onTabChange={navigateToTab} />
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile */}
          {isMobile && (
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setSidebarOpen(false)}
                >
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Menu
                      </h2>
                    </div>
                    <ProfileSidebar
                      activeTab={tab}
                      onTabChange={navigateToTab}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Tab Header */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {currentTabInfo.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {currentTabInfo.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {currentTabInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {tab === "details" && <ProfileDetails />}
                {tab === "payment" && <ProfilePayment />}
                {tab === "reviews" && <ProfileReviews />}
                {tab === "settings" && <ProfileSettings />}
                {tab === "edit_basic_details" && <BasicDetails />}
                {tab === "edit_contact_details" && <ContactDetails />}
                {tab === "bookings" && <ProfileBookings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
