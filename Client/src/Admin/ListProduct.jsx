import { useState } from "react";
import { FiUpload, FiX, FiPlus, FiMinus } from "react-icons/fi";

const NewProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: 0,
    description: "",
    category: "electronics",
    stock: 1,
    images: [],
    sizes: [{ size: "", stock: 0 }],
    colors: [],
    discount: 0,
    specifications: [{ key: "", value: "" }],
  });

  const [newColor, setNewColor] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // In a real app, you would upload to Cloudinary or similar here
    // For now, we'll just create preview URLs
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      public_id: `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    }));

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

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const newSizes = [...product.sizes];
    newSizes[index][name] = name === "stock" ? parseInt(value) : value;
    setProduct({ ...product, sizes: newSizes });
  };

  const addSizeField = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { size: "", stock: 0 }],
    });
  };

  const removeSizeField = (index) => {
    const newSizes = [...product.sizes];
    newSizes.splice(index, 1);
    setProduct({ ...product, sizes: newSizes });
  };

  const addColor = () => {
    if (newColor && !product.colors.includes(newColor)) {
      setProduct({
        ...product,
        colors: [...product.colors, newColor],
      });
      setNewColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setProduct({
      ...product,
      colors: product.colors.filter((color) => color !== colorToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In a real app, you would:
    // 1. Actually upload images to Cloudinary/S3
    // 2. Send the product data to your backend
    console.log("Product submitted:", product);

    // Example API call (uncomment when you have your API ready)
    /*
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
    */
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
                <label className="block text-sm font-medium mb-1">Brand*</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
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
                  min="0"
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
                    src={img.url}
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

          {/* Sizes & Stock */}
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Sizes & Stock
            </h2>

            {product.sizes.map((size, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={size.size}
                    onChange={(e) => handleSizeChange(index, e)}
                    placeholder="e.g., S, M, L"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={size.stock}
                    onChange={(e) => handleSizeChange(index, e)}
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div className="flex items-end">
                  {index === 0 ? (
                    <button
                      type="button"
                      onClick={addSizeField}
                      className="flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md"
                    >
                      <FiPlus className="mr-1" /> Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    >
                      <FiMinus className="mr-1" /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Colors */}
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              Colors
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className="flex items-center bg-gray-800 px-3 py-1 rounded-full"
                >
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Add a color"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={addColor}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md"
              >
                Add
              </button>
            </div>
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
