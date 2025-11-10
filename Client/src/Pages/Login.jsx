import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaFacebook,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { signInSuccess, signInFailure } from "../Redux/user/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/auth/login", formData);
      const { success, user, token, message } = response.data;

      console.log("Login response:", response.data);

      if (success && user && token) {
        dispatch(
          signInSuccess({
            user: user,
            token: token,
          })
        );

        localStorage.setItem("token", token);
        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/");
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-gray-900 rounded-lg lg:rounded-xl shadow-lg p-8 lg:p-10 xl:p-12 relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-80 rounded-lg lg:rounded-xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="text-white text-lg font-medium">
                Logging you in...
              </p>
            </div>
          </div>
        )}

        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-center mb-6 lg:mb-8">
          Welcome Back
        </h2>

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4 lg:space-y-5 mb-6 lg:mb-8">
          <button
            type="button"
            disabled={isLoading}
            className={`flex items-center justify-center bg-blue-600 text-white py-2 lg:py-3 px-4 rounded-md lg:rounded-lg transition text-sm lg:text-base xl:text-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            <FaFacebook className="mr-2 lg:mr-3 text-sm lg:text-base xl:text-lg" />
            Continue with Facebook
          </button>
          <button
            type="button"
            disabled={isLoading}
            className={`flex items-center justify-center bg-red-600 text-white py-2 lg:py-3 px-4 rounded-md lg:rounded-lg transition text-sm lg:text-base xl:text-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            <FaGoogle className="mr-2 lg:mr-3 text-sm lg:text-base xl:text-lg" />
            Continue with Google
          </button>
        </div>

        <div className="flex items-center my-6 lg:my-8">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-400 text-sm lg:text-base">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm lg:text-base font-medium mb-1 lg:mb-2"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-gray-800 border border-gray-700 rounded-md lg:rounded-lg py-2 lg:py-3 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your email or username"
              autoComplete="username"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm lg:text-base font-medium mb-1 lg:mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-gray-800 border border-gray-700 rounded-md lg:rounded-lg py-2 lg:py-3 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              disabled={isLoading}
              className={`absolute right-3 lg:right-4 top-8 lg:top-10 text-gray-400 ${
                isLoading ? "cursor-not-allowed" : "hover:text-white"
              } text-sm lg:text-base`}
              onClick={() => !isLoading && setShowPassword(!showPassword)}
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
                onChange={() => !isLoading && setRememberMe(!rememberMe)}
                disabled={isLoading}
                className={`h-4 w-4 lg:h-5 lg:w-5 text-pink-500 focus:ring-pink-500 border-gray-700 rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <label
                htmlFor="remember"
                className={`ml-2 text-sm lg:text-base ${
                  isLoading ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className={`text-sm lg:text-base text-pink-500 ${
                isLoading ? "pointer-events-none opacity-50" : "hover:underline"
              }`}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-2 lg:py-3 px-4 rounded-md lg:rounded-lg font-medium transition duration-300 text-sm lg:text-base xl:text-lg relative ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-pink-600 hover:to-yellow-600"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-6 lg:mt-8 text-center text-sm lg:text-base text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className={`text-pink-500 ${
              isLoading ? "pointer-events-none opacity-50" : "hover:underline"
            } font-medium`}
          >
            Sign up
          </Link>
        </div>
      </div>

      <div className="mt-8 lg:mt-10 text-center text-xs lg:text-sm text-gray-500">
        <p>© 2023 SocialShop. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
