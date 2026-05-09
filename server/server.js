require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/database');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/patients',     require('./routes/patients'));
app.use('/api/doctors',      require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/tickets',      require('./routes/tickets'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`NoQ API running on port ${PORT}`));
