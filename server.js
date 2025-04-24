require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

app.use('/tasks', require('./routes/tasks'));
app.use('/import', require('./routes/import'));
app.use('/api/auth', require('./routes/auth'));


app.get('/', (req, res) => res.send('Task Manager API Running'));

app.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
