const express = require('express');
const router = express.Router();
const {
  createTender,
  getAllTenders,
  getTenderById,
  updateTender,
  deleteTender,
  getTenderBids
} = require('../controllers/tenderController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(getAllTenders)
  .post(protect, createTender);

router.route('/:id')
  .get(getTenderById)
  .put(protect, updateTender)
  .delete(protect, deleteTender);

router.get('/:id/bids', protect, getTenderBids);

module.exports = router;
