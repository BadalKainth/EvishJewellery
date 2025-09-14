// src/AuthForm.jsx
import React, { useState } from "react";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({ email: "", password: "" });

  const handleSignup = (e) => {
    e.preventDefault();
    alert("Signup successful! Please sign in.");
    setSignupData({ username: "", email: "",phone: "", password: "" });
    setIsSignup(false);
  };

  const handleSignin = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "demo-token"); //////////// token set /////////////
    alert("Signed in successfully!");
    window.location.reload();
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {isSignup ? (
          <form onSubmit={handleSignup} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              required
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
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
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              Sign Up
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
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
            >
              Sign In
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
