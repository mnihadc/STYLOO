import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    sizes: [],
    colors: [],
    isPublished: false,
  });
  const [newSize, setNewSize] = useState({ size: "", stock: 0 });
  const [newColor, setNewColor] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setFormData({
          name: data.name,
          brand: data.brand,
          category: data.category,
          description: data.description,
          price: data.price,
          discount: data.discount,
          stock: data.stock,
          sizes: data.sizes || [],
          colors: data.colors || [],
          isPublished: data.isPublished,
        });
        setImagePreviews(data.images.map((img) => img.url));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddSize = () => {
    if (newSize.size && newSize.stock >= 0) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize],
      });
      setNewSize({ size: "", stock: 0 });
    }
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes.splice(index, 1);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleAddColor = () => {
    if (newColor) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor],
      });
      setNewColor("");
    }
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    // If it's a new image, remove from selectedImages
    if (index >= product.images.length) {
      const updatedSelected = [...selectedImages];
      updatedSelected.splice(index - product.images.length, 1);
      setSelectedImages(updatedSelected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append basic fields
      Object.keys(formData).forEach((key) => {
        if (key !== "sizes" && key !== "colors") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append sizes and colors as JSON
      formDataToSend.append("sizes", JSON.stringify(formData.sizes));
      formDataToSend.append("colors", JSON.stringify(formData.colors));

      // Append new images
      selectedImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Append existing image public_ids to keep
      product.images.forEach((img, index) => {
        if (imagePreviews.includes(img.url)) {
          formDataToSend.append("existingImages", img.public_id);
        }
      });

      await axios.put(`/api/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditing(false);
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (!product) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {isEditing ? "Edit Product" : "Product Details"}
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1 rounded ${
                isEditing ? "bg-gray-600" : "bg-blue-600"
              } hover:bg-opacity-90`}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              {/* Images */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Product Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  accept="image/*"
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded h-32"
                  required
                />
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Sizes & Stock</h2>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{size.size}:</span>
                    <span>{size.stock} in stock</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Size (e.g., S, M, L)"
                    value={newSize.size}
                    onChange={(e) =>
                      setNewSize({ ...newSize, size: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newSize.stock}
                    onChange={(e) =>
                      setNewSize({
                        ...newSize,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="p-2 border border-gray-300 rounded w-20"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Colors</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="p-2 border border-gray-300 rounded flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Published Status */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label
                  htmlFor="isPublished"
                  className="text-sm font-medium text-gray-700"
                >
                  Publish this product
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Update Product
              </button>
            </form>
          ) : (
            <div>
              {/* Product Images */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-40 object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-600 ml-1">
                      ({product.numReviews} reviews)
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      product.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                    <p className="text-lg">{product.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Category
                    </h3>
                    <p className="text-lg">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <div className="flex items-center">
                      <p className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            $
                            {(
                              product.price /
                              (1 - product.discount / 100)
                            ).toFixed(2)}
                          </span>
                          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                            {product.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Availability
                    </h3>
                    <p
                      className={`text-lg ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `In Stock (${product.stock} available)`
                        : "Out of Stock"}
                    </p>
                  </div>
                </div>

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          <span>{size.size}</span>
                          <span className="text-xs text-gray-500">
                            ({size.stock})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Available Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 rounded-full bg-gray-100"
                        >
                          {color}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Reviews */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Customer Reviews
                  </h2>
                  <div className="space-y-4">
                    {product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{review.username}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
