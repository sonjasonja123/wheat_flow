const { User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    if (![1, 2, 3, 4].includes(Number(req.user.roleId))) {
      return res.status(403).json({ message: 'Nemate dozvolu za pregled korisnika.' });
    }
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'roleId'],
      order: [['name', 'ASC']]
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
