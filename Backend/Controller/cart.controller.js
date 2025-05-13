import Address from "../Model/Address.model.js";
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

export const getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      model: "Product", // Make sure this matches your model name
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(200)
        .json({ message: "Cart is empty", cart: { items: [] } });
    }

    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, selectedSize, selectedColor } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the matching item (based on productId, size, and color)
    const updatedItems = cart.items.filter(
      (item) =>
        item.product.toString() !== productId ||
        item.selectedSize !== selectedSize ||
        item.selectedColor !== selectedColor
    );

    // If no change, item wasn't found
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, selectedSize, selectedColor, quantity } = req.body;

    if (!productId || !selectedSize || !selectedColor || !quantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.selectedSize === selectedSize &&
        i.selectedColor === selectedColor
    );

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};
