const router = require('express').Router();
const { getTickets, getTicket, createTicket, updateTicket, addMessage, updateStatus } = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getTickets).post(createTicket);
router.route('/:id').get(getTicket).put(updateTicket);
router.post('/:id/messages', addMessage);
router.patch('/:id/status', updateStatus);

module.exports = router;
