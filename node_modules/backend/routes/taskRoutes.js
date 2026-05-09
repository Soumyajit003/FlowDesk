const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', protect, getStats);

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Admin'), createTask);

router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

module.exports = router;
