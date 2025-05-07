import React from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";

const WishlistPage = () => {
  // Sample wishlist data with real product images
  const wishlistItems = [
    {
      id: 1,
      name: "Apple AirPods Pro (2nd Generation)",
      price: 19999,
      originalPrice: 24900,
      discount: 20,
      image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg",
      inStock: true,
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Wireless Headphones",
      price: 24990,
      originalPrice: 29990,
      discount: 17,
      image: "https://m.media-amazon.com/images/I/61doE5FqWCL._SL1500_.jpg",
      inStock: true,
    },
    {
      id: 3,
      name: "Samsung Galaxy Watch 5 Pro",
      price: 28999,
      originalPrice: 32999,
      discount: 12,
      image: "https://m.media-amazon.com/images/I/61oXbG5yZML._SL1500_.jpg",
      inStock: false,
    },
    {
      id: 4,
      name: "OnePlus 10 Pro 5G (Emerald Forest, 12GB RAM, 256GB Storage)",
      price: 54999,
      originalPrice: 66999,
      discount: 18,
      image: "https://m.media-amazon.com/images/I/61mIUCd-37L._SL1500_.jpg",
      inStock: true,
    },
  ];

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
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700"
          >
            <div className="flex gap-3">
              {/* Product Image */}
              <div className="w-24 h-24 bg-white rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">{item.name}</h3>

                <div className="flex items-center mt-1">
                  <span className="text-lg font-bold">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through ml-2">
                    ₹{item.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-500 ml-2">
                    {item.discount}% off
                  </span>
                </div>

                {/* Stock Status */}
                <div className="mt-1">
                  {item.inStock ? (
                    <span className="text-green-500 text-sm">In Stock</span>
                  ) : (
                    <span className="text-red-500 text-sm">Out of Stock</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-3">
                  <button className="text-red-500 flex items-center text-sm">
                    <FiTrash2 className="mr-1" /> Remove
                  </button>
                  <button className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium flex items-center">
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
        ))}
      </div>

      {/* Footer Suggestions */}
      <div className="p-4 border-t border-gray-800">
        <h3 className="font-bold mb-2">More to explore</h3>
        <div className="grid grid-cols-2 gap-3">
          {wishlistItems.slice(0, 2).map((item) => (
            <div
              key={`suggest-${item.id}`}
              className="bg-gray-800 rounded-md p-2"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-20 object-contain bg-white rounded"
              />
              <p className="text-xs mt-1 line-clamp-2">{item.name}</p>
              <p className="text-sm font-bold mt-1">
                ₹{item.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
