// src/AuthForm.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";

const AuthForm = () => {
  const { login, register } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(true);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
      });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login({ email: signinData.email, password: signinData.password });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {isSignup ? (
          <form onSubmit={handleSignup} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <input
              type="text"
              placeholder="Full name"
              required
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
            <input
              type="phone"
              placeholder="Phone Number"
              required
              value={signupData.phone}
              onChange={(e) =>
                setSignupData({ ...signupData, phone: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
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
          <form onSubmit={handleSignin} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Sign In</h2>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              required
              value={signinData.email}
              onChange={(e) =>
                setSigninData({ ...signinData, email: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
              className="w-full p-3 border rounded"
            />
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
