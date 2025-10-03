const Tender = require('../models/Tender.js');
const Bid = require('../models/bid.js');

// @desc    Create a new tender
// @route   POST /api/tenders
const createTender = async (req, res) => {
  try {
    const { title, description, category, budget, deadline, requirements } = req.body;

    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const tender = await Tender.create({
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      createdBy: req.user._id
    });

    res.status(201).json(tender);
  } catch (error) {
    console.error('Error creating tender:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all tenders
// @route   GET /api/tenders
const getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name email');
    res.json(tenders);
  } catch (error) {
    console.error('Error fetching tenders:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get tender by ID
// @route   GET /api/tenders/:id
const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    res.json(tender);
  } catch (error) {
    console.error('Error fetching tender:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update tender
// @route   PUT /api/tenders/:id
const updateTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    const { title, description, category, budget, deadline, requirements, status } = req.body;

    tender.title = title || tender.title;
    tender.description = description || tender.description;
    tender.category = category || tender.category;
    tender.budget = budget || tender.budget;
    tender.deadline = deadline || tender.deadline;
    tender.requirements = requirements || tender.requirements;
    tender.status = status || tender.status;

    const updatedTender = await tender.save();
    res.json(updatedTender);
  } catch (error) {
    console.error('Error updating tender:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete tender
// @route   DELETE /api/tenders/:id
const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    await tender.deleteOne();
    res.json({ message: 'Tender removed' });
  } catch (error) {
    console.error('Error deleting tender:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get tenders with bids (Admin)
// @route   GET /api/tenders/:id/bids
const getTenderBids = async (req, res) => {
  try {
    const bids = await Bid.find({ tender: req.params.id })
      .populate('vendor', 'companyName email')
      .sort({ createdAt: -1 });
    
    res.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  createTender,
  getAllTenders,
  getTenderById,
  updateTender,
  deleteTender,
  getTenderBids
};
