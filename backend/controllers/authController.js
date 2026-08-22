const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Sačuvaj lozinku kao plain text
    const user = await User.create({ name, email, password, roleId });

    res.json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Plain text provera
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, roleId: user.roleId }, 
      process.env.JWT_SECRET || 'tajni_kljuc', 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role ? user.Role.name : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
///////////////////komentar 
