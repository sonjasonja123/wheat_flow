const express = require('express');
const { query, validationResult } = require('express-validator');
const { getReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const allowRoles = require('../middleware/role');

const router = express.Router();

const validateReportQuery = [
  query('year').optional({ checkFalsy: true }).isInt({ min: 2000, max: 2100 }).withMessage('Godina mora biti između 2000. i 2100.'),
  query('fieldId').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Parcela nije ispravna.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    next();
  }
];

router.get('/', authMiddleware, allowRoles(1, 2, 3, 4), validateReportQuery, getReport);

module.exports = router;
