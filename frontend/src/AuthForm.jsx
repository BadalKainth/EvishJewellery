// src/AuthForm.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons
import { useNavigate } from "react-router-dom";

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

  // 👁️ control states for show/hide
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  // ✅ Validation rules (same as before)
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
        "Must be 8+ chars, include uppercase, lowercase, number, and special char";

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
      // ✅ redirect on success
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
      // ✅ redirect on success
      navigate("/");
    } catch (err) {
      setErrors({ general: err.message || "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {isSignup ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            {errors.general && (
              <p className="text-red-600 text-sm text-center">
                {errors.general}
              </p>
            )}

            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                className="w-full p-3 border rounded"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full p-3 border rounded"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
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
                className="w-full p-3 border rounded"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full p-3 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
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
                className="w-full p-3 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-60"
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
            <h2 className="text-2xl font-bold text-center">Sign In</h2>
            {errors.general && (
              <p className="text-red-600 text-sm text-center">
                {errors.general}
              </p>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={signinData.email}
                onChange={(e) =>
                  setSigninData({ ...signinData, email: e.target.value })
                }
                className="w-full p-3 border rounded"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password with eye */}
            <div className="relative">
              <input
                type={showSigninPassword ? "text" : "password"}
                placeholder="Password"
                value={signinData.password}
                onChange={(e) =>
                  setSigninData({ ...signinData, password: e.target.value })
                }
                className="w-full p-3 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSigninPassword(!showSigninPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showSigninPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition disabled:opacity-60"
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
  );
};

export default AuthForm;
