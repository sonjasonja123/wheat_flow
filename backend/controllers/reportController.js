const { Production, Expense, Field } = require('../models');
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

    const [productions, expenses, allProductions, allExpenses] = await Promise.all([
      Production.findAll({ where: productionFilter, include: [{ model: Field, attributes: ['id', 'name', 'season'] }], order: [['sowingDate', 'ASC']] }),
      Expense.findAll({ where: expenseFilter, order: [['date', 'ASC']] }),
      Production.findAll({ attributes: ['sowingDate', 'yieldKg', 'salePricePerKg'] }),
      Expense.findAll({ attributes: ['date', 'amount'] })
    ]);

    const totalSeed = productions.reduce((sum, item) => sum + Number(item.seedQuantity || 0), 0);
    const totalYield = productions.reduce((sum, item) => sum + Number(item.yieldKg || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalRevenue = productions.reduce(
      (sum, item) => sum + Number(item.yieldKg || 0) * Number(item.salePricePerKg || 0),
      0
    );
    const profitability = totalRevenue - totalExpenses;

    const comparison = {};
    allProductions.forEach(item => {
      if (!item.sowingDate) return;
      const itemYear = new Date(item.sowingDate).getFullYear();
      comparison[itemYear] ||= { year: itemYear, yieldKg: 0, revenue: 0, expenses: 0, profit: 0 };
      comparison[itemYear].yieldKg += Number(item.yieldKg || 0);
      comparison[itemYear].revenue += Number(item.yieldKg || 0) * Number(item.salePricePerKg || 0);
    });
    allExpenses.forEach(item => {
      if (!item.date) return;
      const itemYear = new Date(item.date).getFullYear();
      comparison[itemYear] ||= { year: itemYear, yieldKg: 0, revenue: 0, expenses: 0, profit: 0 };
      comparison[itemYear].expenses += Number(item.amount || 0);
    });
    const seasonComparison = Object.values(comparison)
      .map(item => ({ ...item, profit: item.revenue - item.expenses }))
      .sort((a, b) => a.year - b.year);

    return res.json({
      productions,
      expenses,
      totals: { totalSeed, totalYield, totalExpenses, totalRevenue, profitability },
      seasonComparison
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
