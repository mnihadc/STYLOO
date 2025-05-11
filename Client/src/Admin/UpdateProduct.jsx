import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/admin/get-your-product", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProduct = (productId) => {
    console.log(`Viewing product ${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4 px-2 text-white">
          Your Products
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4 px-2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 pl-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-8 px-2">
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 px-1">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-700"
              >
                <Link to={`/admin/view-product/${product._id}`}>
                  <div
                    className="h-40 overflow-hidden relative cursor-pointer"
                    onClick={() => handleViewProduct(product._id)}
                  >
                    <img
                      src={product.image || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>

                <div className="p-2">
                  <h3 className="text-sm font-medium line-clamp-2 mb-1 text-white">
                    {product.name}
                  </h3>
                  <p
                    className={`text-xs mb-1 ${
                      product.stock === "In Stock"
                        ? "text-green-400"
                        : product.stock === "Out of Stock"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {product.stock || "Unknown Stock Status"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-purple-400">
                      ₹{(product.price * 75).toFixed(0)}
                    </p>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-gray-300 ml-1">
                        {product.rating || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-2">
            <p className="text-gray-400">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
 