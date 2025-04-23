const express = require('express');
const auth = require('../middleware/auth');
const Team = require('../models/Team');
const User = require('../models/User');
const router = express.Router();

// Create a team
router.post('/', auth, async (req, res) => {
  try {
    const team = new Team({
      ...req.body,
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }],
    });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ message: 'Error creating team' });
  }
});

// Get user's teams
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.user.id })
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teams' });
  }
});

// Add member to team
router.post('/:id/members', auth, async (req, res) => {
  try {
    const team = await Team.findOne({
      _id: req.params.id,
      'members.user': req.user.id,
      'members.role': 'admin',
    });
    if (!team) return res.status(403).json({ message: 'Not authorized' });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMember = team.members.some(m => m.user.equals(user._id));
    if (isMember) return res.status(400).json({ message: 'User already in team' });

    team.members.push({ user: user._id, role: 'member' });
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Error adding member' });
  }
});

module.exports = router;