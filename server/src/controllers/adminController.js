const Enquiry = require('../models/Enquiry');
const Counter = require('../models/Counter');

const BRD_CONTACTS = [
  { match: '1 BRD',  name: 'Wg Cdr S Kalabali Baig', phone: '9149856006', email: 'tech.info@gov.in',         location: 'Air Force Station, Chakeri, Kanpur - 208008' },
  { match: '3 BRD',  name: 'Wg Cdr Ajay Gandhi',     phone: '9476028517', email: 'phoenixcois@gov.in',       location: 'Air Force Station, Chandigarh - 160003' },
  { match: '4 BRD',  name: 'Wg Cdr Gunjan Suman',    phone: '9076564311', email: 'achiever2@gov.in',         location: 'Air Force Station, Chakeri, Kanpur - 208008' },
  { match: '5 BRD',  name: 'Gp Capt Amey Pandit',    phone: '7776075930', email: 'anve-shak5@gov.in',        location: 'Air Force Station Sulur, Coimbatore - 641401' },
  { match: '7 BRD',  name: 'Wg Cdr Kavi Prasad',     phone: '6264979618', email: '7b428@gov.in',             location: 'Air Force Station, Tuglakabad, New Delhi - 110062' },
  { match: '8 BRD',  name: 'Wg Cdr T Pradeep',       phone: '8610021529', email: 'bindg@gov.in',             location: 'Air Force Station Avadi, Chennai - 600055' },
  { match: '9 BRD',  name: 'Wg Cdr P Mishra',        phone: '9149948698', email: 'karamveera.indg@gov.in',   location: 'Air Force Station, Lohagaon, Pune - 411014' },
  { match: '11 BRD', name: 'Wg Cdr DG Patil',        phone: '7607114117', email: 'seindgozr@gov.in',         location: 'Air Force Station Ojhar, Nasik - 422221' },
  { match: '12 BRD', name: 'Wg Cdr JK Sahoo',        phone: '9448421796', email: 'inventor.afbc@gov.in',     location: 'Air Force Station Nazafgarh, New Delhi - 110043' },
  { match: '13 BRD', name: 'Wg Cdr KP Bijoy',        phone: '9445500862', email: 'warrior_akash@gov.in',     location: 'Air Force Station Palam, New Delhi - 110010' },
  { match: '14 BRD', name: 'Wg Cdr PK Sharma',       phone: '9027409702', email: 'coper.14@gov.in',          location: 'Air Force Station, Guwahati - 781015' },
  { match: '15 BRD', name: 'Gp Capt HS Dalal',       phone: '9914848270', email: 'kayakalp.12@gov.in',       location: 'Air Force Stn, Wadsar, Gandhi Nagar - 422501' },
  { match: '16 BRD', name: 'Gp Capt TL Prashanth',   phone: '9455039358', email: 'saviour.123@gov.in',       location: 'Air Force Station Palam, New Delhi - 110010' },
];

// POST /api/admin/update-brd-contacts
exports.updateBRDContacts = async (req, res) => {
  try {
    const results = [];

    for (const contact of BRD_CONTACTS) {
      const enquiry = await Enquiry.findOne({
        $or: [
          { name:    { $regex: contact.match, $options: 'i' } },
          { company: { $regex: contact.match, $options: 'i' } },
        ],
      });

      if (!enquiry) {
        results.push({ brd: contact.match, status: 'not_found' });
        continue;
      }

      const updates = {};
      if (!enquiry.phone    || enquiry.phone.trim()    === '') updates.phone    = contact.phone;
      if (!enquiry.email    || enquiry.email.trim()    === '') updates.email    = contact.email;
      if (!enquiry.location || enquiry.location.trim() === '') updates.location = contact.location;
      if (!enquiry.name     || enquiry.name.trim()     === '') updates.name     = contact.name;

      if (Object.keys(updates).length === 0) {
        results.push({ brd: contact.match, status: 'skipped', reason: 'already has data' });
        continue;
      }

      await Enquiry.updateOne({ _id: enquiry._id }, { $set: updates });
      results.push({ brd: contact.match, status: 'updated', fields: Object.keys(updates), enquiry: enquiry.name || enquiry.company });
    }

    const updated = results.filter(r => r.status === 'updated').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const notFound = results.filter(r => r.status === 'not_found').length;

    res.json({ summary: { updated, skipped, notFound }, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
