import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatMessage = ({ message, isLast }) => {
  const isBot = message.sender === "bot";

  return (
    <div
      className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
      ref={isLast ? lastMessageRef : null}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
      )}

      <div className={`max-w-[75%] ${isBot ? "" : "order-1"}`}>
        <div
          className={`p-3 rounded-2xl ${
            isBot
              ? "bg-gray-100 text-gray-800 rounded-tl-none"
              : "bg-blue-500 text-white rounded-tr-none"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <p
          className={`text-xs mt-1 ${
            isBot ? "text-left" : "text-right"
          } text-gray-500`}
        >
          {message.timestamp}
        </p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 ml-2 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
    </div>
  );
};

// Typing indicator component that shows when bot is "thinking"
const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </div>
    <div className="max-w-[75%]">
      <div className="p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Using a separate component for the last message ref
const lastMessageRef = React.createRef();

const Help = () => {
  const [isOpen, setIsOpen] = useState(false);
  const helpRef = useRef(null);
  const inputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Format timestamp to a readable time format (HH:mm)
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // State to store chat messages and user input
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! 👋 How can I help you with your travel plans today?",
      timestamp: formatTimestamp(new Date()),
    },
  ]);
  const [input, setInput] = useState("");

  // Enhanced predefined responses with more helpful information
  const predefinedResponses = {
    greeting: "Hello there! How can I assist with your travel plans today?",
    booking:
      "To book a flight, use the search form at the top of the page. You can also filter by price, duration, and airlines to find the perfect flight for your needs.",
    payment:
      "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All payments are processed securely with 256-bit encryption.",
    cancel:
      "You can cancel your booking in the 'Manage My Booking' section using your booking reference. Cancellations made within 24 hours of booking are usually free of charge.",
    thanks:
      "You're welcome! I'm happy I could help. Is there anything else you'd like to know about your travel plans?",
    okay: "Alright! I'm here if you need any other assistance with your travels.",
    default:
      "I specialize in travel-related questions. Feel free to ask about bookings, cancellations, destinations, or travel tips!",
  };

  // List of topics the bot can help with - for suggestions
  const helpTopics = [
    "How do I book a flight?",
    "What payment methods do you accept?",
    "How can I cancel my booking?",
    "Do you offer travel insurance?",
  ];

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Focus on input when chat opens
    if (newIsOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const timestamp = formatTimestamp(new Date());
      const userMessage = { sender: "user", text: input, timestamp };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      let botResponse = predefinedResponses.default;
      const lowerCaseInput = input.toLowerCase();

      // Enhanced response matching with more natural language processing
      if (lowerCaseInput.match(/\b(hello|hi|hey|howdy|greetings)\b/)) {
        botResponse = predefinedResponses.greeting;
      } else if (
        lowerCaseInput.match(/\b(book|flight|booking|reserve|reservation)\b/)
      ) {
        botResponse = predefinedResponses.booking;
      } else if (
        lowerCaseInput.match(
          /\b(pay|payment|credit card|debit card|visa|mastercard)\b/
        )
      ) {
        botResponse = predefinedResponses.payment;
      } else if (
        lowerCaseInput.match(/\b(cancel|refund|cancellation|cancelation)\b/)
      ) {
        botResponse = predefinedResponses.cancel;
      } else if (lowerCaseInput.match(/\b(thank|thanks|thx|appreciate)\b/)) {
        botResponse = predefinedResponses.thanks;
      } else if (
        lowerCaseInput.match(/\b(ok|okay|alright|got it|understood)\b/)
      ) {
        botResponse = predefinedResponses.okay;
      }

      // Simulate a delay for bot response
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botResponse,
            timestamp: formatTimestamp(new Date()),
          },
        ]);
      }, 1500); // Longer delay for more realistic "typing" effect

      setInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Handle clicks outside the chat interface
    const handleClickOutside = (event) => {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Scroll to the last message
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Suggestion chip click handler
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Optional: auto-send the suggestion
    // setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div
      className={`fixed sm:bottom-6 sm:right-6 bottom-4 right-4 z-[10000] w-96 h-[30rem] max-w-[95%] max-h-[calc(100vh-2rem)] 
          ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      {/* Floating Chat Button */}
      <motion.div
        className={`absolute bottom-0 right-0 ${
          isOpen ? "hidden" : "flex"
        } bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full items-center justify-center cursor-pointer shadow-lg pointer-events-auto transition-all duration-300 ease-in-out`}
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </motion.div>

      {/* Unread Message Badge */}
      {!isOpen && messages.length > 1 && (
        <div className="absolute bottom-10 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full pointer-events-none">
          !
        </div>
      )}

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            ref={helpRef}
            className="bg-white w-full h-full rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Travel Assistant</h3>
                  <p className="text-xs text-blue-100">
                    Online | Typically replies instantly
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  isLast={index === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div className="h-3"></div> {/* Bottom padding */}
            </div>

            {/* Suggestion Chips (only show after initial greeting) */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {helpTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(topic)}
                      className="text-xs bg-white border border-gray-200 text-gray-600 py-1 px-3 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Section */}
            <div className="flex items-center border-t border-gray-200 p-3 bg-gray-50">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`ml-2 p-2 rounded-full ${
                  input.trim()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSendMessage}
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Help;
