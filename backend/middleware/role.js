module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(Number(req.user.roleId))) {
      return res.status(403).json({ message: 'Nemate dozvolu za ovu akciju.' });
    }
    next();
  };
};
