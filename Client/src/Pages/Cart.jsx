import React, { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiTrash2,
  FiChevronLeft,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart/user-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (index, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems[index];
    try {
      const res = await fetch("/api/cart/update-product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: item.product._id,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: newQuantity,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchCart(); // Refresh cart from backend
      } else {
        console.error("Failed to update quantity:", data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (index) => {
    const item = cartItems[index];
    try {
      const res = await fetch("/api/cart/remove-product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: item.product._id,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchCart(); // Refresh cart after successful deletion
      } else {
        console.error("Failed to remove item:", data.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = 99;
  const total = subtotal + shipping;

  return (
    <div className="bg-black text-white min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 flex items-center justify-between lg:px-8 lg:py-4">
        <Link to="/">
          <button className="text-xl lg:text-2xl">
            <FiChevronLeft />
          </button>
        </Link>
        <h1 className="text-xl font-bold lg:text-2xl">Your Cart</h1>
        <div className="w-6 lg:w-8"></div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 lg:text-lg">
          Loading cart...
        </div>
      ) : cartItems.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center h-96 px-4 text-center lg:py-12">
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
        <div className="lg:flex lg:max-w-7xl lg:mx-auto lg:gap-8 lg:p-8">
          {/* Cart Items */}
          <div className="lg:flex-1 lg:max-w-2xl">
            <div className="p-4 space-y-4 lg:p-0 lg:space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-800 lg:p-6 lg:rounded-xl"
                >
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 lg:w-32 lg:h-32">
                      <img
                        src={item.product.imageUrl || item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="ml-3 flex-1 lg:ml-6">
                      <h3 className="font-medium line-clamp-2 lg:text-xl">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center mt-1 lg:mt-2">
                        <span className="text-lg font-bold lg:text-xl">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mt-1 lg:text-base lg:mt-2">
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </p>

                      <div className="flex justify-between items-center mt-3 lg:mt-6">
                        <div className="flex items-center border border-gray-700 rounded-lg lg:rounded-xl">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-400 hover:text-white lg:px-4 lg:py-2"
                          >
                            <FiMinus size={16} className="lg:w-5 lg:h-5" />
                          </button>
                          <span className="px-3 lg:px-4 lg:text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="px-3 py-1 text-gray-400 hover:text-white lg:px-4 lg:py-2"
                          >
                            <FiPlus size={16} className="lg:w-5 lg:h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-400 lg:scale-110"
                        >
                          <FiTrash2 className="lg:w-6 lg:h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-20 lg:h-fit lg:w-96 lg:border lg:border-gray-800 lg:rounded-xl lg:bg-gray-900">
            <div className="p-4 border-t border-gray-800 lg:border-t-0 lg:p-6">
              <h2 className="text-lg font-bold mb-4 lg:text-xl">
                Order Summary
              </h2>

              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between lg:text-lg">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between lg:text-lg">
                  <span className="text-gray-400">Shipping</span>
                  <span>₹{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-800 mt-3 lg:pt-4 lg:mt-4 lg:text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/order-summery">
                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold lg:py-4 lg:text-lg lg:rounded-xl">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
