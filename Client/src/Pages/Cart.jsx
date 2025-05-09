import React, { useState } from "react";
import {
  FiShoppingCart,
  FiTrash2,
  FiChevronLeft,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const CartPage = () => {
  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 1299,
      image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg",
      quantity: 1,
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Watch Fitness Tracker",
      price: 1499,
      image: "https://m.media-amazon.com/images/I/61oXbG5yZML._SL1500_.jpg",
      quantity: 2,
      inStock: true,
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      price: 999,
      image: "https://m.media-amazon.com/images/I/71S8qt+K8hL._SL1500_.jpg",
      quantity: 1,
      inStock: false,
    },
  ]);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 99;
  const total = subtotal + shipping;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 flex items-center justify-between">
        <Link to="/shop">
          <button className="text-xl">
            <FiChevronLeft />
          </button>
        </Link>
        <h1 className="text-xl font-bold">Your Cart</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 px-4 text-center">
          <FiShoppingCart className="text-5xl text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added anything to your cart yet
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="p-4 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-lg p-3 border border-gray-800"
              >
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="ml-3 flex-1">
                    <h3 className="font-medium line-clamp-2">{item.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-bold">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>

                    {!item.inStock && (
                      <p className="text-red-500 text-xs mt-1">Out of Stock</p>
                    )}

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-gray-700 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-400 hover:text-white"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-400 hover:text-white"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="p-4 border-t border-gray-800">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-800 mt-3">
                <span className="font-bold">Total</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
