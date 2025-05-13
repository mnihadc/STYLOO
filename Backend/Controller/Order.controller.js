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

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Fetch orders sorted by createdAt in descending order
    const orders = await Order.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } }, // -1 for descending
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          orderId: 1,
          createdAt: 1,
          orderStatus: 1,
          totalAmount: 1,
          paymentMethod: 1,
          shippingAddress: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $mergeObjects: [
                  "$$product",
                  {
                    productDetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails",
                            as: "pd",
                            cond: { $eq: ["$$pd._id", "$$product.product"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        orders: [],
      });
    }

    // Format the response to match your frontend structure
    const formattedOrders = orders.map((order) => ({
      id: `#${order.orderId.toString().slice(-6).toUpperCase()}`,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: order.orderStatus,
      items: order.products.map((product) => ({
        id: product.product._id,
        name: product.productDetails.name,
        price: product.productDetails.price,
        image: product.productDetails.images[0] || "default-product-image.jpg",
        quantity: product.quantity,
      })),
      total: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod:
        order.paymentMethod === "upi"
          ? `UPI (${order.paymentDetails?.upiId || "user@upi"})`
          : `Credit Card (•••• •••• •••• ${
              order.paymentDetails?.last4 || "4242"
            })`,
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error);
  }
};
