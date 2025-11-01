import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      toast.error("Failed to load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelectAddress = async (id) => {
    setSelectedAddress(id); // update local state for UI

    try {
      const response = await axios.put(
        `/api/address/select-address/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Address selected as default");
        fetchAddresses(); // refresh the list to reflect updated default
      }
    } catch (error) {
      console.error("Failed to select address:", error);
      toast.error("Failed to select address. Please try again.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await axios.put(
        `/api/address/select-address/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Default address updated successfully");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error("Failed to set default address. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    const address = addresses.find((addr) => addr._id === id);
    if (address?.isDefault) {
      toast.warning(
        "Cannot delete default address. Please set another address as default first."
      );
      return;
    }
    setAddressToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/address/delete-address/${addressToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Address deleted successfully");
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 text-center flex items-center justify-center">
        <div className="animate-pulse">
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 relative">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full sm:max-w-lg border border-gray-700 overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-500/20 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">
                Delete Address?
              </h3>
              <p className="text-gray-400 text-center mb-6 sm:text-lg">
                This will permanently remove the address from your account. You
                won't be able to undo this action.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAddress}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium flex items-center justify-center text-sm sm:text-base"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold lg:text-3xl xl:text-4xl">
            My Addresses
          </h1>
          <Link to="/create-address">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors lg:px-6 lg:py-3 lg:text-base">
              + Create New
            </button>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto lg:h-16 lg:w-16"
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
            <h3 className="text-lg font-medium mb-2 lg:text-xl lg:mb-4">
              No Addresses Saved
            </h3>
            <p className="text-gray-400 mb-4 lg:text-lg lg:mb-6">
              You haven't added any addresses yet.
            </p>
            <Link to="/create-address">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors lg:px-8 lg:py-3 lg:text-lg">
                Add New Address
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 transition-all lg:p-6 ${
                  selectedAddress === address._id
                    ? "border-blue-500 bg-gray-900"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg lg:text-xl">
                      {address.fullName}
                    </h3>
                    <p className="text-gray-300 mt-2 lg:text-base">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                      <br />
                      {address.country}
                    </p>
                    <p className="text-gray-400 mt-2 lg:text-base">
                      {address.phoneNumber}
                    </p>
                  </div>
                  {address.isDefault && (
                    <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded ml-2 lg:text-sm">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex justify-between mt-4 lg:mt-6">
                  <button
                    onClick={() => handleSelectAddress(address._id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors lg:px-5 lg:py-2.5 lg:text-base ${
                      selectedAddress === address._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {selectedAddress === address._id ? "Selected" : "Select"}
                  </button>

                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-gray-400 hover:text-white text-sm font-medium transition-colors lg:text-base"
                      disabled={address.isDefault}
                    >
                      {address.isDefault ? "Default" : "Set as Default"}
                    </button>

                    <button
                      onClick={() => confirmDelete(address._id)}
                      className="text-red-500 hover:text-red-600 transition-colors lg:scale-110"
                      title="Delete"
                    >
                      <Trash2 size={18} className="lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-8 lg:mt-12">
            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors lg:py-4 lg:text-lg ${
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
