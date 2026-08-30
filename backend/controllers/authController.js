const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Sva polja su obavezna.' });
    }
    const creatorRole = Number(req.user.roleId);
    const requestedRole = Number(roleId);
    if (creatorRole === 4 && requestedRole === 1) {
      return res.status(403).json({ message: 'Vlasnik ne može da doda administratora.' });
    }
    if (creatorRole === 4 && ![2, 3, 5].includes(requestedRole)) {
      return res.status(403).json({ message: 'Vlasnik može da doda menadžera, agronoma ili radnika.' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email već postoji.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, roleId: requestedRole });
    return res.status(201).json({
      message: 'Korisnik je kreiran.',
      user: { id: user.id, name: user.name, email: user.email, roleId: user.roleId }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.logout = (req, res) => res.json({ message: 'Uspešno ste se odjavili.' });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: Role });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Pogrešan email ili lozinka.' });
    }
    const token = jwt.sign(
      { id: user.id, roleId: user.roleId },
      process.env.JWT_SECRET || 'tajni_kljuc',
      { expiresIn: '1d' }
    );
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, roleId:
         user.roleId, role: user.Role?.name }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Prijava trenutno nije dostupna.' });
  }
};
