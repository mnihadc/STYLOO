// controllers/orderController.js
import Order from "../Model/Order.model.js";
import Cart from "../Model/Cart.js";
import Address from "../Model/Address.model.js";

// controllers/orderController.js
export const placeCashOnDeliveryOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch default address
    const address = await Address.findOne({ userId: userId, isDefault: true });
    if (!address) {
      return res.status(400).json({ message: "No default address found" });
    }

    const products = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingCharge = 49;
    const totalAmount = subtotal + shippingCharge;

    // Create order
    const newOrder = new Order({
      user: userId,
      addressId: address._id,
      products,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "pending",
      subtotal,
      shippingCharge,
      totalAmount,
      orderStatus: "processing",
    });

    await newOrder.save();

    // Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // Redirect to success page with order details
    return res.status(201).json({
      success: true,
      redirectUrl: `/place-order-success?orderId=${newOrder._id}&paymentMethod=COD`,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
