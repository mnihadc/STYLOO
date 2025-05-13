import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/api/address/get-address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const fetchedAddresses = response.data.data || [];

      setAddresses(fetchedAddresses);
      if (fetchedAddresses.length > 0) {
        const defaultAddress = fetchedAddresses.find((addr) => addr.isDefault);
        setSelectedAddress(defaultAddress?._id || fetchedAddresses[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelectAddress = (id) => {
    setSelectedAddress(id);
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await axios.put(
        `/api/address/set-default/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 text-center">
        <p>Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <Link to="/create-address">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              + Create New
            </button>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Addresses Saved</h3>
            <p className="text-gray-400 mb-4">
              You haven't added any addresses yet.
            </p>
            <Link to="/create-address">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Add New Address
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 ${
                  selectedAddress === address._id
                    ? "border-blue-500 bg-gray-900"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{address.fullName}</h3>
                    <p className="text-gray-300">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                      <br />
                      {address.country}
                    </p>
                    <p className="text-gray-400 mt-2">{address.phoneNumber}</p>
                  </div>
                  {address.isDefault && (
                    <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleSelectAddress(address._id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedAddress === address._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {selectedAddress === address._id ? "Selected" : "Select"}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-gray-400 hover:text-white text-sm font-medium"
                      disabled={address.isDefault}
                    >
                      {address.isDefault ? "Default" : "Set as Default"}
                    </button>

                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-8">
            <button
              className={`w-full py-3 rounded-lg font-medium ${
                selectedAddress
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
              disabled={!selectedAddress}
            >
              Continue with Selected Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
