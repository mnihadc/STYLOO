import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiChevronRight,
  FiShoppingBag,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/api/wishlist/get-wishlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setWishlistItems(res.data.products);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "/api/cart/addtocart",
        {
          productId,
          quantity: 1,
          selectedSize: "M",
          selectedColor: "Black",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Product added to cart!");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Something went wrong";

      if (status === 409) {
        toast("⚠️ Product already in cart!", {
          icon: "🛒",
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #f59e0b",
          },
        });
      } else if (status === 403) {
        toast.error(`⛔ ${message}`, {
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        });
      } else if (status === 401) {
        toast.error("🔒 Please login first!");
      } else {
        console.error("Add to cart error:", err);
        toast.error("❌ Failed to add to cart.");
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(
        `/api/wishlist/remove-wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setWishlistItems(res.data.products);
      toast.success("Product removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      toast.error("Failed to remove product from wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="text-white p-4 lg:p-6">Loading wishlist...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20 max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 p-4 lg:p-6 border-b border-gray-800">
        <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold">
          My Wishlist ({wishlistItems.length})
        </h1>
      </div>

      {/* Wishlist Items */}
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 lg:py-32">
            <div className="w-40 h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 bg-gray-800 rounded-full flex items-center justify-center mb-6 lg:mb-8">
              <FiHeart className="text-6xl lg:text-7xl xl:text-8xl text-gray-500" />
            </div>
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-4 text-center">
              Your wishlist is empty
            </h3>
            <p className="text-gray-400 mb-6 lg:mb-8 text-center max-w-md lg:max-w-xl xl:max-w-2xl text-sm lg:text-base xl:text-lg">
              You haven't added any items to your wishlist yet. Start exploring
              our collection!
            </p>
            <Link
              to="/"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 lg:px-8 py-3 lg:py-4 rounded-lg flex items-center transition-colors text-sm lg:text-base xl:text-lg"
            >
              <FiShoppingBag className="mr-2 lg:mr-3 text-sm lg:text-base xl:text-lg" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {wishlistItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-3 lg:p-4 xl:p-5 border border-gray-700"
              >
                <div className="flex gap-3 lg:gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-white rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2 text-sm lg:text-base xl:text-lg">
                      {item.productId.name}
                    </h3>

                    <div className="flex items-center mt-1 lg:mt-2">
                      <span className="text-lg lg:text-xl xl:text-2xl font-bold">
                        ₹{item.productId.price.toLocaleString()}
                      </span>
                      {item.productId.discount && (
                        <>
                          <span className="text-sm lg:text-base text-gray-400 line-through ml-2 lg:ml-3">
                            ₹
                            {(
                              item.productId.price /
                              (1 - item.productId.discount / 100)
                            ).toLocaleString()}
                          </span>
                          <span className="text-sm lg:text-base text-green-500 ml-2 lg:ml-3">
                            {item.productId.discount}% off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-3 lg:mt-4">
                      <button
                        className="text-red-500 flex items-center text-sm lg:text-base hover:text-red-400 transition-colors"
                        onClick={() => removeFromWishlist(item.productId._id)}
                      >
                        <FiTrash2 className="mr-1 lg:mr-2 text-sm lg:text-base" />
                        Remove
                      </button>
                      <button
                        onClick={() => handleAddToCart(item.productId._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 lg:px-4 py-1 lg:py-2 rounded-md text-sm lg:text-base font-medium flex items-center transition-colors"
                      >
                        <FiShoppingCart className="mr-1 lg:mr-2 text-sm lg:text-base" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Similar Button */}
                <button className="w-full mt-3 lg:mt-4 pt-2 lg:pt-3 border-t border-gray-700 flex items-center justify-between text-sm lg:text-base text-gray-400 hover:text-white transition-colors">
                  <span>View similar products</span>
                  <FiChevronRight className="text-sm lg:text-base" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
