const { Expense } = require('../models');

// GET all expenses
exports.getAll = async (req, res) => {
  try {
    // AGRONOM ne sme da vidi
    if (req.user.roleId === 3) {
      return res.json({ message: 'Nemate pristup ovom delu', data: [] });
    }

    const expenses = await Expense.findAll({ raw: true });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new expense
exports.create = async (req, res) => {
  try {
    // Ko može da kreira trošak: RADNIK, MANAGER, ADMIN, OWNER
    if (![5, 2, 1, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Niste ovlašćeni da dodate trošak' });
    }

    const { fieldId, productionId, type, description, amount, date } = req.body;
    const expense = await Expense.create({
      fieldId: fieldId ?? null,
      productionId: productionId ?? null,
      type: type ?? null,
      description: description ?? '',
      amount: amount ?? 0,
      date: date ? new Date(date) : null
    });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE expense
exports.update = async (req, res) => {
  try {
    // Ko može da menja trošak: ADMIN, MANAGER, OWNER
    if (![1, 2, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Niste ovlašćeni da menjate trošak' });
    }

    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Trošak nije pronađen' });

    await expense.update(req.body);
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE expense
exports.remove = async (req, res) => {
  try {
    // Ko može da briše trošak: ADMIN, MANAGER, OWNER
    if (![1, 2, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Niste ovlašćeni da obrišete trošak' });
    }

    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Trošak nije pronađen' });

    await expense.destroy();
    res.json({ message: 'Trošak obrisan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
