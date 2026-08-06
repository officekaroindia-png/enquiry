const router = require('express').Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(auth);

router.post('/update-brd-contacts', adminController.updateBRDContacts);

module.exports = router;
