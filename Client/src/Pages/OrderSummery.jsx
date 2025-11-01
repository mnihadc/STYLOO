import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const OrderSummaryPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderStatus, setOrderStatus] = useState(""); // To track the order status

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
        setAddress(null);
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

  const handlePlaceOrder = async () => {
    if (selectedPayment === "cod") {
      try {
        setOrderStatus("Processing your order...");

        const response = await fetch("/api/order/place-cod-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            paymentMethod: "Cash on Delivery",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to place order");
        }

        // Redirect to success page with order details
        window.location.href =
          data.redirectUrl ||
          `/place-order-success?orderId=${data.orderId}&paymentMethod=COD`;
      } catch (error) {
        console.error("Order placement error:", error);
        setOrderStatus(
          error.message || "Something went wrong while placing your order."
        );
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 flex items-center justify-between lg:px-8 lg:py-6">
        <Link to="/">
          <button className="text-xl lg:text-2xl">
            <FiChevronLeft />
          </button>
        </Link>
        <h1 className="text-xl font-bold lg:text-3xl">Order Summary</h1>
        <div className="w-6 lg:w-8"></div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 lg:text-lg">
          Loading...
        </div>
      ) : cartItems.length === 0 ? (
        // Empty Cart State
        <div className="flex flex-col items-center justify-center h-96 px-4 text-center lg:py-16">
          <FiShoppingCart className="text-5xl text-gray-600 mb-4 lg:text-6xl" />
          <h2 className="text-2xl font-bold mb-2 lg:text-3xl">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-6 lg:text-lg">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link to="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium lg:py-3 lg:px-8 lg:text-lg">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="pb-32 lg:flex lg:max-w-7xl lg:mx-auto lg:gap-8 lg:p-8 lg:pb-8">
          {/* Left Column - Order Details */}
          <div className="lg:flex-1 lg:max-w-2xl">
            {/* Delivery Address Section */}
            <div className="p-4 border-b border-gray-800 lg:p-6 lg:border lg:border-gray-800 lg:rounded-xl lg:mb-6 lg:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold lg:text-xl">
                  Delivery Address
                </h2>
                {address && (
                  <Link to="/address">
                    <button className="text-blue-500 hover:underline text-sm lg:text-base">
                      Change
                    </button>
                  </Link>
                )}
              </div>
              {address ? (
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 lg:bg-transparent lg:border-0 lg:p-0">
                  <p className="font-medium lg:text-lg">{address.fullName}</p>
                  <p className="text-sm text-gray-400 lg:text-base">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-sm text-gray-400 lg:text-base">
                      {address.addressLine2}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 lg:text-base">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-400 lg:text-base">
                    Mobile: {address.phoneNumber}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 text-center lg:bg-transparent lg:border-0">
                  <p className="text-gray-400 mb-2 lg:text-lg">
                    No delivery address found.
                  </p>
                  <Link to="/address">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full font-medium lg:py-3 lg:px-6 lg:text-base">
                      Add Address
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Items Section */}
            <div className="p-4 border-b border-gray-800 lg:p-6 lg:border lg:border-gray-800 lg:rounded-xl lg:mb-6 lg:bg-gray-900">
              <h2 className="text-lg font-bold mb-2 lg:text-xl">
                Order Items ({cartItems.length})
              </h2>
              <div className="space-y-3 lg:space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex lg:p-4"
                  >
                    <div className="w-20 h-20 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 lg:w-24 lg:h-24">
                      <img
                        src={item.product.imageUrl || item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1 lg:ml-4">
                      <h3 className="font-medium line-clamp-2 lg:text-lg">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center mt-1 lg:mt-2">
                        <span className="text-lg font-bold lg:text-xl">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 lg:text-base">
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </p>
                      <p className="text-sm text-gray-400 lg:text-base">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Details */}
            <div className="p-4 border-b border-gray-800 lg:p-6 lg:border lg:border-gray-800 lg:rounded-xl lg:mb-6 lg:bg-gray-900">
              <h2 className="text-lg font-bold mb-3 lg:text-xl">
                Price Details
              </h2>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between lg:text-lg">
                  <span className="text-gray-400">
                    Price ({cartItems.length} items)
                  </span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between lg:text-lg">
                  <span className="text-gray-400">Delivery Charges</span>
                  <span className="text-green-500">
                    ₹{shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-800 mt-2 lg:pt-3 lg:mt-3 lg:text-xl">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Options */}
          <div className="lg:w-96 lg:sticky lg:top-24 lg:h-fit">
            <div className="p-4 mb-24 lg:p-6 lg:border lg:border-gray-800 lg:rounded-xl lg:bg-gray-900 lg:mb-0">
              <h2 className="text-lg font-bold mb-3 lg:text-xl">
                Choose Payment Method
              </h2>
              <div className="space-y-3 lg:space-y-4">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`bg-gray-900 rounded-lg p-3 border lg:p-4 ${
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
                        className="w-6 h-6 mr-3 lg:w-7 lg:h-7"
                      />
                      <div className="flex-1">
                        <p className="font-medium lg:text-lg">{option.name}</p>
                        <p className="text-xs text-gray-400 lg:text-sm">
                          {option.description}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === option.id}
                        onChange={() => setSelectedPayment(option.id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 lg:h-6 lg:w-6"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Status Message */}
              {orderStatus && (
                <div className="text-center text-lg font-semibold mt-4 text-green-500 lg:text-xl">
                  {orderStatus}
                </div>
              )}

              {/* Desktop Checkout Button */}
              <div className="hidden lg:block mt-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 lg:text-lg">Total</span>
                  <span className="font-bold text-lg lg:text-xl">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <button
                  className={`w-full py-3 rounded-lg font-bold lg:py-4 lg:text-lg ${
                    selectedPayment
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 cursor-not-allowed"
                  }`}
                  disabled={!selectedPayment}
                  onClick={handlePlaceOrder}
                >
                  {selectedPayment === "cod" ? "Place Order" : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Checkout Button - Mobile Only */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-black border-t border-gray-800 p-4 z-40 lg:hidden">
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
            onClick={handlePlaceOrder}
          >
            {selectedPayment === "cod" ? "Place Order" : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryPage;
