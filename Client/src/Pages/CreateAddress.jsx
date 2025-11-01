import { useState } from "react";
import axios from "axios";
import {
  FiArrowLeft,
  FiMapPin,
  FiUser,
  FiPhone,
  FiHome,
  FiNavigation,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddressCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/address/create-address",
        formData,
        {
          headers: {
            Authorization: "authToken",
          },
        }
      );
      console.log("Address created:", response.data);
      navigate("/address");
    } catch (error) {
      console.error(
        "Error creating address:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 lg:p-8">
      <div className="max-w-md mx-auto lg:max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6 lg:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 mr-4 lg:p-3"
          >
            <FiArrowLeft className="text-xl lg:text-2xl" />
          </button>
          <h1 className="text-2xl font-bold lg:text-3xl">Add New Address</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          {/* Full Name */}
          <div className="relative lg:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none lg:pl-4">
              <FiUser className="text-gray-400 lg:text-xl" />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:pl-12 lg:py-4 lg:text-lg"
            />
          </div>

          {/* Phone Number */}
          <div className="relative lg:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none lg:pl-4">
              <FiPhone className="text-gray-400 lg:text-xl" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:pl-12 lg:py-4 lg:text-lg"
            />
          </div>

          {/* Address Line 1 */}
          <div className="relative lg:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none lg:pl-4">
              <FiHome className="text-gray-400 lg:text-xl" />
            </div>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Address Line 1 (House No, Building)"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:pl-12 lg:py-4 lg:text-lg"
            />
          </div>

          {/* Address Line 2 */}
          <div className="relative lg:max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none lg:pl-4">
              <FiNavigation className="text-gray-400 lg:text-xl" />
            </div>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Address Line 2 (Area, Colony)"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:pl-12 lg:py-4 lg:text-lg"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 lg:max-w-xl">
            <div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:py-4 lg:text-lg"
              />
            </div>

            {/* State */}
            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:py-4 lg:text-lg"
              />
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 lg:max-w-xl">
            <div>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:py-4 lg:text-lg"
              />
            </div>

            <div>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:py-4 lg:text-lg"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center lg:max-w-xl lg:mt-4">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-600 lg:h-6 lg:w-6"
            />
            <label
              htmlFor="isDefault"
              className="ml-2 text-gray-300 lg:text-lg lg:ml-3"
            >
              Set as default address
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 lg:max-w-xl lg:py-4 lg:text-lg lg:font-semibold"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressCreatePage;
