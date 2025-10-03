const mongoose = require('mongoose');

const bidSchema = mongoose.Schema({
  tender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  bidAmount: { type: Number, required: true },
  proposal: { type: String, required: true },
  deliveryTime: { type: Number, required: true }, // in days
  documents: [{ 
    name: String, 
    url: String 
  }],
  status: {
    type: String,
    required: true,
    default: 'Submitted',
    enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected']
  }
}, {
  timestamps: true
});

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
