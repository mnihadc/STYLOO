import { useState } from "react";
import {
  FaInstagram,
  FaShoppingCart,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Added for navigation

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false); // Added state for checkbox
  const navigate = useNavigate(); // Added for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if terms are accepted
    if (!termsAccepted) {
      toast.error("Please accept the Terms and Privacy Policy");
      return;
    }

    setErrors({});

    try {
      const response = await axios.post("/api/auth/signup", formData);
      toast.success("Signup successful! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        toast.error(message || "Signup failed.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h2>
        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4 mb-6">
          <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
            <FaFacebook className="mr-2" />
            Continue with Facebook
          </button>
          <button className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition">
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>
        </div>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Choose a username"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Your email address"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-700 rounded"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              I agree to the{" "}
              <a href="#" className="text-pink-500 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-pink-500 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-2 px-4 rounded-md font-medium transition duration-300 ${
              !termsAccepted
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-pink-600 hover:to-yellow-600"
            }`}
            disabled={!termsAccepted}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-pink-500 hover:underline font-medium"
          >
            Log in
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© 2023 SocialShop. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SignupPage;
