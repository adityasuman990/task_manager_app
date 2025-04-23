import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button, Container, Typography, Box, List, ListItem, ListItemText, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/teams');
        setTeams(res.data);
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
    };
    fetchTeams();
  }, []);

  const handleAddTeam = async () => {
    if (!newTeam.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/teams', {
        name: newTeam,
        description: 'New team',
      });
      setTeams([...teams, res.data]);
      setNewTeam('');
    } catch (err) {
      console.error('Error adding team:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Teams
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Create a new team..."
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTeam}
            sx={{ ml: 2 }}
          >
            Create
          </Button>
        </Box>
        <List>
          {teams.map((team) => (
            <ListItem key={team._id}>
              <ListItemText
                primary={team.name}
                secondary={`Members: ${team.members.length}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Teams;
