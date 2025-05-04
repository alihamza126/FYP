const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  // User registration
  server.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, name });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // User login
  server.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Password reset
  server.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update profile
  server.put('/api/update-profile', async (req, res) => {
    const { userId, name } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.name = name;
      await user.save();

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 