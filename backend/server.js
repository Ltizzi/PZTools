const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const User = require('./models/User');
const LootItem = require('./models/LootItem');
const UserItem = require('./models/UserItem');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'pz-secret-key-change-in-production';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

let isDBConnected = false;

app.use(async (req, res, next) => {
  if (!isDBConnected && process.env.VERCEL === '1') {
    try {
      await connectDB();
      await seedLootItems();
      isDBConnected = true;
    } catch (err) {
      console.error('DB connection error:', err);
    }
  }
  next();
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
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    
    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    user.last_active = new Date();
    await user.save();
    
    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username, is_admin: user.is_admin } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const { search, category, filter } = req.query;
    
    let matchStage = {};
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skill: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { base_id: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) matchStage.category = category;
    
    let items = await LootItem.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'useritems',
          let: { itemId: '$_id', userId: new mongoose.Types.ObjectId(req.user.id) },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$item_id', '$$itemId'] }, { $eq: ['$user_id', '$$userId'] }] } } }
          ],
          as: 'userData'
        }
      },
      {
        $addFields: {
          collected: { $ifNull: [{ $arrayElemAt: ['$userData.collected', 0] }, false] }
        }
      },
      { $sort: { name: 1 } }
    ]);
    
    if (filter === 'collected') {
      items = items.filter(item => item.collected);
    } else if (filter === 'missing') {
      items = items.filter(item => !item.collected);
    }
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/toggle-item', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const itemObjectId = new mongoose.Types.ObjectId(itemId);
    
    const existingItem = await UserItem.findOne({ user_id: userId, item_id: itemObjectId });
    
    if (existingItem) {
      existingItem.collected = !existingItem.collected;
      await existingItem.save();
      res.json({ collected: existingItem.collected });
    } else {
      const newItem = await UserItem.create({
        user_id: userId,
        item_id: itemObjectId,
        collected: true
      });
      res.json({ collected: true });
    }
  } catch (error) {
    console.error('Error toggling item:', error);
    res.status(500).json({ error: 'Failed to toggle item' });
  }
});

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const totalItems = await LootItem.countDocuments();
    
    const collectedItems = await UserItem.countDocuments({
      user_id: userId,
      collected: true
    });
    
    const progress = totalItems > 0 ? Math.round((collectedItems / totalItems) * 100) : 0;
    res.json({ totalItems, collectedItems, progress });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.post('/api/export-tracker', authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const items = await UserItem.find({ user_id: userId, collected: true })
      .populate('item_id', 'name')
      .lean();
    
    const exportItems = items.map(item => ({
      name: item.item_id.name
    }));
    
    res.json(exportItems);
  } catch (error) {
    console.error('Error exporting tracker:', error);
    res.status(500).json({ error: 'Error al exportar tracker data' });
  }
});

app.post('/api/import-tracker', authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Datos de importación inválidos' });
    }
    
    const lootItems = await LootItem.find().lean();
    const itemMapByName = new Map();
    lootItems.forEach(item => {
      itemMapByName.set(item.name.toLowerCase().trim(), item._id);
    });
    
    let imported = 0;
    let skipped = 0;
    let notFound = 0;
    
    for (const item of items) {
      const itemName = (item.name || item).toLowerCase().trim();
      const lootItemId = itemMapByName.get(itemName);
      
      if (lootItemId) {
        const existingItem = await UserItem.findOne({ user_id: userId, item_id: lootItemId });
        
        if (existingItem) {
          if (existingItem.collected) {
            skipped++;
          } else {
            existingItem.collected = true;
            await existingItem.save();
            imported++;
          }
        } else {
          await UserItem.create({
            user_id: userId,
            item_id: lootItemId,
            collected: true
          });
          imported++;
        }
      } else {
        notFound++;
      }
    }
    
    res.json({
      success: true,
      message: `Import completado: ${imported} items importados, ${skipped} ya existentes, ${notFound} no encontrados`
    });
  } catch (error) {
    console.error('Error importing tracker:', error);
    res.status(500).json({ error: 'Error al importar tracker data' });
  }
});

try {
  const calendarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/calendar-data.json'), 'utf8'));
  app.get('/api/crops', (req, res) => res.json(calendarData));
  app.get('/api/crops/month/:month', (req, res) => {
    const { month } = req.params;
    const monthKey = month.toLowerCase();
    const validMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    if (!validMonths.includes(monthKey)) return res.status(400).json({ error: 'Invalid month' });
    const cropsForMonth = Object.entries(calendarData)
      .filter(([_, crop]) => crop.months && crop.months[monthKey])
      .map(([key, crop]) => ({
        key,
        name: crop.name,
        nameEn: crop.nameEn,
        icon: crop.icon,
        growthTime: crop.growthTime,
        calories: crop.calories,
        status: crop.months[monthKey].status
      }))
      .sort((a, b) => {
        const statusPriority = { 'best': 1, 'seasonal': 2, 'worst_in': 3, 'worst_out': 4 };
        return statusPriority[a.status] - statusPriority[b.status];
      });
    res.json(cropsForMonth);
  });
  console.log('Calendar data loaded');
} catch (err) {
  console.error('Error loading calendar data:', err.message);
}

const seedLootItems = async () => {
  try {
    const count = await LootItem.countDocuments();
    if (count === 0) {
      console.log('Seed loot items...');
      const trackerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tracker-data.json'), 'utf8'));
      
      const itemsToInsert = [];
      
      if (trackerData.skillBooks) {
        trackerData.skillBooks.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'Skill Book', skill: item.skill, is_skill_related: true });
        });
      }
      
      if (trackerData.recipeMagazines) {
        trackerData.recipeMagazines.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'Recipe Magazine', skill: item.skill, is_skill_related: !!item.skill });
        });
      }
      
      if (trackerData.tvShowsWithXP) {
        trackerData.tvShowsWithXP.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS TV Show', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.tvShowsNoXP) {
        trackerData.tvShowsNoXP.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS TV Show', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.retailMovies) {
        trackerData.retailMovies.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS Movie', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.woodcraftShows) {
        trackerData.woodcraftShows.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS Home', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.survivalShows) {
        trackerData.survivalShows.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS Home', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.fitnessShows) {
        trackerData.fitnessShows.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS Home', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.comicsAndPapers) {
        trackerData.comicsAndPapers.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'Comic/Paper', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      if (trackerData.vhsTapes) {
        trackerData.vhsTapes.forEach(item => {
          itemsToInsert.push({ base_id: item.id, name: item.name, category: 'VHS Home', skill: item.skill, is_skill_related: item.is_skill_related });
        });
      }
      
      await LootItem.insertMany(itemsToInsert);
      console.log(`Seeded ${itemsToInsert.length} loot items`);
    } else {
      console.log(`Loot items already seeded (${count} items)`);
    }
  } catch (err) {
    console.error('Error seeding loot items:', err.message);
  }
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));

app.get('*', (req, res) => {
  const reqPath = req.path;
  if (reqPath.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const startServer = async () => {
  await connectDB();
  await seedLootItems();
  app.listen(PORT, () => console.log(`PZ Loot Tracker server running on port ${PORT}`));
};

if (process.env.VERCEL !== '1') {
  startServer();
}

module.exports = app;
