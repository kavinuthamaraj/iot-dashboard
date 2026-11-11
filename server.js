const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const KEY = process.env.API_KEY || 'demo123';
let history = [];   // kept in memory (fine for a live demo)
let pumpMode = 'auto'; // remote control: auto | on | off

app.post('/api/data', (req, res) => {
  if (req.query.key !== KEY) return res.status(401).json({ error: 'bad key' });
  history.push({ t: Date.now(), ...req.body });
  if (history.length > 200) history.shift();
  res.json({ ok: true, pump: pumpMode });
});

app.post('/api/cmd', (req, res) => {
  if (['auto','on','off'].includes(req.body.pump)) pumpMode = req.body.pump;
  res.json({ pump: pumpMode });
});

app.get('/api/data', (req, res) => res.json({ now: Date.now(), data: history }));

app.listen(process.env.PORT || 3000, () => console.log('running'));
