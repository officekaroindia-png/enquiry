const router = require('express').Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(auth);

router.post('/update-brd-contacts', adminController.updateBRDContacts);
router.post('/reset-ids', adminController.resetIds);
router.post('/drop-index', adminController.dropEnquiryIdIndex);

module.exports = router;
