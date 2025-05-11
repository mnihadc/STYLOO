import Cart from "../Model/Cart.js";
import Product from "../Model/Product.js";

export const addToCart = async (req, res) => {
  const { productId, quantity = 1, selectedSize, selectedColor } = req.body;
  const userId = req.user.userId;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, selectedSize, selectedColor }],
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          selectedSize,
          selectedColor,
        });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
