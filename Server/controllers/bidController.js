const Bid = require('../models/bid.js');
const Tender = require('../models/Tender.js');

// @desc    Submit a bid
// @route   POST /api/bids
const submitBid = async (req, res) => {
  try {
    const { tenderId, bidAmount, proposal, deliveryTime } = req.body;

    if (!tenderId || !bidAmount || !proposal || !deliveryTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if tender exists and is open
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    if (tender.status !== 'Open') {
      return res.status(400).json({ message: 'Tender is not open for bidding' });
    }

    // Check if vendor already submitted a bid
    const existingBid = await Bid.findOne({ tender: tenderId, vendor: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this tender' });
    }

    const bid = await Bid.create({
      tender: tenderId,
      vendor: req.user._id,
      bidAmount,
      proposal,
      deliveryTime
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('vendor', 'companyName email')
      .populate('tender', 'title');

    res.status(201).json(populatedBid);
  } catch (error) {
    console.error('Error submitting bid:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get vendor's bids
// @route   GET /api/bids/my-bids
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ vendor: req.user._id })
      .populate('tender', 'title category budget deadline status')
      .sort({ createdAt: -1 });
    
    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update bid status (Admin)
// @route   PUT /api/bids/:id
const updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Submitted', 'Under Review', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    bid.status = status;
    await bid.save();

    // If bid is accepted, update tender status
    if (status === 'Accepted') {
      await Tender.findByIdAndUpdate(bid.tender, { status: 'Awarded' });
    }

    const updatedBid = await Bid.findById(bid._id)
      .populate('vendor', 'companyName email')
      .populate('tender', 'title');

    res.json(updatedBid);
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  submitBid,
  getMyBids,
  updateBidStatus
};
