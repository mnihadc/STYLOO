import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiChevronLeft,
  FiClock,
  FiCheckCircle,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order/get-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "Shipped":
        return <FiTruck className="text-blue-400" />;
      default:
        return <FiClock className="text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-900 text-green-400";
      case "Shipped":
        return "bg-blue-900 text-blue-400";
      default:
        return "bg-yellow-900 text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 flex items-center justify-between lg:px-8 lg:py-6">
        <Link to="/">
          <button className="text-xl lg:text-2xl">
            <FiChevronLeft />
          </button>
        </Link>
        <h1 className="text-xl font-bold lg:text-3xl">Your Orders</h1>
        <div className="w-6 lg:w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4 lg:max-w-7xl lg:mx-auto lg:p-8">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 px-4 text-center lg:py-16">
            <FiPackage className="text-5xl text-gray-600 mb-4 lg:text-6xl" />
            <h2 className="text-2xl font-bold mb-2 lg:text-3xl">
              No Orders Yet
            </h2>
            <p className="text-gray-400 mb-6 lg:text-lg">
              You haven't placed any orders with us yet
            </p>
            <Link to="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium lg:py-3 lg:px-8 lg:text-lg">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 lg:space-y-0">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800 lg:p-6 lg:rounded-xl"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-3 lg:mb-4">
                  <div>
                    <h3 className="font-bold lg:text-xl">Order {order.id}</h3>
                    <p className="text-gray-400 text-sm lg:text-base">
                      {order.date}
                    </p>
                  </div>
                  <div
                    className={`flex items-center text-sm px-2 py-1 rounded-full ${getStatusColor(
                      order.status
                    )} lg:text-base lg:px-3 lg:py-1.5`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4 lg:mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex">
                      <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 lg:w-20 lg:h-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <h4 className="font-medium line-clamp-1 lg:text-lg">
                          {item.name}
                        </h4>
                        <p className="text-gray-400 text-sm lg:text-base">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm lg:text-base lg:font-medium">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-800 pt-3 lg:pt-4">
                  <div className="flex justify-between mb-1 lg:text-lg">
                    <span className="text-gray-400">Total</span>
                    <span className="font-bold">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm lg:text-base">
                    <span className="text-gray-400">Payment</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-3 pt-3 border-t border-gray-800 lg:mt-4 lg:pt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1 lg:text-base">
                    Shipping Address
                  </h4>
                  <p className="text-sm lg:text-base">
                    {order.shippingAddress}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4 lg:mt-6">
                  <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium lg:py-3 lg:text-base">
                    Track Order
                  </button>
                  <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium lg:py-3 lg:text-base">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
