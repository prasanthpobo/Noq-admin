const router = require('express').Router();
const { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getDoctors).post(createDoctor);
router.route('/:id').get(getDoctor).put(updateDoctor).delete(deleteDoctor);

module.exports = router;
