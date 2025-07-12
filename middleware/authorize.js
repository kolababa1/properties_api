// middleware/authorize.js
export default function (...allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}
