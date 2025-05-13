import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  EyeOff,
  Eye,
  X,
  Check,
  Mail,
  User,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import OAuth from "../components/OAuth";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SyncLoader } from "react-spinners";

const SignUp = ({ length = 4 }) => {
  // State management
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("weak");
  const [strengthConditions, setStrengthConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Refs
  const inputRefs = useRef([]);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  // Password strength handling
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setFormData({ ...formData, password: value });

    const conditions = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setStrengthConditions(conditions);

    const satisfiedConditions =
      Object.values(conditions).filter(Boolean).length;
    if (satisfiedConditions <= 2) setStrength("weak");
    else if (satisfiedConditions === 3 || satisfiedConditions === 4)
      setStrength("good");
    else if (satisfiedConditions === 5) setStrength("strong");
  };

  // Form handling
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const agreeToTerms = () => {
    setAgree(!agree);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("This is formData", formData);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirm
    ) {
      setErrorMessage("Please fill out all fields.");
      setShowModal(true);
      return;
    }

    if (formData.password !== formData.confirm) {
      setErrorMessage("Passwords do not match.");
      setShowModal(true);
      return;
    }

    if (agree === false) {
      setErrorMessage("Please agree to our privacy policy.");
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setErrorMessage(data.message);
        setShowModal(true);
        setLoading(false);
        return;
      }

      setLoading(false);
      setVerificationModal(true);
    } catch (error) {
      console.log("This is error", error);
      setErrorMessage(error.message);
      setLoading(false);
      console.log(error);
      setShowModal(true);
    }
  };

  // OTP verification
  const handleVerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== length) {
      setModalMessage(`Code must be ${length} digits`);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: otpString }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(2);
      } else {
        setModalMessage(data.message);
        console.log(data);
      }
    } catch (error) {
      setErrorMessage("Error verifying OTP. Please try again.");
      setShowModal(true);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage("Error resending OTP. Please try again.");
        setShowModal(true);
      } else {
        // Show success toast
        setModalMessage("Verification code resent successfully");
        setTimeout(() => setModalMessage(null), 3000);
      }
    } catch (error) {
      setErrorMessage("Error resending OTP. Please try again.");
      setShowModal(true);
    }
  };

  // OTP input handling
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const return_to_previous_page = () => {
    navigate(-1);
  };

  // Effects
  useEffect(() => {
    if (verificationModal && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [verificationModal]);

  useEffect(() => {
    if (showModal || loading || modalMessage) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setLoading(false);
        setModalMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal, loading, modalMessage]);

  useEffect(() => {
    const close_password_strength_checker = (event) => {
      if (passwordRef.current && !passwordRef.current.contains(event.target)) {
        setPassword(false);
      }
    };

    document.addEventListener("mousedown", close_password_strength_checker);

    return () => {
      document.removeEventListener(
        "mousedown",
        close_password_strength_checker
      );
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-16 px-4 flex items-center justify-center relative">
      {/* Back Button */}
      <button
        className="absolute left-4 top-4 sm:left-8 sm:top-8 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-blue-50 transition-colors"
        onClick={return_to_previous_page}
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-blue-600" />
      </button>

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h1>
            <p className="text-gray-600">
              Join us for a better travel experience
            </p>
          </div>

          {/* OAuth and Divider */}
          <div className="mb-8">
            <OAuth label={"Sign up with Google"} />
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or with email
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="John"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Doe"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="your@email.com"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Input */}
            <div ref={passwordRef}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  onChange={handlePasswordChange}
                  onFocus={() => setPassword(true)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <EyeOff
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Password strength:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          strength === "weak"
                            ? "text-red-500"
                            : strength === "good"
                            ? "text-amber-500"
                            : "text-green-500"
                        }`}
                      >
                        {strength.charAt(0).toUpperCase() + strength.slice(1)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full mb-4 overflow-hidden">
                      <div
                        className={`h-full ${
                          strength === "weak"
                            ? "bg-red-500 w-1/3"
                            : strength === "good"
                            ? "bg-amber-500 w-2/3"
                            : "bg-green-500 w-full"
                        } transition-all duration-300`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            strengthConditions.length
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {strengthConditions.length ? <Check size={12} /> : ""}
                        </div>
                        <span
                          className={`ml-2 text-xs ${
                            strengthConditions.length
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          At least 8 characters
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            strengthConditions.uppercase
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {strengthConditions.uppercase ? (
                            <Check size={12} />
                          ) : (
                            ""
                          )}
                        </div>
                        <span
                          className={`ml-2 text-xs ${
                            strengthConditions.uppercase
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          One uppercase letter
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            strengthConditions.lowercase
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {strengthConditions.lowercase ? (
                            <Check size={12} />
                          ) : (
                            ""
                          )}
                        </div>
                        <span
                          className={`ml-2 text-xs ${
                            strengthConditions.lowercase
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          One lowercase letter
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            strengthConditions.number
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {strengthConditions.number ? <Check size={12} /> : ""}
                        </div>
                        <span
                          className={`ml-2 text-xs ${
                            strengthConditions.number
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          One number
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                            strengthConditions.specialChar
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {strengthConditions.specialChar ? (
                            <Check size={12} />
                          ) : (
                            ""
                          )}
                        </div>
                        <span
                          className={`ml-2 text-xs ${
                            strengthConditions.specialChar
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          One special character
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirm"
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  aria-label={
                    confirmPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {confirmPasswordVisible ? (
                    <EyeOff
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={agree}
                  onChange={agreeToTerms}
                  className="sr-only"
                />
                <div
                  onClick={agreeToTerms}
                  className={`w-5 h-5 rounded border transition-colors cursor-pointer flex items-center justify-center ${
                    agree
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {agree && <Check size={14} className="text-white" />}
                </div>
                <label
                  htmlFor="rememberMe"
                  className="ml-2 cursor-pointer select-none"
                >
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/policy"
                      className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={strength !== "strong" || loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                strength !== "strong" || loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } transition-colors duration-300`}
            >
              {loading ? (
                <SyncLoader
                  color="#ffffff"
                  loading={loading}
                  size={8}
                  margin={4}
                />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <h3 className="text-lg font-medium text-gray-900">Error</h3>
                    <p className="mt-1 text-sm text-gray-600">{errorMessage}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {verificationModal && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden shadow-xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {step === 1 ? "Verify Your Email" : "Success"}
                </h3>
                <button
                  type="button"
                  className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                  onClick={() => setVerificationModal(false)}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* OTP Verification - Step 1 */}
              {step === 1 && (
                <div className="p-6">
                  <p className="mb-4 text-gray-600">
                    We've sent a verification code to your email. Please enter
                    the code below to verify your account.
                  </p>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="flex justify-center space-x-2">
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          ref={(input) => (inputRefs.current[index] = input)}
                          type="text"
                          value={value}
                          onChange={(e) => handleOtpChange(index, e)}
                          onClick={() => handleClick(index)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    {modalMessage && (
                      <p className="mt-2 text-sm text-center text-red-600">
                        {modalMessage}
                      </p>
                    )}
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Didn't receive a code? Resend
                      </button>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              )}

              {/* Success - Step 2 */}
              {step === 2 && (
                <div className="p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Account Created Successfully
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your account has been successfully created and verified. You
                    can now sign in to access your account.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationModal(false);
                        setTimeout(() => {
                          navigate("/signin");
                        }, 1000);
                      }}
                      className="inline-flex justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignUp;
