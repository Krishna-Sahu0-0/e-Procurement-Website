const express = require('express');
const router = express.Router();
const {
  submitBid,
  getMyBids,
  updateBidStatus
} = require('../controllers/bidController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/', protect, submitBid);
router.get('/my-bids', protect, getMyBids);
router.put('/:id', protect, updateBidStatus);

module.exports = router;
