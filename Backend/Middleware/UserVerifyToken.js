import jwt from "jsonwebtoken";

const UserVerifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded payload
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default UserVerifyToken;
