import React, { useEffect, useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiChevronRight,
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

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading wishlist...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          My Wishlist ({wishlistItems.length})
        </h1>
      </div>

      {/* Wishlist Items */}
      <div className="p-4 space-y-4">
        {wishlistItems.length === 0 ? (
          <p className="text-gray-400">Your wishlist is empty.</p>
        ) : (
          wishlistItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-24 h-24 bg-white rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2">
                    {item.productId.name}
                  </h3>

                  <div className="flex items-center mt-1">
                    <span className="text-lg font-bold">
                      ₹{item.productId.price.toLocaleString()}
                    </span>
                    {item.productId.discount && (
                      <>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ₹
                          {(
                            item.productId.price /
                            (1 - item.productId.discount / 100)
                          ).toLocaleString()}
                        </span>
                        <span className="text-sm text-green-500 ml-2">
                          {item.productId.discount}% off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-3">
                    <button className="text-red-500 flex items-center text-sm">
                      <FiTrash2 className="mr-1" /> Remove
                    </button>
                    <button
                      onClick={() => handleAddToCart(item.productId._id)}
                      className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium flex items-center"
                    >
                      <FiShoppingCart className="mr-1" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* View Similar Button */}
              <button className="w-full mt-3 pt-2 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400 hover:text-white">
                <span>View similar products</span>
                <FiChevronRight />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
