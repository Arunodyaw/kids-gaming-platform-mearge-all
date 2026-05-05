const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChildren, createChild } = require('../controllers/childController');

router.use(protect);
router.get('/', getChildren);
router.post('/', createChild);

module.exports = router;