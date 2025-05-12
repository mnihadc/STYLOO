import React, { useEffect, useState } from "react";
import { FiSearch, FiShoppingCart, FiHeart } from "react-icons/fi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const offers = [
    {
      id: 1,
      image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._SX3000_.jpg",
      title: "70% Off",
    },
    {
      id: 2,
      image: "https://m.media-amazon.com/images/I/61jovjd+f9L._SX3000_.jpg",
      title: "Top Deals",
    },
    {
      id: 3,
      image: "https://m.media-amazon.com/images/I/61TD5JLGhIL._SX3000_.jpg",
      title: "New Launches",
    },
    {
      id: 4,
      image: "https://m.media-amazon.com/images/I/61DUO0NqyyL._SX3000_.jpg",
      title: "Clearance",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/admin/get-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  return (
    <div className="bg-black min-h-screen pb-16 text-white">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 pr-10 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Offers Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">🔥 Offers For You</h2>
        <div className="grid grid-cols-2 gap-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-lg overflow-hidden border border-gray-700"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-24 object-cover"
              />
              <p className="text-center py-2 text-sm font-medium">
                {offer.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">🛍 Trending Products</h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-contain p-2 bg-white"
                  />
                  <button className="absolute top-2 right-2 p-1 bg-gray-900 rounded-full hover:bg-gray-700">
                    <FiHeart className="text-gray-300 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded">
                    {product.rating} ★
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-base font-bold text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-green-500 ml-2">
                      {product.discount}% off
                    </span>
                  </div>
                  <button
                    className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold py-1.5 rounded flex items-center justify-center"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <FiShoppingCart className="mr-2" /> Add to Cart
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

export default ShopPage;
