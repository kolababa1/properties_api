import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader =
    req.header("Authorization") || req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ msg: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, phone
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};
