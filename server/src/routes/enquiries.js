const router = require('express').Router();
const ctrl = require('../controllers/enquiryController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/stats', ctrl.stats);
router.post('/backfill-ids', ctrl.backfillIds);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.post('/', ctrl.create);

router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.patch('/:id/activity', ctrl.logActivity);
router.patch('/:id/close-won', ctrl.closeWon);
router.patch('/:id/close-lost', ctrl.closeLost);

module.exports = router;
