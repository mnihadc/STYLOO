import Product from "../Model/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      images = [],
      price,
      discount = 0,
      stock,
      sizes = [],
      colors = [],
    } = req.body;

    if (!name || !brand || !category || !description || !price || !stock) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    const newProduct = new Product({
      userId: req.user._id,
      name,
      brand,
      category,
      description,
      images,
      price,
      discount,
      stock,
      sizes,
      colors,
      isPublished: true,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};
