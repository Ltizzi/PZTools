const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'pz-secret-key-change-in-production';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, is_admin INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
  db.run('CREATE TABLE IF NOT EXISTS loot_items (id INTEGER PRIMARY KEY AUTOINCREMENT, base_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, skill TEXT, volumes INTEGER DEFAULT 1, is_single_volume INTEGER DEFAULT 1, is_skill_related INTEGER DEFAULT 1)');
  db.run('CREATE TABLE IF NOT EXISTS user_items (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, item_id INTEGER NOT NULL, collected INTEGER DEFAULT 0, volume_number INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (item_id) REFERENCES loot_items(id) ON DELETE CASCADE, UNIQUE(user_id, item_id, volume_number))');

  const stmt = db.prepare("INSERT INTO loot_items (base_id, name, category, skill, volumes, is_single_volume, is_skill_related) VALUES (?, ?, ?, ?, ?, ?, ?)");

  try {
    const trackerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'tracker-data.json'), 'utf8'));
    trackerData.skillBooks.forEach(item => stmt.run(item.id, item.name, 'Skill Book', item.skill, 5, 0, 1));
    trackerData.recipeMagazines.forEach(item => stmt.run(item.id, item.name, 'Recipe Magazine', item.skill, 1, 1, 1));
    trackerData.tvShowsWithXP.forEach(item => stmt.run(item.id, item.name, 'VHS TV Show', item.skill || null, 1, 1, item.is_skill_related));
    trackerData.tvShowsNoXP.forEach(item => stmt.run(item.id, item.name, 'VHS TV Show', item.skill || null, 1, 1, item.is_skill_related));
    trackerData.woodcraftShows.forEach(item => stmt.run(item.id, item.name, 'VHS Home', item.skill, 1, 1, item.is_skill_related));
    trackerData.survivalShows.forEach(item => stmt.run(item.id, item.name, 'VHS Home', item.skill, 1, 1, item.is_skill_related));
    trackerData.fitnessShows.forEach(item => stmt.run(item.id, item.name, 'VHS Home', item.skill, 1, 1, item.is_skill_related));
    trackerData.comicsAndPapers.forEach(item => stmt.run(item.id, item.name, 'Comic/Paper', item.skill || null, 1, 1, 0));
    trackerData.vhsTapes.forEach(item => stmt.run(item.id, item.name, 'VHS Home', item.skill, 1, 1, item.is_skill_related || 1));
    trackerData.retailMovies.forEach(item => { const skillRelated = item.is_skill_related !== false; stmt.run(item.id, item.name, 'VHS Movie', item.skill || null, 1, 1, skillRelated); });
    console.log('Tracker data loaded successfully');
  } catch (err) {
    console.error('Error loading tracker data:', err);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) return res.status(400).json({ error: 'Username already exists' });
        return res.status(500).json({ error: 'Registration failed' });
      }
      const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: this.lastID, username } });
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, username: user.username, is_admin: user.is_admin } });
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/items', authenticateToken, (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM loot_items';
    const params = [];
    const conditions = [];
    if (search) {
      conditions.push('(name LIKE ? OR skill LIKE ?)');
      const searchTerm = '%' + search + '%';
      params.push(searchTerm, searchTerm);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, items) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch items' });
      db.all('SELECT item_id, collected, volume_number FROM user_items WHERE user_id = ?', [req.user.id], (err, userItems) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch user items' });
        const userItemsMap = new Map();
        userItems.forEach(ui => userItemsMap.set(ui.item_id, ui));
        const itemsWithStatus = items.map(item => ({ ...item, collected: userItemsMap.has(item.id) && userItemsMap.get(item.id).collected === 1 }));
        res.json(itemsWithStatus);
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/toggle-item', authenticateToken, (req, res) => {
  try {
    const { itemId } = req.body;
    db.get('SELECT collected FROM user_items WHERE user_id = ? AND item_id = ?', [req.user.id, itemId], (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to toggle item' });
      if (row) {
        const newState = row.collected === 1 ? 0 : 1;
        db.run('UPDATE user_items SET collected = ? WHERE user_id = ? AND item_id = ?', [newState, req.user.id, itemId], function(err) {
          if (err) return res.status(500).json({ error: 'Failed to update item' });
          res.json({ collected: newState === 1 });
        });
      } else {
        db.run('INSERT INTO user_items (user_id, item_id, collected, volume_number) VALUES (?, ?, 1, 1)', [req.user.id, itemId], function(err) {
          if (err) return res.status(500).json({ error: 'Failed to add item' });
          res.json({ collected: true });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle item' });
  }
});

app.get('/api/stats', authenticateToken, (req, res) => {
  db.get('SELECT COUNT(*) as count FROM loot_items', [], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
    const totalItems = row.count;
    db.get('SELECT COUNT(DISTINCT item_id) as count FROM user_items WHERE user_id = ? AND collected = 1', [req.user.id], (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
      const collectedItems = row.count;
      res.json({ totalItems, collectedItems, progress: totalItems > 0 ? Math.round((collectedItems / totalItems) * 100) : 0 });
    });
  });
});

try {
  const calendarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'calendar-data.json'), 'utf8'));
  app.get('/api/crops', (req, res) => res.json(calendarData));
  app.get('/api/crops/month/:month', (req, res) => {
    const { month } = req.params;
    const monthKey = month.toLowerCase();
    const validMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    if (!validMonths.includes(monthKey)) return res.status(400).json({ error: 'Invalid month' });
    const cropsForMonth = Object.entries(calendarData).filter(([_, crop]) => crop.months[monthKey]).map(([key, crop]) => ({ key, name: crop.name, nameEn: crop.nameEn, icon: crop.icon, growthTime: crop.growthTime, calories: crop.calories, status: crop.months[monthKey].status })).sort((a, b) => { const statusPriority = { 'best': 1, 'seasonal': 2, 'worst_in': 3, 'worst_out': 4 }; return statusPriority[a.status] - statusPriority[b.status]; });
    res.json(cropsForMonth);
  });
  console.log('Calendar data loaded successfully');
} catch (err) {
  console.error('Error loading calendar data:', err);
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));

app.get('*', (req, res) => {
  const reqPath = req.path;
  if (reqPath.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => console.log('PZ Loot Tracker server running on port ' + PORT));
