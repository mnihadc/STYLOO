import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const OrderSummaryPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart/user-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data.cart?.items || []);
      } else {
        console.error("Failed to fetch cart:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };
  const [address, setAddress] = useState(null);

  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch("/api/address/get-default-address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAddress(data.data);
      } else {
        setAddress(null); // No default address found
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress(null);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchDefaultAddress();
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = 49;
  const total = subtotal + shipping;

  const paymentOptions = [
    {
      id: "upi",
      name: "UPI",
      icon: "https://via.placeholder.com/24",
      description: "Pay via any UPI app",
    },
    {
      id: "cards",
      name: "Credit/Debit Card",
      icon: "https://via.placeholder.com/24",
      description: "Add and secure your card as per RBI guidelines",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "https://via.placeholder.com/24",
      description: "All major banks supported",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "https://via.placeholder.com/24",
      description: "Pay when you receive the order",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {" "}
      {/* Increased bottom padding */}
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 flex items-center justify-between">
        <Link to="/">
          <button className="text-xl">
            <FiChevronLeft />
          </button>
        </Link>
        <h1 className="text-xl font-bold">Order Summary</h1>
        <div className="w-6"></div>
      </div>
      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : cartItems.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center h-96 px-4 text-center">
          <FiShoppingCart className="text-5xl text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link to="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="pb-32">
          {" "}
          {/* Increased bottom padding */}
          {/* Delivery Address */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Delivery Address</h2>
              {address && (
                <Link to="/address">
                  <button className="text-blue-500 hover:underline text-sm">
                    Change
                  </button>
                </Link>
              )}
            </div>
            {address ? (
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-sm text-gray-400">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="text-sm text-gray-400">
                    {address.addressLine2}
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-gray-400">
                  Mobile: {address.phoneNumber}
                </p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 text-center">
                <p className="text-gray-400 mb-2">No delivery address found.</p>
                <Link to="/address">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full font-medium">
                    Add Address
                  </button>
                </Link>
              </div>
            )}
          </div>
          {/* Order Items */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold mb-2">
              Order Items ({cartItems.length})
            </h2>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex"
                >
                  <div className="w-20 h-20 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl || item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="ml-3 flex-1">
                    <h3 className="font-medium line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-bold">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                      Size: {item.selectedSize} | Color: {item.selectedColor}
                    </p>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Price Details */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold mb-3">Price Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Price ({cartItems.length} items)
                </span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery Charges</span>
                <span className="text-green-500">
                  ₹{shipping.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-800 mt-2">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Payment Options */}
          <div className="p-4 mb-24">
            {" "}
            {/* Added margin bottom */}
            <h2 className="text-lg font-bold mb-3">Choose Payment Method</h2>
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`bg-gray-900 rounded-lg p-3 border ${
                    selectedPayment === option.id
                      ? "border-blue-500"
                      : "border-gray-800"
                  }`}
                  onClick={() => setSelectedPayment(option.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={option.icon}
                      alt={option.name}
                      className="w-6 h-6 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{option.name}</p>
                      <p className="text-xs text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === option.id}
                      onChange={() => setSelectedPayment(option.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Fixed Bottom Checkout Button - Now properly spaced */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-black border-t border-gray-800 p-4 z-40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total</span>
            <span className="font-bold text-lg">₹{total.toLocaleString()}</span>
          </div>
          <button
            className={`w-full py-3 rounded-lg font-bold ${
              selectedPayment
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
            disabled={!selectedPayment}
          >
            {selectedPayment === "cod" ? "Place Order" : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryPage;
