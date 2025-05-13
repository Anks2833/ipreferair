import React, { useEffect, useRef, useState } from "react";
import OAuth from "../components/OAuth";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Mail,
  Check,
} from "lucide-react";
import { SyncLoader } from "react-spinners";

const SignIn = ({ length = 4 }) => {
  const [formData, setFormData] = useState({});
  const { error: errorMessage } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("weak");
  const [strengthConditions, setStrengthConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const inputRefs = useRef([]);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Password reset functions
  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      setModalMessage("Please enter your email address");
      return;
    }

    try {
      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
      } else {
        console.error(data.message);
        dispatch(signInFailure(data.message));
        setModalMessage(data.message);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  const handleVerifyCode = async () => {
    if (otp.join("").length !== length) {
      setModalMessage(`Code must be ${length} digits`);
      return;
    }

    const codeToSubmit = otp.join("");

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, code: codeToSubmit }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3);
      } else {
        console.error("Verification failed:", data.message);
        setModalMessage(data.message);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(4);
      } else {
        console.error("Error resetting password:", data.message);
        setModalMessage(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  // Form handling functions
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill out all fields."));
      setShowModal(true);
      return;
    }

    try {
      dispatch(signInStart());
      setLoading(true);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setShowModal(true);
        setLoading(false);
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(data));

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      setLoading(false);
    } catch (error) {
      dispatch(signInFailure(error.message));
      setShowModal(true);
      console.log(error);
    }
  };

  // OTP handling functions
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

  // Password strength functions
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

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

  const return_to_previous_page = () => {
    navigate(-1);
  };

  // Effects
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

  useEffect(() => {
    if (forgotPasswordModal && step === 2 && inputRefs.current[0]) {
      const timer = setTimeout(() => {
        inputRefs.current[0].focus();
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [forgotPasswordModal, step]);

  useEffect(() => {
    if (showModal || modalMessage || loading) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setModalMessage(null);
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading, modalMessage, showModal]);

  const handleCheckboxChange = () => {
    setKeepMeSignedIn(!keepMeSignedIn);
  };

  // Animation variants
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-16 px-4 flex items-center justify-center relative">
      {/* Back Button */}
      <NavLink
        className="absolute left-4 top-4 sm:left-8 sm:top-8 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-blue-50 transition-colors"
        to="/"
      >
        <ArrowLeft size={20} className="text-blue-600" />
      </NavLink>

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
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* OAuth and Divider */}
          <div className="mb-8">
            <OAuth label={"Sign in with Google"} />
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
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
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => setForgotPasswordModal(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  onChange={handleChange}
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
            </div>

            {/* Keep Me Signed In */}
            <div className="flex items-center">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  id="keepMeSignedIn"
                  checked={keepMeSignedIn}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div
                  onClick={handleCheckboxChange}
                  className={`w-5 h-5 rounded border transition-colors cursor-pointer flex items-center justify-center ${
                    keepMeSignedIn
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {keepMeSignedIn && <Check size={14} className="text-white" />}
                </div>
                <label
                  htmlFor="keepMeSignedIn"
                  className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
                >
                  Keep me signed in
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <SyncLoader
                  color="#ffffff"
                  loading={loading}
                  size={8}
                  margin={4}
                />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign up
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

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotPasswordModal && (
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
                <div className="flex items-center">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="mr-2 rounded-full p-1 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-500" />
                    </button>
                  )}
                  <h3 className="text-lg font-medium text-gray-900">
                    {step === 1 && "Reset Password"}
                    {step === 2 && "Verification Code"}
                    {step === 3 && "New Password"}
                    {step === 4 && "Success"}
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                  onClick={() => setForgotPasswordModal(false)}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Step 1: Email Input */}
              {step === 1 && (
                <div className="p-6">
                  <p className="mb-4 text-gray-600">
                    Enter your email address and we'll send you a verification
                    code to reset your password.
                  </p>
                  <div className="mb-4">
                    <label
                      htmlFor="resetEmail"
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
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="your@email.com"
                        autoComplete="off"
                      />
                    </div>
                    {modalMessage && (
                      <p className="mt-2 text-sm text-red-600">
                        {modalMessage}
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleSendResetEmail}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send Verification Code
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: OTP Input */}
              {step === 2 && (
                <div className="p-6">
                  <p className="mb-4 text-gray-600">
                    We've sent a verification code to{" "}
                    <span className="font-medium text-blue-600">
                      {resetEmail}
                    </span>
                    . Please enter the code below.
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
                      <p className="mt-2 text-sm text-red-600 text-center">
                        {modalMessage}
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <div className="p-6" ref={passwordRef}>
                  <p className="mb-4 text-gray-600">
                    Create a new password for your account.
                  </p>
                  <div className="mb-2">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type={newPasswordVisible ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        onFocus={() => setPassword(true)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="••••••••"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setNewPasswordVisible(!newPasswordVisible)
                        }
                      >
                        {newPasswordVisible ? (
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

                  {/* Password Strength Meter */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mt-2">
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
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
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

                    <div className="mt-4 space-y-2">
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
                          className={`ml-2 text-sm ${
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
                          className={`ml-2 text-sm ${
                            strengthConditions.uppercase
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          At least one uppercase letter
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
                          className={`ml-2 text-sm ${
                            strengthConditions.lowercase
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          At least one lowercase letter
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
                          className={`ml-2 text-sm ${
                            strengthConditions.number
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          At least one number
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
                          className={`ml-2 text-sm ${
                            strengthConditions.specialChar
                              ? "text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          At least one special character
                        </span>
                      </div>
                    </div>

                    {modalMessage && (
                      <p className="mt-2 text-sm text-red-600">
                        {modalMessage}
                      </p>
                    )}
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={strength !== "strong"}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                        strength !== "strong"
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Password Reset Successful
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordModal(false)}
                      className="inline-flex justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Return to Sign In
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

export default SignIn;
