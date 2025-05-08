import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { signInSuccess, signInFailure } from "../Redux/user/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", formData);
      const { success, user } = response.data;

      if (success && user) {
        dispatch(signInSuccess(user));
        toast.success("Login successful!");
        // Use a slightly longer delay or useEffect if needed
        setTimeout(() => {
          navigate("/shop");
        }, 1500);
      } else {
        dispatch(signInFailure(message || "Login failed. Try again."));
        toast.error(message || "Login failed. Try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 401
          ? "Invalid email or password"
          : "Something went wrong. Please try again.");
      dispatch(signInFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4 mb-6">
          <button
            type="button"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            <FaFacebook className="mr-2" />
            Continue with Facebook
          </button>
          <button
            type="button"
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email or username"
              autoComplete="username"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-700 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-pink-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white py-2 px-4 rounded-md font-medium transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© 2023 SocialShop. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
