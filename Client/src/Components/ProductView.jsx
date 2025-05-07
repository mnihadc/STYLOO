import React from "react";

const ProductView = () => {
  // Sample product data
  const product = {
    id: 1,
    name: "Premium Cotton Slim Fit Shirt",
    brand: "Urban Classic",
    price: 1299,
    discountPrice: 899,
    discount: 30,
    rating: 4.3,
    reviews: 1245,
    description:
      "This premium cotton slim fit shirt offers exceptional comfort and style. Perfect for both casual and formal occasions.",
    colors: ["Black", "Navy Blue", "White", "Grey"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton",
      "Slim Fit Design",
      "Machine Washable",
      "Anti-Wrinkle Fabric",
      "Button-Down Collar",
    ],
    images: [
      "https://rukminim2.flixcart.com/image/850/1000/xif0q/shirt/d/m/0/m-mens-full-sleeve-till-blue-shirt-vraj-creation-original-imagwdrakjdmmrry.jpeg?q=90&crop=false",
      "https://m.media-amazon.com/images/I/71+Q6Rh5KIL._AC_UL1500_.jpg",
      "https://m.media-amazon.com/images/I/81+Q6Rh5KIL._AC_UL1500_.jpg",
    ],
    modelImage:
      "https://m.media-amazon.com/images/I/71YHjVXyR0L._AC_UL1500_.jpg",
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-6">
          <span>Home</span> &gt; <span>Clothing</span> &gt;{" "}
          <span>Men's Clothing</span> &gt; <span>Shirts</span> &gt;{" "}
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:border-2 hover:border-blue-500"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-contain"
                  />
                </div>
              ))}
              <div className="bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:border-2 hover:border-blue-500">
                <img
                  src={product.modelImage}
                  alt={`Model wearing ${product.name}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 font-medium">
                {product.rating} ★
              </span>
              <span className="text-gray-400">({product.reviews} reviews)</span>
              <span className="text-green-500 ml-4">In Stock</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  ₹{product.discountPrice}
                </span>
                <span className="text-gray-400 line-through ml-2">
                  ₹{product.price}
                </span>
                <span className="text-green-500 ml-2">
                  {product.discount}% off
                </span>
              </div>
              <p className="text-sm text-gray-400">Inclusive of all taxes</p>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-lg font-semibold mb-2">Available offers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  <span>
                    Bank Offer 10% off on Axis Bank Credit Card, up to ₹1,250.
                    On orders of ₹5,000 and above
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  <span>
                    Special Price Get extra 5% off (price inclusive of discount)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  <span>
                    Partner Offer Sign up for Pay Later and get Gift Card worth
                    ₹100
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md ${
                      index === 0
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      index === 2
                        ? "border-2 border-blue-500"
                        : "border border-gray-700"
                    } hover:bg-gray-800`}
                  >
                    {size}
                  </button>
                ))}
                <button className="text-blue-500 text-sm ml-4 flex items-center">
                  Size Guide
                </button>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-md">
                Add to Cart
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Product Description</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-gray-300 mb-6">{product.description}</p>

              <h3 className="text-xl font-semibold mb-4">Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Delivery Options</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="radio"
                    id="delivery"
                    name="delivery"
                    className="mt-1 mr-2"
                    defaultChecked
                  />
                  <div>
                    <label htmlFor="delivery" className="font-medium">
                      Standard Delivery
                    </label>
                    <p className="text-sm text-gray-400">3-5 business days</p>
                    <p className="text-sm text-gray-400">Free</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <input
                    type="radio"
                    id="express"
                    name="delivery"
                    className="mt-1 mr-2"
                  />
                  <div>
                    <label htmlFor="express" className="font-medium">
                      Express Delivery
                    </label>
                    <p className="text-sm text-gray-400">1-2 business days</p>
                    <p className="text-sm text-gray-400">₹99</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>7 Days Replacement Policy</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Cash on Delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Wearing Section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">
            Model Wearing This Product
          </h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={product.modelImage}
              alt={`Model wearing ${product.name}`}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gray-800/50 transition-shadow"
              >
                <img
                  src={`https://m.media-amazon.com/images/I/61+Q6Rh5KIL._AC_UL320_.jpg`}
                  alt={`Similar product ${item}`}
                  className="w-full h-48 object-contain p-4"
                />
                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-2">
                    Men's Slim Fit Shirt {item}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 text-xs">4.{item} ★</span>
                    <span className="text-gray-400 text-xs ml-1">
                      ({100 + item * 23})
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">₹{799 + item * 100}</span>
                    <span className="text-gray-400 text-xs line-through ml-1">
                      ₹{1299 + item * 100}
                    </span>
                    <span className="text-green-500 text-xs ml-1">
                      {30 + item}% off
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
