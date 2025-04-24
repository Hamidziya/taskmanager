const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const axios = require('axios');
const auth = require('../middleware/auth');

const { parse } = require('csv-parse/sync');

router.post('/googleSheet',auth, async (req, res) => {
    try {
      const { sheetUrl } = req.body;
  
      // Validate the URL
      if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
        return res.status(400).json({ error: 'Invalid Google Sheets link' });
      }
  
      // Use the provided sheetUrl directly
      const response = await axios.get(sheetUrl);
  
      // Parse CSV content safely
      const records = parse(response.data, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
  
      const tasks = [];
  
      for (const row of records) {
        if (!row.Title || !row.Description || !row.DueDate) continue;
  
        const [day, month, year] = row.DueDate.split('/');
        const dueDate = new Date(`${year}-${month}-${day}`);
  
        tasks.push({
          title: row.Title,
          description: row.Description,
          dueDate,
        });
      }
  
      if (tasks.length === 0) {
        return res.status(400).json({ error: 'No valid tasks found in the sheet' });
      }
  
      await Task.insertMany(tasks);
      res.json({ message: 'Tasks imported successfully' });
  
    } catch (err) {
      console.error('Import error:', err.message);
      res.status(500).json({ error: 'Failed to import tasks' });
    }
  });
  

  
module.exports = router;
