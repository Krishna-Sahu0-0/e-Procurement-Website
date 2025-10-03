const mongoose = require('mongoose');

const tenderSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    required: true, 
    default: 'Open',
    enum: ['Open', 'Closed', 'Awarded']
  },
  documents: [{ 
    name: String, 
    url: String 
  }],
  requirements: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

const Tender = mongoose.model('Tender', tenderSchema);
module.exports = Tender;
