const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Ko pravi korisnika
    const creatorRole = req.user.roleId;

    // Ako nije Admin ili Owner
    if (![1, 4].includes(creatorRole)) {
      return res.status(403).json({ message: 'Nemate pravo da dodajete korisnike' });
    }


    // Owner ne sme da doda Admina
    if (creatorRole === 4 && roleId === 1) {
      return res.status(403).json({ message: 'Vlasnik ne može da dodaje admina' });
    }

    // Owner sme samo ispod sebe
    if (creatorRole === 4 && ![2, 3, 5].includes(roleId)) {
      return res.status(403).json({ message: 'Ne možete dodati ovu ulogu' });
    }

    // Provera da li email već postoji
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email već postoji' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId
    });

    res.json({ message: 'Korisnik uspešno dodat', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET || 'tajni_kljuc',
      { expiresIn: '1d' }
    );
    res.json({ message: 'Logged in', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
