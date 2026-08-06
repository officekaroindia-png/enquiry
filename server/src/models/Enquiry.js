const mongoose = require('mongoose');

const VALID_STAGES = [
  'enquiry_received','contact','presentation','site_visit',
  'commercial_offer','order','execution','payment','closed_won','closed_lost',
];

const STAGE_ORDER = {
  enquiry_received: 1, contact: 2, presentation: 3, site_visit: 4,
  commercial_offer: 5, order: 6, execution: 7, payment: 8,
  closed_won: 9, closed_lost: 9,
};

const activitySchema = new mongoose.Schema(
  {
    stage:         { type: String, enum: VALID_STAGES, required: true },
    note:          { type: String, default: '' },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String },
  },
  { timestamps: true }
);

const enquirySchema = new mongoose.Schema(
  {
    enquiryId:   { type: String, unique: true },
    name:        { type: String, trim: true, default: '' },
    company:     { type: String, trim: true, default: '' },
    email:       { type: String, trim: true, lowercase: true, default: '' },
    phone:       { type: String, trim: true, default: '' },
    location:    { type: String, trim: true, default: '' },
    projectType: { type: String, trim: true, default: '' },
    source:      { type: String, trim: true, default: '' },
    notes:       { type: String, default: '' },
    stage:       { type: String, enum: VALID_STAGES, default: 'enquiry_received' },
    activities:  { type: [activitySchema], default: [] },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

enquirySchema.methods.canMoveTo = function (newStage) {
  if (this.stage === 'closed_won' || this.stage === 'closed_lost') return false;
  if (newStage === this.stage) return false;
  return true;
};

enquirySchema.statics.VALID_STAGES = VALID_STAGES;
enquirySchema.statics.STAGE_ORDER = STAGE_ORDER;

module.exports = mongoose.model('Enquiry', enquirySchema);
