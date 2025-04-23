import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button, Container, Typography, Box, List, ListItem, ListItemText, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', {
        title: newTask,
        status: 'todo',
      });
      setTasks([...tasks, res.data]);
      setNewTask('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Tasks
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            sx={{ ml: 2 }}
          >
            Add
          </Button>
        </Box>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              secondaryAction={
                <Button
                  color="error"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </Button>
              }
            >
              <ListItemText
                primary={task.title}
                secondary={`Status: ${task.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Tasks;

