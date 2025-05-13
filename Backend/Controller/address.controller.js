import Address from "../Model/Address.model.js";

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
