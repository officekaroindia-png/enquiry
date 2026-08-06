const Enquiry = require('../models/Enquiry');
const Counter = require('../models/Counter');

// Auto-increment helper
async function getNextEnquiryId() {
  const counter = await Counter.findByIdAndUpdate(
    'enquiryId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `ENQ-${String(counter.seq).padStart(3, '0')}`;
}

exports.getAll = async (req, res) => {
  try {
    const { stage, search } = req.query;
    const filter = { createdBy: req.user._id };
    if (stage) filter.stage = stage;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex }, { company: regex }, { email: regex },
        { phone: regex }, { location: regex }, { projectType: regex },
        { enquiryId: regex },
      ];
    }
    const enquiries = await Enquiry.find(filter).sort({ createdAt: 1 }).lean();
    res.json({ enquiries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ _id: req.params.id, createdBy: req.user._id }).lean();
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    res.json({ enquiry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, company, email, phone, location, projectType, source, notes } = req.body;
    const enquiryId = await getNextEnquiryId();
    const enquiry = await Enquiry.create({
      enquiryId,
      name:        name        || '',
      company:     company     || '',
      email:       email       || '',
      phone:       phone       || '',
      location:    location    || '',
      projectType: projectType || '',
      source:      source      || '',
      notes:       notes       || '',
      stage: 'enquiry_received',
      createdBy: req.user._id,
      activities: [{
        stage: 'enquiry_received',
        note: notes || 'Enquiry added.',
        createdBy: req.user._id,
        createdByName: req.user.name,
      }],
    });
    res.status(201).json({ enquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const { note, newStage } = req.body;
    if (!note && !newStage) return res.status(400).json({ message: 'Provide note or newStage' });

    const enquiry = await Enquiry.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!enquiry) return res.status(404).json({ message: 'Not found' });

    if (enquiry.stage === 'closed_won' || enquiry.stage === 'closed_lost') {
      return res.status(400).json({ message: 'Enquiry is already closed' });
    }

    if (newStage && newStage !== enquiry.stage) {
      if (!enquiry.canMoveTo(newStage)) {
        return res.status(400).json({ message: `Cannot change a closed enquiry` });
      }
      enquiry.stage = newStage;
    }

    enquiry.activities.push({
      stage: enquiry.stage,
      note: note || `Moved to ${newStage}.`,
      createdBy: req.user._id,
      createdByName: req.user.name,
    });

    await enquiry.save();
    res.json({ enquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.closeWon = async (req, res) => {
  try {
    const { note } = req.body;
    const enquiry = await Enquiry.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    if (enquiry.stage !== 'payment') {
      return res.status(400).json({ message: 'Can only close as Won from Payment stage' });
    }
    enquiry.stage = 'closed_won';
    enquiry.activities.push({
      stage: 'closed_won',
      note: note || 'Payment received. Closed as won.',
      createdBy: req.user._id,
      createdByName: req.user.name,
    });
    await enquiry.save();
    res.json({ enquiry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.closeLost = async (req, res) => {
  try {
    const { note } = req.body;
    const enquiry = await Enquiry.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    if (enquiry.stage === 'closed_won' || enquiry.stage === 'closed_lost') {
      return res.status(400).json({ message: 'Already closed' });
    }
    enquiry.stage = 'closed_lost';
    enquiry.activities.push({
      stage: 'closed_lost',
      note: note || 'Enquiry closed as lost.',
      createdBy: req.user._id,
      createdByName: req.user.name,
    });
    await enquiry.save();
    res.json({ enquiry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const allowed = ['name','company','email','phone','location','projectType','source','notes'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    res.json({ enquiry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!enquiry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stats = async (req, res) => {
  try {
    const pipeline = await Enquiry.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]);
    const counts = {};
    pipeline.forEach(({ _id, count }) => { counts[_id] = count; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    res.json({ counts, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Backfill existing enquiries that have no enquiryId
exports.backfillIds = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ enquiryId: { $exists: false } }).sort({ createdAt: 1 });
    let count = 0;
    for (const enq of enquiries) {
      const enquiryId = await getNextEnquiryId();
      enq.enquiryId = enquiryId;
      await enq.save();
      count++;
    }
    res.json({ message: `Backfilled ${count} enquiries` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
