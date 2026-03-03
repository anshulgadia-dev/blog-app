import status from 'http-status';
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(status.FORBIDDEN)
        .json({ success: false, message: 'Forbidden' });
    }
    next();
  };
