const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.route('/').get(protect, getUsers).post(protect, createUser);
router.route('/:id').put(protect, updateUser).delete(protect, deleteUser);

module.exports = router;
