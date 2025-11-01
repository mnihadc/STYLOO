import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  CheckCircle,
  Truck,
  ShieldCheck,
  Home,
  ShoppingBag,
  IndianRupee,
  QrCode,
  Wallet,
  ChevronRight,
  ArrowRight,
  Download,
  Clock,
} from "lucide-react";

const OrderSuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromParams = queryParams.get("orderId");
  const paymentMethodFromParams = queryParams.get("paymentMethod");

  const [paymentStatus, setPaymentStatus] = useState(
    paymentMethodFromParams === "COD" ? "cod" : "processing"
  );
  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodFromParams || "UPI"
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If coming from COD, skip payment processing
    if (paymentMethodFromParams === "COD") {
      setPaymentStatus("cod");
    }

    // For UPI payments, simulate processing
    const timer = setTimeout(() => {
      if (paymentMethodFromParams !== "COD") {
        setPaymentStatus("paid");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [paymentMethodFromParams]);

  useEffect(() => {
    const initializeOrderDetails = async () => {
      try {
        setLoading(true);

        // In a real app, you would fetch order details from your API here
        const mockOrder = {
          orderId:
            orderIdFromParams || `#${Math.floor(Math.random() * 1000000000)}`,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          deliveryDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          paymentMethod: paymentMethodFromParams || "UPI",
          amount: "₹4,999.00",
          shippingAddress:
            "123 Main Street, Bangalore, Karnataka 560001, India",
          items: [
            {
              name: "Wireless Bluetooth Headphones",
              quantity: 1,
              price: "₹1,999",
            },
            { name: "Smart Watch Pro", quantity: 1, price: "₹2,999" },
          ],
        };

        setOrderDetails(mockOrder);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load order details:", err);
        setError("Failed to load order details");
        setLoading(false);
      }
    };

    initializeOrderDetails();
  }, [orderIdFromParams, paymentMethodFromParams]);

  const handlePaymentMethodChange = (method) => {
    setIsAnimating(true);
    setTimeout(() => {
      setPaymentMethod(method);
      setPaymentStatus(method === "COD" ? "cod" : "processing");
      setIsAnimating(false);
    }, 300);
  };

  const handlePaymentComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPaymentStatus("paid");
      setIsAnimating(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">
            Error loading order details
          </h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">No order details found</h2>
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 overflow-hidden opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear ${
                Math.random() * 5
              }s infinite`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto py-8 px-4 lg:px-6 xl:px-8 z-10">
        {/* Success Card with Floating Animation */}
        <div
          className={`bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden mb-8 border border-gray-800 transform transition-all duration-500 ${
            isAnimating ? "scale-95 opacity-90" : "scale-100 opacity-100"
          }`}
        >
          <div className="p-6 md:p-8 lg:p-10">
            {paymentStatus === "processing" ? (
              <div className="flex flex-col items-center text-center mb-6 lg:mb-8">
                <div className="relative mb-4 lg:mb-6">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode className="h-8 w-8 lg:h-10 lg:w-10 text-blue-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 mb-2 lg:mb-4">
                  Complete Your Payment
                </h2>
                <p className="text-gray-300 mb-6 lg:mb-8 max-w-md lg:max-w-lg text-sm lg:text-base">
                  Scan the QR code or approve payment in your UPI app to
                  complete your order
                </p>

                <div className="relative group mb-6 lg:mb-8 w-full max-w-xs lg:max-w-sm">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <div className="relative bg-gray-800 p-4 lg:p-6 rounded-lg w-full">
                    <div className="flex justify-between items-center mb-3 lg:mb-4">
                      <span className="text-gray-400 text-sm lg:text-base">
                        Amount:
                      </span>
                      <span className="font-bold text-white text-sm lg:text-base">
                        {orderDetails.amount}
                      </span>
                    </div>
                    <div className="bg-white p-3 lg:p-4 rounded flex justify-center items-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10"></div>
                      <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gray-200 flex items-center justify-center relative z-10">
                        <QrCode className="h-24 w-24 lg:h-28 lg:w-28 text-black" />
                      </div>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-400 mt-3 lg:mt-4 text-center">
                      Scan to pay via any UPI app
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePaymentComplete}
                  className="relative group overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 lg:py-4 px-8 lg:px-12 rounded-lg transition-all duration-300 flex items-center text-sm lg:text-base"
                >
                  <span className="relative z-10">I've Made Payment</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </button>

                <div className="mt-6 lg:mt-8 flex items-center text-sm lg:text-base text-gray-400">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span>Payment session expires in 4:59</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mb-6 lg:mb-8">
                <div className="relative mb-6 lg:mb-8">
                  <div className="absolute inset-0 bg-green-500 rounded-full opacity-0 animate-ping-once"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4 lg:p-5 shadow-lg">
                    <CheckCircle className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-400 mb-2 lg:mb-4">
                  {paymentMethod === "COD"
                    ? "Order Confirmed!"
                    : "Payment Successful!"}
                </h2>
                <p className="text-gray-300 max-w-md lg:max-w-lg mb-4 lg:mb-6 text-sm lg:text-base">
                  {paymentMethod === "COD"
                    ? "Your order has been placed with Cash on Delivery. We'll notify you when it ships."
                    : "Thank you for your payment. Your order has been confirmed and is being processed."}
                </p>
                <div className="mt-4 lg:mt-6 bg-gray-800/50 px-5 lg:px-6 py-2 lg:py-3 rounded-full border border-gray-700 hover:border-green-500/50 transition duration-200">
                  <p className="text-sm lg:text-base font-medium">
                    <span className="text-green-400">Order ID:</span>{" "}
                    <span className="text-white">{orderDetails.orderId}</span>
                  </p>
                </div>

                <div className="mt-6 lg:mt-8 bg-gray-800/30 p-4 lg:p-6 rounded-lg border border-gray-700/50 w-full max-w-md lg:max-w-lg">
                  <div className="flex justify-between items-center mb-2 lg:mb-3">
                    <span className="text-gray-400 text-sm lg:text-base">
                      Estimated Delivery:
                    </span>
                    <span className="font-medium text-white flex items-center text-sm lg:text-base">
                      <Truck className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-blue-400" />
                      {orderDetails.deliveryDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm lg:text-base">
                      Total Paid:
                    </span>
                    <span className="font-bold text-green-400 text-lg lg:text-xl">
                      {orderDetails.amount}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-gray-800 pt-6 lg:pt-8">
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center">
                <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-green-400" />
                Order Summary
              </h3>

              {/* Payment Method Selector */}
              {paymentStatus === "processing" && (
                <div className="mb-6 lg:mb-8">
                  <h4 className="text-md lg:text-lg font-medium text-white mb-3 lg:mb-4">
                    Payment Method
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <button
                      onClick={() => handlePaymentMethodChange("UPI")}
                      className={`p-3 lg:p-4 rounded-lg border transition-all duration-300 ${
                        paymentMethod === "UPI"
                          ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                          : "border-gray-700 bg-gray-800 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <div
                          className={`p-2 lg:p-3 rounded-full ${
                            paymentMethod === "UPI"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          <Wallet className="h-5 w-5 lg:h-6 lg:w-6" />
                        </div>
                        <span className="text-white text-left text-sm lg:text-base">
                          UPI Payment
                          <span className="block text-xs lg:text-sm text-gray-400 mt-1">
                            Instant confirmation
                          </span>
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => handlePaymentMethodChange("COD")}
                      className={`p-3 lg:p-4 rounded-lg border transition-all duration-300 ${
                        paymentMethod === "COD"
                          ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                          : "border-gray-700 bg-gray-800 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <div
                          className={`p-2 lg:p-3 rounded-full ${
                            paymentMethod === "COD"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          <IndianRupee className="h-5 w-5 lg:h-6 lg:w-6" />
                        </div>
                        <span className="text-white text-left text-sm lg:text-base">
                          Cash on Delivery
                          <span className="block text-xs lg:text-sm text-gray-400 mt-1">
                            Pay when delivered
                          </span>
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <div className="bg-gray-800/50 p-4 lg:p-5 rounded-lg border border-gray-700 hover:border-blue-500/30 transition duration-200">
                  <p className="text-gray-400 text-sm lg:text-base mb-1 flex items-center">
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Order Date
                  </p>
                  <p className="font-medium text-white text-sm lg:text-base">
                    {orderDetails.date}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 lg:p-5 rounded-lg border border-gray-700 hover:border-purple-500/30 transition duration-200">
                  <p className="text-gray-400 text-sm lg:text-base mb-1 flex items-center">
                    <Truck className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Expected Delivery
                  </p>
                  <p className="font-medium text-white text-sm lg:text-base">
                    {orderDetails.deliveryDate}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 lg:p-5 rounded-lg border border-gray-700 mb-6 lg:mb-8 hover:border-green-500/30 transition duration-200 group">
                <p className="text-gray-400 text-sm lg:text-base mb-1 flex items-center">
                  <Home className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  Shipping Address
                </p>
                <p className="font-medium text-white text-sm lg:text-base">
                  {orderDetails.shippingAddress}
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
                  <button className="text-xs lg:text-sm text-green-400 flex items-center">
                    Change address{" "}
                    <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 ml-1" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 lg:p-6 rounded-lg border border-gray-700 flex justify-between items-center hover:shadow-lg hover:shadow-green-500/10 transition duration-300">
                <p className="text-gray-300 text-sm lg:text-base">
                  Total Amount {paymentMethod === "COD" ? "Payable" : "Paid"}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-green-400">
                  {orderDetails.amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 lg:p-7 rounded-xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group">
            <div className="flex items-start space-x-4 lg:space-x-5">
              <div className="bg-blue-500/20 rounded-full p-3 lg:p-4 border border-blue-500/30 group-hover:bg-blue-500/30 group-hover:border-blue-500/50 transition duration-300">
                <Truck className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-base lg:text-lg">
                  Track Your Order
                </h3>
                <p className="text-gray-400 text-sm lg:text-base mb-3">
                  Real-time updates on your delivery status
                </p>
                <button className="text-sm lg:text-base text-blue-400 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  View tracking{" "}
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 lg:p-7 rounded-xl border border-gray-800 hover:border-purple-500/50 transition duration-300 group">
            <div className="flex items-start space-x-4 lg:space-x-5">
              <div className="bg-purple-500/20 rounded-full p-3 lg:p-4 border border-purple-500/30 group-hover:bg-purple-500/30 group-hover:border-purple-500/50 transition duration-300">
                <ShieldCheck className="h-6 w-6 lg:h-7 lg:w-7 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-base lg:text-lg">
                  Purchase Protection
                </h3>
                <p className="text-gray-400 text-sm lg:text-base mb-3">
                  Full refund if items don't arrive as described
                </p>
                <button className="text-sm lg:text-base text-purple-400 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  Learn more{" "}
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 lg:p-7 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition duration-300 group">
            <div className="flex items-start space-x-4 lg:space-x-5">
              <div className="bg-yellow-500/20 rounded-full p-3 lg:p-4 border border-yellow-500/30 group-hover:bg-yellow-500/30 group-hover:border-yellow-500/50 transition duration-300">
                <Home className="h-6 w-6 lg:h-7 lg:w-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-base lg:text-lg">
                  Easy Returns
                </h3>
                <p className="text-gray-400 text-sm lg:text-base mb-3">
                  10-day hassle-free return policy
                </p>
                <button className="text-sm lg:text-base text-yellow-400 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  See policy{" "}
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6 w-full">
          <Link
            to="/order"
            className="relative group overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-700 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <button className="relative w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 lg:py-4 px-8 lg:px-12 rounded-lg transition duration-200 flex items-center justify-center space-x-2 shadow-lg text-sm lg:text-base">
              <span>View Order Details</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 lg:h-6 lg:w-6 transform group-hover:translate-x-1 transition-transform duration-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
          <Link
            to="/"
            className="relative group overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-200"></div>
            <button className="relative w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 lg:py-4 px-8 lg:px-12 rounded-lg transition duration-200 border border-gray-700 flex items-center justify-center space-x-2 group-hover:border-gray-600 text-sm lg:text-base">
              <span>Continue Shopping</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 lg:h-6 lg:w-6 transform group-hover:translate-x-1 transition-transform duration-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>

        {/* Download Invoice Button */}
        {paymentStatus !== "processing" && (
          <div className="mt-6 lg:mt-8 text-center">
            <button className="text-gray-400 hover:text-white flex items-center justify-center mx-auto text-sm lg:text-base transition duration-200">
              <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Download Invoice
            </button>
          </div>
        )}
      </main>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-50px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes ping-once {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        .animate-ping-once {
          animation: ping-once 1s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;
