const express = require('express');
const { body, param } = require('express-validator');
const { listTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', listTasks);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Task title is required')],
  validate,
  createTask
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('status').optional().isIn(['Pending', 'Completed']).withMessage('Status must be Pending or Completed'),
    body('category').optional().isIn(['Work', 'Personal', 'Study', 'Health']),
    body('priority').optional().isIn(['High', 'Medium', 'Low']),
  ],
  validate,
  updateTask
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  validate,
  deleteTask
);

module.exports = router;
