import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import {
  Calendar,
  Check,
  Info,
  MapPin,
  Star,
  Users,
  DollarSign,
  Clock,
  Shield,
} from "lucide-react";

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hotelDetails, setHotelDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { hotel } = location.state || {};

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    if (hotel) {
      const fetchHotelDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/flight/hotel-details/${hotel.hotelId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setError(
              data.error || "Failed to fetch hotel details. Please try again."
            );
          } else {
            setHotelDetails(data);
          }
        } catch (error) {
          console.error("Error fetching hotel details:", error);
          setError("An unexpected error occurred. Please try again later.");
        }
        setLoading(false);
      };

      fetchHotelDetails();
    } else {
      navigate("/hotel-search");
    }
  }, [hotel, navigate]);

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(date));

  // Calculate number of nights between check-in and check-out
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <BounceLoader color="#3B82F6" size={60} />
        <p className="mt-4 text-blue-600 font-medium">
          Loading hotel details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-28 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Rooms Available
          </h2>
          <p className="text-gray-600 mb-6">
            Your selected hotel has no rooms available. Please try another hotel
            or different dates.
          </p>
          <button
            onClick={() => navigate("/hotel-search")}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  if (!hotelDetails) return null;

  const { hotel: hotelInfo, offers } = hotelDetails.data[0];
  const { name, chainCode, cityCode, latitude, longitude } = hotelInfo;

  const hotelPrice = parseFloat(offers?.[0]?.price?.total) || 0;
  const tax = hotelPrice * 0.1;
  const total = hotelPrice + tax;

  const nights = calculateNights(
    offers?.[0]?.checkInDate,
    offers?.[0]?.checkOutDate
  );

  const proceedToCheckOut = () => {
    navigate(`/hotel-check-out`, { state: { hotelDetails, tax, total } });
  };

  // Mock hotel rating for UI enhancement
  const rating = 4.7;

  // Handle image navigation
  const nextImage = () => {
    if (hotelDetails?.images && hotelDetails?.images.length > 0) {
      setActiveImageIndex((prevIndex) =>
        prevIndex === hotelDetails.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (hotelDetails?.images && hotelDetails?.images.length > 0) {
      setActiveImageIndex((prevIndex) =>
        prevIndex === 0 ? hotelDetails.images.length - 1 : prevIndex - 1
      );
    }
  };

  const selectImage = (index) => {
    setActiveImageIndex(index);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 ml-1 md:ml-2"
                  >
                    Hotels
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-blue-600 ml-1 md:ml-2 font-medium">
                    {name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Hotel Header */}
        <motion.div variants={fadeIn} className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {name}
              </h1>
              <div className="flex items-center mt-2 gap-2">
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <Star
                    size={18}
                    className="text-yellow-500 fill-current opacity-50"
                  />
                  <span className="ml-2 text-gray-700 font-medium">
                    {rating}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>{cityCode}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="hidden sm:inline text-gray-700">Save</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline text-gray-700">Share</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hotel Gallery */}
        <motion.div
          variants={fadeIn}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
        >
          {/* Main Image */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-gray-100 h-[400px] md:h-[500px]">
            {hotelDetails?.images && hotelDetails?.images.length > 0 ? (
              <>
                <img
                  src={hotelDetails.images[activeImageIndex]}
                  alt={`Hotel view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 h-full">
            {hotelDetails?.images &&
              hotelDetails?.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden cursor-pointer ${
                    index === activeImageIndex ? "ring-4 ring-blue-500" : ""
                  }`}
                  onClick={() => selectImage(index)}
                >
                  <img
                    src={image}
                    alt={`Hotel thumbnail ${index + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />

                  {/* Show "more photos" on the last thumbnail if there are more than 4 images */}
                  {index === 3 && hotelDetails.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">
                        +{hotelDetails.images.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Hotel Details and Offers */}
          <motion.div variants={fadeIn} className="lg:col-span-2 space-y-8">
            {/* Hotel Information Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  About This Hotel
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg mt-1">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Location</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {cityCode} | Chain: {chainCode}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Coordinates: {latitude}, {longitude}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg mt-1">
                      <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">
                        Hotel Features
                      </h3>
                      <ul className="text-gray-600 text-sm mt-1 space-y-1">
                        <li>Free WiFi</li>
                        <li>Air Conditioning</li>
                        <li>24/7 Reception</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">
                  Experience luxury and comfort at {name}, centrally located in{" "}
                  {cityCode}. Enjoy our world-class amenities and exceptional
                  service during your stay.
                </p>
              </div>
            </div>

            {/* Available Offers Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
                <h2 className="text-xl font-bold text-white">
                  Available Offer
                </h2>
              </div>

              <div className="p-6">
                {offers.map((offer, index) => (
                  <div key={index} className="space-y-6">
                    {/* Room Info */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4 pb-4 border-b border-gray-200">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">
                          {offer.room?.description?.text || "Standard Room"}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {offer.rateFamilyEstimated?.type || "Standard Rate"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {offer.price.total} {offer.price.currency}
                        </p>
                        <p className="text-gray-600 text-sm">
                          for {nights} night(s)
                        </p>
                      </div>
                    </div>

                    {/* Stay Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">
                            Stay Dates
                          </h3>
                          <p className="text-gray-800 mt-1">
                            <span className="font-medium">Check-in:</span>{" "}
                            {formatDate(offer.checkInDate)}
                          </p>
                          <p className="text-gray-800">
                            <span className="font-medium">Check-out:</span>{" "}
                            {formatDate(offer.checkOutDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Guests</h3>
                          <p className="text-gray-800 mt-1">
                            {offer.guests.adults}{" "}
                            {offer.guests.adults > 1 ? "Adults" : "Adult"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock size={18} className="text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">
                            Cancellation Policy
                          </h3>
                          {offer.policies?.cancellations?.map((policy, idx) => (
                            <p key={idx} className="text-gray-600 text-sm mt-1">
                              Payment of{" "}
                              <span className="font-medium">
                                {policy.amount} {offers?.[0]?.price?.currency}
                              </span>{" "}
                              must be made by {formatDate(policy.deadline)} at{" "}
                              {formatTime(policy.deadline)}, or your booking
                              will be cancelled.
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Payment Summary */}
          <motion.div variants={fadeIn} className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
                <h2 className="text-xl font-bold text-white">
                  Payment Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-gray-600" />
                      <span className="text-gray-700">Room Price</span>
                    </div>
                    <span className="font-medium">
                      {hotelPrice.toFixed(2)} {offers?.[0]?.price?.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Info size={18} className="text-gray-600" />
                      <span className="text-gray-700">Taxes & Fees</span>
                    </div>
                    <span className="font-medium">
                      {tax.toFixed(2)} {offers?.[0]?.price?.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-gray-800">
                      Total
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      {total.toFixed(2)} {offers?.[0]?.price?.currency}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  onClick={proceedToCheckOut}
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <Shield size={18} />
                    <span className="font-medium">Secure booking</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    No credit card fees • Free cancellation within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelDetails;
