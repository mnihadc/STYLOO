import React, { useEffect, useState } from "react";
import { FiSearch, FiStar, FiChevronRight } from "react-icons/fi";
import { MdWhatshot, MdNewReleases } from "react-icons/md";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Dresses", count: 12 },
    { id: "party", name: "Party Wear", count: 8 },
    { id: "casual", name: "Casual", count: 15 },
    { id: "ethnic", name: "Ethnic", count: 10 },
    { id: "summer", name: "Summer Collection", count: 7 },
    { id: "designer", name: "Designer", count: 5 },
  ];

  const offers = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&auto=format&fit=crop",
      title: "Summer Sale",
      subtitle: "Up to 70% Off",
      badge: "HOT",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
      title: "New Arrivals",
      subtitle: "Fresh Styles",
      badge: "NEW",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      id: 3,
      image: "https://www.archittam.com/cdn/shop/files/18_11.jpg?v=1748037960",
      title: "Designer Collection",
      subtitle: "Exclusive Pieces",
      badge: "PREMIUM",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: 4,
      image:
        "https://media.istockphoto.com/id/887360960/photo/mens-suits-on-hangers-in-different-colors.jpg?s=612x612&w=0&k=20&c=RR19yJjRuR-CBWj9u1sQkFgtdYJ07KEkM678R0mtuZY=",
      title: "Clearance",
      subtitle: "Last Chance",
      badge: "SALE",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  const trendingBrands = [
    { name: "ZARA", logo: "💫" },
    { name: "H&M", logo: "👗" },
    { name: "MANGO", logo: "🥭" },
    { name: "FOREVER 21", logo: "2️⃣1️⃣" },
    { name: "SHEIN", logo: "🌟" },
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

      toast.success("✅ Added to cart!");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Something went wrong";

      if (status === 409) {
        toast("🛒 Already in cart!", {
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

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "/api/wishlist/addtowishlist",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("❤️ Added to wishlist!");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Something went wrong";

      if (status === 409) {
        toast("💖 Already in wishlist!", {
          icon: "💖",
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
        console.error("Add to wishlist error:", err);
        toast.error("❌ Failed to add to wishlist.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section with Search Bar */}
      <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-r from-purple-900 via-pink-900 to-rose-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Centered Content */}
        <div className="relative max-w-6xl mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          {/* Search Bar */}
          <div className="w-full max-w-3xl mb-8 px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for stylish dresses, outfits, brands..."
                className="w-full py-4 px-6 pr-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-base md:text-lg lg:text-xl"
              />
              <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xl md:text-2xl" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Signature Style
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore the latest trends in fashion. From casual chic to
              glamorous evening wear, find your perfect look with Styloo.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Shop Now <FiChevronRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Categories
          </h2>
          <button className="text-pink-400 hover:text-pink-300 flex items-center text-sm md:text-base font-medium">
            View All <FiChevronRight className="ml-1 md:ml-2" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-gray-800 bg-gray-800/50 hover:border-pink-400"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-2 md:mb-3">👗</div>
                <h3 className="font-semibold text-xs md:text-sm lg:text-base mb-1 md:mb-2">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-400">{category.count} items</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-6 md:mb-8">
          <MdWhatshot className="text-2xl md:text-3xl text-orange-500 mr-3 md:mr-4" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Hot Offers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative group overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20 z-10"></div>
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-3 md:left-4 lg:left-6 z-20">
                <span
                  className={`inline-block px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r ${offer.gradient} mb-2 md:mb-3`}
                >
                  {offer.badge}
                </span>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-base lg:text-lg">
                  {offer.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Brands */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Trending Brands
          </h2>
          <button className="text-pink-400 hover:text-pink-300 flex items-center text-sm md:text-base font-medium">
            See All <FiChevronRight className="ml-1 md:ml-2" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {trendingBrands.map((brand, index) => (
            <div
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 text-center hover:border-pink-500 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3 lg:mb-4">
                {brand.logo}
              </div>
              <h3 className="font-semibold text-gray-200 text-sm md:text-base lg:text-lg">
                {brand.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center">
            <MdNewReleases className="text-2xl md:text-3xl text-purple-500 mr-3 md:mr-4" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Latest Styles
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-sm border border-gray-700 rounded-full hover:border-pink-500 transition-colors">
              Popular
            </button>
            <button className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-sm border border-gray-700 rounded-full hover:border-pink-500 transition-colors">
              Newest
            </button>
            <button className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-sm border border-gray-700 rounded-full hover:border-pink-500 transition-colors">
              Price
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl md:rounded-2xl h-48 sm:h-56 md:h-64 lg:h-72 mb-3 md:mb-4"></div>
                <div className="h-4 md:h-5 bg-gray-800 rounded mb-2 md:mb-3"></div>
                <div className="h-3 md:h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-gray-800/30 border border-gray-700 rounded-xl md:rounded-2xl overflow-hidden hover:border-pink-500 transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:shadow-pink-500/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Wishlist Button */}
                  <button
                    className="absolute top-2 md:top-3 lg:top-4 right-2 md:right-3 lg:right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    <FiStar className="text-white hover:text-pink-500 transition-colors text-base md:text-lg" />
                  </button>

                  {/* Rating Badge */}
                  <div className="absolute top-2 md:top-3 lg:top-4 left-2 md:left-3 lg:left-4 bg-black/70 backdrop-blur-sm text-white px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    {product.rating}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute bottom-2 md:bottom-3 lg:bottom-4 left-2 md:left-3 lg:left-4 right-2 md:right-3 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-3 md:p-4 lg:p-5">
                  <h3 className="font-semibold text-gray-200 line-clamp-2 mb-2 md:mb-3 group-hover:text-white transition-colors text-sm md:text-base">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <span className="text-base md:text-lg lg:text-xl font-bold text-white">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs md:text-sm text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <span className="bg-green-500/20 text-green-400 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
                    <span>Free Delivery</span>
                    <span>⭐ {product.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />
    </div>
  );
};

export default ShopPage;
