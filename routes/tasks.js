const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const axios = require('axios');
const auth = require('../middleware/auth');

const { parse } = require('csv-parse/sync');
// GET all tasks
router.get('/',auth, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST a new task1
router.post('/',auth, async (req, res) => {
    const { title, description, dueDate } = req.body;
  
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' });
    }
  
    try {
      const exists = await Task.findOne({ title, dueDate });
      if (exists) {
        return res.status(409).json({ error: 'Task already exists' });
      }
  
      const task = new Task({ title, description, dueDate });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      console.error('Error saving task:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// PUT (update) task
router.put('/:id',auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// DELETE task
router.delete('/:id',auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

  
module.exports = router;
