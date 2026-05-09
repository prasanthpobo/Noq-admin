const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getClinics, createClinic, updateClinic, deleteClinic } = require('../controllers/clinicController');

router.route('/').get(protect, getClinics).post(protect, createClinic);
router.route('/:id').put(protect, updateClinic).delete(protect, deleteClinic);

module.exports = router;
