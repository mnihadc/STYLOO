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

export const selectAddressAsDefault = async (req, res) => {
  const addressId = req.params.id;
  const userId = req.user.userId;

  try {
    // Check if the address belongs to the logged-in user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Set all user's addresses to isDefault: false
    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    // Set the selected address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Address set as default successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const data = await Address.findOne({ userId, isDefault: true });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No default address found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Default address fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
