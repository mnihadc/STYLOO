import Wishlist from "../Model/WishList.model";

export const addToWishList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
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
