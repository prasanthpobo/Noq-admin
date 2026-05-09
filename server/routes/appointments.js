const router = require('express').Router();
const {
  getAppointments, getAppointment, createAppointment,
  updateAppointment, updateStatus, getDashboardStats
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/stats', getDashboardStats);
router.route('/').get(getAppointments).post(createAppointment);
router.route('/:id').get(getAppointment).put(updateAppointment);
router.patch('/:id/status', updateStatus);

module.exports = router;
