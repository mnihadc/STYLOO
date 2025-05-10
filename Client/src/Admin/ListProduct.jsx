import { useState } from "react";
import { FiUpload, FiX, FiPlus, FiMinus } from "react-icons/fi";

const NewProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "electronics",
    stock: 1,
    images: [],
    specifications: [{ key: "", value: "" }],
    discount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setProduct({ ...product, images: [...product.images, ...newImages] });
  };

  const removeImage = (index) => {
    const newImages = [...product.images];
    newImages.splice(index, 1);
    setProduct({ ...product, images: newImages });
  };

  const handleSpecChange = (index, e) => {
    const { name, value } = e.target;
    const newSpecs = [...product.specifications];
    newSpecs[index][name] = value;
    setProduct({ ...product, specifications: newSpecs });
  };

  const addSpecField = () => {
    setProduct({
      ...product,
      specifications: [...product.specifications, { key: "", value: "" }],
    });
  };

  const removeSpecField = (index) => {
    const newSpecs = [...product.specifications];
    newSpecs.splice(index, 1);
    setProduct({ ...product, specifications: newSpecs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product submitted:", product);
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400">
          List New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (₹)*
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category*
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="beauty">Beauty</option>
                  <option value="toys">Toys & Games</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Stock Quantity*
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              ></textarea>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Product Images
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              {product.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="text-sm text-gray-400">Upload product images</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Specifications */}
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Specifications
            </h2>

            {product.specifications.map((spec, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Key</label>
                  <input
                    type="text"
                    name="key"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, e)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    name="value"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, e)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div className="flex items-end">
                  {index === 0 ? (
                    <button
                      type="button"
                      onClick={addSpecField}
                      className="flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md"
                    >
                      <FiPlus className="mr-1" /> Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeSpecField(index)}
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    >
                      <FiMinus className="mr-1" /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Discount */}
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Discount
            </h2>

            <div className="flex items-center">
              <input
                type="range"
                name="discount"
                min="0"
                max="90"
                value={product.discount}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-4 w-16 text-center bg-yellow-600 text-white py-1 px-2 rounded-md">
                {product.discount}%
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              List Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
