// run: node scripts/updateBRDContacts.js
// Make sure your .env has MONGODB_URI set

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Data extracted from IAF-SIDM SANKALP 2026 contact sheet
const BRD_CONTACTS = [
  {
    match: '1 BRD',
    name: 'Wg Cdr S Kalabali Baig',
    phone: '9149856006',
    email: 'tech.info@gov.in',
    location: 'Air Force Station, Chakeri, Kanpur - 208008',
  },
  {
    match: '3 BRD',
    name: 'Wg Cdr Ajay Gandhi',
    phone: '9476028517',
    email: 'phoenixcois@gov.in',
    location: 'Air Force Station, Chandigarh - 160003',
  },
  {
    match: '4 BRD',
    name: 'Wg Cdr Gunjan Suman',
    phone: '9076564311',
    email: 'achiever2@gov.in',
    location: 'Air Force Station, Chakeri, Kanpur - 208008',
  },
  {
    match: '5 BRD',
    name: 'Gp Capt Amey Pandit',
    phone: '7776075930',
    email: 'anve-shak5@gov.in',
    location: 'Air Force Station Sulur, Coimbatore - 641401',
  },
  {
    match: '7 BRD',
    name: 'Wg Cdr Kavi Prasad',
    phone: '6264979618',
    email: '7b428@gov.in',
    location: 'Air Force Station, Tuglakabad, New Delhi - 110062',
  },
  {
    match: '8 BRD',
    name: 'Wg Cdr T Pradeep',
    phone: '8610021529',
    email: 'bindg@gov.in',
    location: 'Air Force Station Avadi, Chennai - 600055',
  },
  {
    match: '9 BRD',
    name: 'Wg Cdr P Mishra',
    phone: '9149948698',
    email: 'karamveera.indg@gov.in',
    location: 'Air Force Station, Lohagaon, Pune - 411014',
  },
  {
    match: '11 BRD',
    name: 'Wg Cdr DG Patil',
    phone: '7607114117',
    email: 'seindgozr@gov.in',
    location: 'Air Force Station Ojhar, Nasik - 422221',
  },
  {
    match: '12 BRD',
    name: 'Wg Cdr JK Sahoo',
    phone: '9448421796',
    email: 'inventor.afbc@gov.in',
    location: 'Air Force Station Nazafgarh, New Delhi - 110043',
  },
  {
    match: '13 BRD',
    name: 'Wg Cdr KP Bijoy',
    phone: '9445500862',
    email: 'warrior_akash@gov.in',
    location: 'Air Force Station Palam, New Delhi - 110010',
  },
  {
    match: '14 BRD',
    name: 'Wg Cdr PK Sharma',
    phone: '9027409702',
    email: 'coper.14@gov.in',
    location: 'Air Force Station, Guwahati - 781015',
  },
  {
    match: '15 BRD',
    name: 'Gp Capt HS Dalal',
    phone: '9914848270',
    email: 'kayakalp.12@gov.in',
    location: 'Air Force Stn, Wadsar, Gandhi Nagar - 422501',
  },
  {
    match: '16 BRD',
    name: 'Gp Capt TL Prashanth',
    phone: '9455039358',
    email: 'saviour.123@gov.in',
    location: 'Air Force Station Palam, New Delhi - 110010',
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collection = db.collection('enquiries');

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const contact of BRD_CONTACTS) {
    // Find enquiry where name or company contains the BRD number
    const enquiry = await collection.findOne({
      $or: [
        { name:    { $regex: contact.match, $options: 'i' } },
        { company: { $regex: contact.match, $options: 'i' } },
      ],
    });

    if (!enquiry) {
      console.log(`❌ NOT FOUND: ${contact.match}`);
      notFound++;
      continue;
    }

    // Build update — only fill fields that are empty/missing
    const updates = {};
    if (!enquiry.phone || enquiry.phone.trim() === '')   updates.phone = contact.phone;
    if (!enquiry.email || enquiry.email.trim() === '')   updates.email = contact.email;
    if (!enquiry.name  || enquiry.name.trim() === '')    updates.name  = contact.name;
    if (!enquiry.location || enquiry.location.trim() === '') updates.location = contact.location;

    if (Object.keys(updates).length === 0) {
      console.log(`⏭  SKIPPED (already has data): ${contact.match} — ${enquiry.name || enquiry.company}`);
      skipped++;
      continue;
    }

    await collection.updateOne({ _id: enquiry._id }, { $set: updates });
    console.log(`✅ UPDATED: ${contact.match} — ${enquiry.name || enquiry.company}`);
    console.log(`   Set: ${JSON.stringify(updates)}`);
    updated++;
  }

  console.log(`\n--- Done ---`);
  console.log(`Updated: ${updated} | Skipped: ${skipped} | Not found: ${notFound}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
