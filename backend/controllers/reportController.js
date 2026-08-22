const { Production, Expense } = require('../models');
const { Op } = require('sequelize');

exports.getReport = async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : null;
    const fieldId = req.query.fieldId ? Number(req.query.fieldId) : null;

    const productionFilter = {};
    const expenseFilter = {};

    if (year) {
      productionFilter.sowingDate = { [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`] };
      expenseFilter.date = { [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`] };
    }
    if (fieldId) {
      productionFilter.fieldId = fieldId;
      expenseFilter.fieldId = fieldId;
    }

    const [productions, expenses] = await Promise.all([
      Production.findAll({ where: productionFilter, order: [['sowingDate', 'ASC']] }),
      Expense.findAll({ where: expenseFilter, order: [['date', 'ASC']] })
    ]);

    const totalSeed = productions.reduce((sum, item) => sum + Number(item.seedQuantity || 0), 0);
    const totalYield = productions.reduce((sum, item) => sum + Number(item.yieldKg || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return res.json({ productions, expenses, totals: { totalSeed, totalYield, totalExpenses } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
