import Address from "../Model/Address.model.js";
import User from "../Model/User.model.js";

export const createAddress = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const newAddress = new Address({
      userId: req.user.userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.userId },
        { $set: { isDefault: false } }
      );
    }

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAddressData = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const data = await Address.find({ userId });

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No addresses found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Error fetching address data:", error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching addresses.",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await Address.deleteOne({ userId, _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};
