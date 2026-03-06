const Task = require('../models/Task');
const { aiCategorize } = require('../services/aiService');

// Express 5: async errors automatically forwarded to global error handler

// GET /tasks
const listTasks = async (req, res) => {
  const { search, category, priority, status } = req.query;

  const query = { user: req.user.id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (status) query.status = status;

  const tasks = await Task.find(query).sort({ createdAt: -1 });

  // Map _id to id for frontend compatibility
  const formattedTasks = tasks.map(t => ({
    id: t._id.toString(),
    title: t.title,
    description: t.description,
    status: t.status,
    category: t.category,
    priority: t.priority,
    aiReasoning: t.aiReasoning,
    aiSource: t.aiSource,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  return res.status(200).json({ tasks: formattedTasks });
};

// POST /tasks
const createTask = async (req, res) => {
  const { title, description } = req.body;

  const ai = await aiCategorize(title, description);

  const task = await Task.create({
    user: req.user.id,
    title: title.trim(),
    description: description ? description.trim() : '',
    status: 'Pending',
    category: ai.category,
    priority: ai.priority,
    aiReasoning: ai.reasoning || null,
    aiSource: ai.source,
  });

  return res.status(201).json({
    task: {
      id: task._id.toString(),
      ...task.toObject(),
    }
  });
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: you do not own this task' });
  }

  const allowedFields = ['title', 'description', 'status', 'category', 'priority'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  });

  await task.save();

  return res.status(200).json({ 
    task: {
      id: task._id.toString(),
      ...task.toObject(),
    }
  });
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: you do not own this task' });
  }

  await task.deleteOne();
  return res.status(200).json({ message: 'Task deleted successfully' });
};

module.exports = { listTasks, createTask, updateTask, deleteTask };
