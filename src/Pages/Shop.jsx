import React from "react";
import { FiSearch, FiShoppingCart, FiHeart } from "react-icons/fi";

const ShopPage = () => {
  // Sample offers data
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

  // Sample products data with real images
  const products = [
    {
      id: 1,
      name: "Sony WH-CH720N Wireless Headphones",
      price: 9999,
      originalPrice: 14990,
      discount: 33,
      image: "https://m.media-amazon.com/images/I/61O55rS1pRL._SL1500_.jpg",
      rating: 4.2,
    },
    {
      id: 2,
      name: "Noise ColorFit Pulse Smart Watch",
      price: 1999,
      originalPrice: 3999,
      discount: 50,
      image: "https://m.media-amazon.com/images/I/61uej9efKYL._SL1500_.jpg",
      rating: 4.0,
    },
    {
      id: 3,
      name: "JBL Go 3 Portable Speaker",
      price: 2999,
      originalPrice: 3499,
      discount: 14,
      image: "https://m.media-amazon.com/images/I/71S8qt+K8hL._SL1500_.jpg",
      rating: 4.3,
    },
    {
      id: 4,
      name: "Ambrane 10000mAh Power Bank",
      price: 799,
      originalPrice: 1499,
      discount: 46,
      image: "https://m.media-amazon.com/images/I/61xVzlA2X1L._SL1500_.jpg",
      rating: 4.1,
    },
    {
      id: 5,
      name: "HP X1000 Wired Mouse",
      price: 399,
      originalPrice: 699,
      discount: 42,
      image: "https://m.media-amazon.com/images/I/61SwXaRZsgL._SL1500_.jpg",
      rating: 3.9,
    },
    {
      id: 6,
      name: "Cosmic Byte GK-18 Keyboard",
      price: 1999,
      originalPrice: 3499,
      discount: 42,
      image: "https://m.media-amazon.com/images/I/61Ifw+E0wVL._SL1500_.jpg",
      rating: 4.4,
    },
  ];

  return (
    <div className="bg-black min-h-screen pb-16 text-white">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-900 p-3 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full py-2 px-4 pr-10 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Offers Section */}
      <div className="p-3">
        <h2 className="text-lg font-bold mb-2 text-white">Offers For You</h2>
        <div className="grid grid-cols-2 gap-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gray-800 rounded-md overflow-hidden shadow-sm border border-gray-700"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-24 object-cover"
              />
              <p className="text-center py-2 text-sm font-medium text-white">
                {offer.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="p-3">
        <h2 className="text-lg font-bold mb-2 text-white">Trending Products</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-md overflow-hidden shadow-sm border border-gray-700"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain p-2 bg-white"
                />
                <button className="absolute top-2 right-2 p-1 bg-gray-900 rounded-full shadow hover:bg-gray-700">
                  <FiHeart className="text-gray-300 hover:text-red-500" />
                </button>
                <div className="absolute bottom-2 left-2 bg-yellow-400 text-black text-xs px-1 rounded flex items-center">
                  {product.rating} ★
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium line-clamp-2 text-white">
                  {product.name}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="text-base font-bold text-white">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through ml-1">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-green-500 ml-1">
                    {product.discount}% off
                  </span>
                </div>
                <button className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium py-1 rounded flex items-center justify-center">
                  <FiShoppingCart className="mr-1" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
