import Cart from "../Model/Cart.js";
import Product from "../Model/Product.js";
import User from "../Model/User.model.js";

export const addToCart = async (req, res) => {
  const { productId, quantity = 1, selectedSize, selectedColor } = req.body;
  const userId = req.user.userId;

  try {
    // ✅ Check if user exists and is a 'user' (not admin/superadmin)
    const user = await User.findById(userId);
    if (!user || user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only regular users can add to cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // No cart exists, create a new one
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, selectedSize, selectedColor }],
      });
      await cart.save();
      return res.status(200).json({ message: "Product added to cart", cart });
    }

    // Check if product (with same size & color) already in cart
    const itemExists = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (itemExists) {
      return res.status(409).json({ message: "Product already in cart" });
    }

    // Add new item to cart
    cart.items.push({
      product: productId,
      quantity,
      selectedSize,
      selectedColor,
    });

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
