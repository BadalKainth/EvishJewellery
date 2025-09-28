// src/AuthForm.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authIllustration from "../src/img/avishlogo.jpeg"; // Your illustration

const AuthForm = () => {
  const { login, register } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  const validateSignup = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!signupData.name.trim()) newErrors.name = "Name is required";
    if (!signupData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(signupData.email))
      newErrors.email = "Invalid email format";

    if (!signupData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(signupData.phone))
      newErrors.phone = "Phone number must be exactly 10 digits";

    if (!signupData.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(signupData.password))
      newErrors.password =
        "8+ chars, uppercase, lowercase, number & special char required";

    if (signupData.password !== signupData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignin = () => {
    const newErrors = {};
    if (!signinData.email) newErrors.email = "Email is required";
    if (!signinData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setSubmitting(true);
    try {
      await register(signupData);
      setSignupData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      navigate("/");
    } catch (err) {
      setErrors({ general: err.message || "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!validateSignin()) return;
    setSubmitting(true);
    try {
      await login(signinData);
      setSigninData({ email: "", password: "" });
      setErrors({});
      navigate("/");
    } catch (err) {
      setErrors({ general: err.message || "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen poppins-regular flex items-center justify-center bg-gradient-to-r from-blue-50 to-green-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Illustration */}
        <div className="flex w-full md:w-1/2 bg-blue-100 items-center justify-center p-6">
          <img
            src={authIllustration}
            alt="Auth Illustration"
            className="w-3/4 h-auto"
          />
        </div>

        {/* Form Container */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          {isSignup ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Create Account
              </h2>
              {errors.general && (
                <p className="text-red-600 text-sm text-center">
                  {errors.general}
                </p>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  maxLength={10}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
              >
                {submitting ? "Signing up..." : "Sign Up"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignin} className="space-y-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Welcome Back
              </h2>
              {errors.general && (
                <p className="text-red-600 text-sm text-center">
                  {errors.general}
                </p>
              )}

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={signinData.email}
                  onChange={(e) =>
                    setSigninData({ ...signinData, email: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                />

                <div className="relative">
                  <input
                    type={showSigninPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signinData.password}
                    onChange={(e) =>
                      setSigninData({ ...signinData, password: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSigninPassword(!showSigninPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  >
                    {showSigninPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="text-green-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
