const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.get('/tasks', getAllTasks);
router.post('/tasks/add', addTask);
router.put('/tasks/update/:id', updateTask);
router.delete('/tasks/delete/:id', deleteTask);

module.exports = router;