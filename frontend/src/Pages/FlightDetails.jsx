import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Plane,
  Clock,
  Calendar,
  Luggage,
  AlertCircle,
  CreditCard,
  MapPin,
} from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FlightDetails = () => {
  // Hooks and state setup
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state;

  // Helper functions for time and duration calculations
  const getFlightDuration = (flight) => {
    const segments = flight.itineraries[0]?.segments;
    const departureTime = new Date(segments[0].departure.at).getTime();
    const arrivalTime = new Date(
      segments[segments.length - 1].arrival.at
    ).getTime();
    return (arrivalTime - departureTime) / (1000 * 60);
  };

  const flightDuration = getFlightDuration(flight);
  const hours = Math.floor(flightDuration / 60);
  const minutes = Math.round(flightDuration % 60);

  // Price calculations
  const tax = parseFloat(flight.price.total) * 0.1;
  const total = parseFloat(flight.price.total) + tax;

  // Navigation to checkout
  const proceedToCheckOut = () => {
    navigate(`/flight-check-out`, { state: { flight, tax, total } });
  };

  // Format utilities
  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(date));

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const formatFullDate = (dateString) => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const formatWord = (word) => {
    if (!word) return "";
    return word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="mb-8">
          <nav className="flex items-center text-sm font-medium text-gray-500">
            <div className="flex items-center">
              <span>
                {formatWord(
                  flight.itineraries[0].segments[0].departure.cityName
                )}
              </span>
              <ArrowRight size={16} className="mx-2 text-gray-400" />
              <span>
                {formatWord(
                  flight.itineraries[0].segments.slice(-1)[0].arrival.cityName
                )}
              </span>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span>
                {flight.itineraries[0].segments[0].carrierCode} Airline
              </span>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-blue-600">Review your trip</span>
            </div>
          </nav>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Flight Details */}
          <motion.div variants={itemVariants} className="flex-1">
            {/* Flight Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Plane size={24} className="transform rotate-45" />
                    <div>
                      <h2 className="text-xl font-bold">
                        {formatWord(
                          flight.itineraries[0].segments[0].departure.cityName
                        )}{" "}
                        to{" "}
                        {formatWord(
                          flight.itineraries[0].segments.slice(-1)[0].arrival
                            .cityName
                        )}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {formatFullDate(
                          flight.itineraries[0].segments[0].departure.at
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-semibold">
                    {flight.itineraries[0].segments[0].carrierCode}
                    {flight.itineraries[0].segments[0].number}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Flight Timeline */}
                <div className="relative pb-12">
                  <div className="flex">
                    {/* Departure Info */}
                    <div className="w-1/4 pr-4">
                      <div className="text-3xl font-bold text-gray-800">
                        {formatTime(
                          flight.itineraries[0].segments[0].departure.at
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        {formatDate(
                          flight.itineraries[0].segments[0].departure.at
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={14} className="mr-1 text-blue-500" />
                        <span className="font-medium">
                          {flight.itineraries[0].segments[0].departure.iataCode}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatWord(
                          flight.itineraries[0].segments[0].departure.cityName
                        )}
                      </div>
                    </div>

                    {/* Flight Path Visualization */}
                    <div className="w-2/4 flex flex-col items-center justify-center px-4">
                      <div className="flex items-center w-full">
                        <div className="h-1 flex-grow bg-gray-300 rounded"></div>
                        <div className="mx-2">
                          <div className="flex flex-col items-center">
                            <Clock size={16} className="text-gray-500 mb-1" />
                            <span className="text-sm font-medium">{`${hours}h ${minutes}m`}</span>
                          </div>
                        </div>
                        <div className="h-1 flex-grow bg-gray-300 rounded"></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {flight.itineraries[0].segments[0]?.numberOfStops ===
                        0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Nonstop
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {flight.itineraries[0].segments[0]?.numberOfStops}{" "}
                            {flight.itineraries[0].segments[0]?.numberOfStops >
                            1
                              ? "stops"
                              : "stop"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrival Info */}
                    <div className="w-1/4 pl-4">
                      <div className="text-3xl font-bold text-gray-800">
                        {formatTime(
                          flight.itineraries[0].segments.slice(-1)[0].arrival.at
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        {formatDate(
                          flight.itineraries[0].segments.slice(-1)[0].arrival.at
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={14} className="mr-1 text-blue-500" />
                        <span className="font-medium">
                          {
                            flight.itineraries[0].segments.slice(-1)[0].arrival
                              .iataCode
                          }
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatWord(
                          flight.itineraries[0].segments.slice(-1)[0].arrival
                            .cityName
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Airline Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 font-bold">
                        {flight.itineraries[0].segments[0].carrierCode}
                      </div>
                      <div>
                        <div className="font-medium">
                          {flight.itineraries[0].segments[0].carrierCode}{" "}
                          Airline
                        </div>
                        <div className="text-sm text-gray-500">
                          Flight {flight.itineraries[0].segments[0].number}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Details Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  Your Fare Details
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                    {formatWord(
                      flight.travelerPricings[0].fareDetailsBySegment[0].cabin
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    The following services are included in your fare:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-green-500 flex-shrink-0">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        Seat selection included
                      </p>
                      <p className="text-sm text-gray-600">
                        Choose your preferred seat at no extra cost
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-green-500 flex-shrink-0">
                      <Luggage size={18} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        2 check bags included (30 Kg per bag)
                      </p>
                      <p className="text-sm text-gray-600">
                        Store your luggage in the aircraft's cargo hold
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-amber-500 flex-shrink-0">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        Cancellation fee applies
                      </p>
                      <p className="text-sm text-gray-600">
                        Changes or cancellations may incur fees
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Payment Summary */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-80 xl:w-96"
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Summary
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3">
                      <span className="text-gray-600">Flight fare</span>
                      <span className="font-medium">
                        ${parseFloat(flight.price.total).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold">Trip total</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                      onClick={proceedToCheckOut}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                      <CheckCircle
                        size={18}
                        className="text-blue-600 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">
                          Free cancellation
                        </span>
                        <br />
                        Cancel for free within 24 hours of booking for a full
                        refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightDetails;
