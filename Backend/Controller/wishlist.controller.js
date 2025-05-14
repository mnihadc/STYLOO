import WishList from "../Model/WishList.model.js";
import mongoose from "mongoose";

export const addToWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await WishList.findOne({ userId });

    if (!wishlist) {
      wishlist = new WishList({
        userId,
        products: [{ productId }],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (item) => item.productId.toString() === productId
      );

      if (alreadyExists) {
        return res.status(409).json({ message: "Product already in wishlist" });
      }

      wishlist.products.push({ productId });
    }

    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    next(error);
  }
};

export const getWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const wishlist = await WishList.findOne({ userId })
      .populate("products.productId", "name price image rating discount")
      .exec();

    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }

    res.status(200).json({ products: wishlist.products });
  } catch (error) {
    next(error);
  }
};

export const deleteWishList = async (req, res, next) => {
  try {
    const { productId } = req.params; // or req.body if using body params
    const userId = req.user.userId;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const wishlist = await WishList.findOneAndUpdate(
      { userId: userId }, // Changed to match schema
      { $pull: { products: { productId: productId } } }, // More explicit
      { new: true }
    ).populate("products.productId");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if product was actually removed
    const wasRemoved = !wishlist.products.some(
      (item) => item.productId._id.toString() === productId
    );

    if (!wasRemoved) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    res.json({
      success: true,
      message: "Product removed from wishlist",
      products: wishlist.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
