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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentStatus("paid");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const orderDetails = {
    orderId: `#${Math.floor(Math.random() * 1000000000)}`,
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
    paymentMethod: paymentMethod,
    amount: "₹4,999.00",
    shippingAddress: "123 Main Street, Bangalore, Karnataka 560001, India",
    items: [
      { name: "Wireless Bluetooth Headphones", quantity: 1, price: "₹1,999" },
      { name: "Smart Watch Pro", quantity: 1, price: "₹2,999" },
    ],
  };

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
      <main className="relative max-w-6xl mx-auto py-8 px-4 z-10">
        {/* Success Card with Floating Animation */}
        <div
          className={`bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden mb-8 border border-gray-800 transform transition-all duration-500 ${
            isAnimating ? "scale-95 opacity-90" : "scale-100 opacity-100"
          }`}
        >
          <div className="p-6 md:p-8">
            {paymentStatus === "processing" ? (
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-blue-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                  Complete Your Payment
                </h2>
                <p className="text-gray-300 mb-6 max-w-md">
                  Scan the QR code or approve payment in your UPI app to
                  complete your order
                </p>

                <div className="relative group mb-6 w-full max-w-xs">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <div className="relative bg-gray-800 p-4 rounded-lg w-full">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-bold text-white">
                        {orderDetails.amount}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded flex justify-center items-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10"></div>
                      <div className="w-40 h-40 bg-gray-200 flex items-center justify-center relative z-10">
                        <QrCode className="h-24 w-24 text-black" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Scan to pay via any UPI app
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePaymentComplete}
                  className="relative group overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center"
                >
                  <span className="relative z-10">I've Made Payment</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </button>

                <div className="mt-6 flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Payment session expires in 4:59</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-green-500 rounded-full opacity-0 animate-ping-once"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4 shadow-lg">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
                  {paymentMethod === "COD"
                    ? "Order Confirmed!"
                    : "Payment Successful!"}
                </h2>
                <p className="text-gray-300 max-w-md mb-4">
                  {paymentMethod === "COD"
                    ? "Your order has been placed with Cash on Delivery. We'll notify you when it ships."
                    : "Thank you for your payment. Your order has been confirmed and is being processed."}
                </p>
                <div className="mt-4 bg-gray-800/50 px-5 py-2 rounded-full border border-gray-700 hover:border-green-500/50 transition duration-200">
                  <p className="text-sm font-medium">
                    <span className="text-green-400">Order ID:</span>{" "}
                    <span className="text-white">{orderDetails.orderId}</span>
                  </p>
                </div>

                <div className="mt-6 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 w-full max-w-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Estimated Delivery:</span>
                    <span className="font-medium text-white flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-blue-400" />
                      {orderDetails.deliveryDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Paid:</span>
                    <span className="font-bold text-green-400 text-lg">
                      {orderDetails.amount}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-green-400" />
                Order Summary
              </h3>

              {/* Payment Method Selector */}
              {paymentStatus === "processing" && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-white mb-3">
                    Payment Method
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePaymentMethodChange("UPI")}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        paymentMethod === "UPI"
                          ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                          : "border-gray-700 bg-gray-800 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            paymentMethod === "UPI"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          <Wallet className="h-5 w-5" />
                        </div>
                        <span className="text-white text-left">
                          UPI Payment
                          <span className="block text-xs text-gray-400 mt-1">
                            Instant confirmation
                          </span>
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => handlePaymentMethodChange("COD")}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        paymentMethod === "COD"
                          ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10"
                          : "border-gray-700 bg-gray-800 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            paymentMethod === "COD"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          <IndianRupee className="h-5 w-5" />
                        </div>
                        <span className="text-white text-left">
                          Cash on Delivery
                          <span className="block text-xs text-gray-400 mt-1">
                            Pay when delivered
                          </span>
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500/30 transition duration-200">
                  <p className="text-gray-400 text-sm mb-1 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Order Date
                  </p>
                  <p className="font-medium text-white">{orderDetails.date}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500/30 transition duration-200">
                  <p className="text-gray-400 text-sm mb-1 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Expected Delivery
                  </p>
                  <p className="font-medium text-white">
                    {orderDetails.deliveryDate}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-6 hover:border-green-500/30 transition duration-200 group">
                <p className="text-gray-400 text-sm mb-1 flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Shipping Address
                </p>
                <p className="font-medium text-white">
                  {orderDetails.shippingAddress}
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
                  <button className="text-xs text-green-400 flex items-center">
                    Change address <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center hover:shadow-lg hover:shadow-green-500/10 transition duration-300">
                <p className="text-gray-300">
                  Total Amount {paymentMethod === "COD" ? "Payable" : "Paid"}
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {orderDetails.amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/20 rounded-full p-3 border border-blue-500/30 group-hover:bg-blue-500/30 group-hover:border-blue-500/50 transition duration-300">
                <Truck className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Track Your Order
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Real-time updates on your delivery status
                </p>
                <button className="text-sm text-blue-400 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  View tracking <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition duration-300 group">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/20 rounded-full p-3 border border-purple-500/30 group-hover:bg-purple-500/30 group-hover:border-purple-500/50 transition duration-300">
                <ShieldCheck className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Purchase Protection
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Full refund if items don't arrive as described
                </p>
                <button className="text-sm text-purple-400 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition duration-300 group">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-500/20 rounded-full p-3 border border-yellow-500/30 group-hover:bg-yellow-500/30 group-hover:border-yellow-500/50 transition duration-300">
                <Home className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Easy Returns</h3>
                <p className="text-gray-400 text-sm mb-3">
                  10-day hassle-free return policy
                </p>
                <button className="text-sm text-yellow-400 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  See policy <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <Link
            to="/order"
            className="relative group overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-700 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <button className="relative w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-8 rounded-lg transition duration-200 flex items-center justify-center space-x-2 shadow-lg">
              <span>View Order Details</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200"
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
            <button className="relative w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 border border-gray-700 flex items-center justify-center space-x-2 group-hover:border-gray-600">
              <span>Continue Shopping</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200"
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
          <div className="mt-6 text-center">
            <button className="text-gray-400 hover:text-white flex items-center justify-center mx-auto text-sm transition duration-200">
              <Download className="h-4 w-4 mr-2" />
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
