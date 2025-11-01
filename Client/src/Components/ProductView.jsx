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
    <div className="min-h-screen bg-black text-gray-200 py-8 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm lg:text-base text-gray-400 mb-6 lg:mb-8">
          <span>Home</span> &gt; <span>Clothing</span> &gt;{" "}
          <span>Men's Clothing</span> &gt; <span>Shirts</span> &gt;{" "}
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4 lg:space-y-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] xl:h-[600px] object-contain"
              />
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:border-2 hover:border-blue-500 transition-all"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 lg:h-28 xl:h-32 object-contain"
                  />
                </div>
              ))}
              <div className="bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:border-2 hover:border-blue-500 transition-all">
                <img
                  src={product.modelImage}
                  alt={`Model wearing ${product.name}`}
                  className="w-full h-24 lg:h-28 xl:h-32 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <span className="text-yellow-400 font-medium text-base lg:text-lg">
                {product.rating} ★
              </span>
              <span className="text-gray-400 text-sm lg:text-base">
                ({product.reviews} reviews)
              </span>
              <span className="text-green-500 ml-4 lg:ml-6 text-sm lg:text-base">
                In Stock
              </span>
            </div>

            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl xl:text-4xl font-bold">
                  ₹{product.discountPrice}
                </span>
                <span className="text-gray-400 line-through ml-2 lg:ml-3 text-lg lg:text-xl">
                  ₹{product.price}
                </span>
                <span className="text-green-500 ml-2 lg:ml-3 text-sm lg:text-base">
                  {product.discount}% off
                </span>
              </div>
              <p className="text-sm lg:text-base text-gray-400">
                Inclusive of all taxes
              </p>
            </div>

            <div className="border-t border-gray-800 pt-4 lg:pt-6">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-2 lg:mb-4">
                Available offers
              </h3>
              <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 lg:mr-3 text-sm lg:text-base">
                    ✔
                  </span>
                  <span>
                    Bank Offer 10% off on Axis Bank Credit Card, up to ₹1,250.
                    On orders of ₹5,000 and above
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 lg:mr-3 text-sm lg:text-base">
                    ✔
                  </span>
                  <span>
                    Special Price Get extra 5% off (price inclusive of discount)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 lg:mr-3 text-sm lg:text-base">
                    ✔
                  </span>
                  <span>
                    Partner Offer Sign up for Pay Later and get Gift Card worth
                    ₹100
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-800 pt-4 lg:pt-6">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-2 lg:mb-4">
                Color
              </h3>
              <div className="flex space-x-2 lg:space-x-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 lg:px-5 lg:py-3 rounded-md text-sm lg:text-base ${
                      index === 0
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700"
                    } transition-colors`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 lg:pt-6">
              <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-2 lg:mb-4">
                Size
              </h3>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded-full text-sm lg:text-base ${
                      index === 2
                        ? "border-2 border-blue-500"
                        : "border border-gray-700"
                    } hover:bg-gray-800 transition-colors`}
                  >
                    {size}
                  </button>
                ))}
                <button className="text-blue-500 text-sm lg:text-base ml-4 lg:ml-6 flex items-center hover:text-blue-400 transition-colors">
                  Size Guide
                </button>
              </div>
            </div>

            <div className="flex space-x-4 lg:space-x-6 pt-4 lg:pt-6">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 lg:py-4 px-8 lg:px-12 rounded-md text-sm lg:text-base xl:text-lg transition-colors">
                Add to Cart
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 lg:py-4 px-8 lg:px-12 rounded-md text-sm lg:text-base xl:text-lg transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-12 lg:mt-16 border-t border-gray-800 pt-8 lg:pt-12">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 lg:mb-8">
            Product Description
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            <div className="lg:col-span-2">
              <p className="text-gray-300 mb-6 lg:mb-8 text-base lg:text-lg">
                {product.description}
              </p>

              <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold mb-4 lg:mb-6">
                Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
                {product.highlights.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm lg:text-base xl:text-lg"
                  >
                    <span className="text-green-500 mr-2 lg:mr-3">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
                Delivery Options
              </h3>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-start">
                  <input
                    type="radio"
                    id="delivery"
                    name="delivery"
                    className="mt-1 mr-2 lg:mr-3 lg:mt-1.5"
                    defaultChecked
                  />
                  <div>
                    <label
                      htmlFor="delivery"
                      className="font-medium text-sm lg:text-base"
                    >
                      Standard Delivery
                    </label>
                    <p className="text-sm lg:text-base text-gray-400">
                      3-5 business days
                    </p>
                    <p className="text-sm lg:text-base text-gray-400">Free</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <input
                    type="radio"
                    id="express"
                    name="delivery"
                    className="mt-1 mr-2 lg:mr-3 lg:mt-1.5"
                  />
                  <div>
                    <label
                      htmlFor="express"
                      className="font-medium text-sm lg:text-base"
                    >
                      Express Delivery
                    </label>
                    <p className="text-sm lg:text-base text-gray-400">
                      1-2 business days
                    </p>
                    <p className="text-sm lg:text-base text-gray-400">₹99</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-8 space-y-2 lg:space-y-3">
                <div className="flex items-center text-sm lg:text-base">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 mr-2 lg:mr-3"
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
                <div className="flex items-center text-sm lg:text-base">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 mr-2 lg:mr-3"
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
        <div className="mt-12 lg:mt-16 border-t border-gray-800 pt-8 lg:pt-12">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 lg:mb-8">
            Model Wearing This Product
          </h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={product.modelImage}
              alt={`Model wearing ${product.name}`}
              className="w-full h-auto max-h-96 lg:max-h-[500px] xl:max-h-[600px] object-cover"
            />
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12 lg:mt-16 border-t border-gray-800 pt-8 lg:pt-12">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 lg:mb-8">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gray-800/50 transition-shadow"
              >
                <img
                  src={`https://m.media-amazon.com/images/I/61+Q6Rh5KIL._AC_UL320_.jpg`}
                  alt={`Similar product ${item}`}
                  className="w-full h-48 lg:h-56 xl:h-64 object-contain p-4"
                />
                <div className="p-4 lg:p-5">
                  <h3 className="text-sm lg:text-base font-medium line-clamp-2">
                    Men's Slim Fit Shirt {item}
                  </h3>
                  <div className="flex items-center mt-1 lg:mt-2">
                    <span className="text-yellow-400 text-xs lg:text-sm">
                      4.{item} ★
                    </span>
                    <span className="text-gray-400 text-xs lg:text-sm ml-1">
                      ({100 + item * 23})
                    </span>
                  </div>
                  <div className="mt-2 lg:mt-3">
                    <span className="font-bold text-sm lg:text-base">
                      ₹{799 + item * 100}
                    </span>
                    <span className="text-gray-400 text-xs lg:text-sm line-through ml-1">
                      ₹{1299 + item * 100}
                    </span>
                    <span className="text-green-500 text-xs lg:text-sm ml-1">
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
