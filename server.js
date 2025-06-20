const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const db = new sqlite3.Database('./fot-news-db');

app.use(bodyParser.json());
app.use(cors());

// Initialize database tables
db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    )`);

    // Create news table
    db.run(`CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL
    )`);
});

// User Routes
// Register (Create User)
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password with 10 salt rounds
        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, username, email });
            });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login (Read User)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            res.json({ id: user.id, username: user.username, email: user.email });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Read All Users
app.get('/users', (req, res) => {
    db.all(`SELECT id, username, email FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Read User by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT id, username, email FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

// Update User
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`,
            [username, email, hashedPassword, id],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json({ message: 'User updated' });
            });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete User
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    });
});

// News Routes
// Create News
app.post('/news', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    db.run(`INSERT INTO news (title, content) VALUES (?, ?)`,
        [title, content],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, title, content });
        });
});

// Read All News
app.get('/news', (req, res) => {
    db.all(`SELECT id, title, content FROM news`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Read News by ID
app.get('/news/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT id, title, content FROM news WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json(row);
    });
});

// Update News
app.put('/news/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    db.run(`UPDATE news SET title = ?, content = ? WHERE id = ?`,
        [title, content, id],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'News not found' });
            }
            res.json({ message: 'News updated' });
        });
});

// Delete News
app.delete('/news/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM news WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json({ message: 'News deleted' });
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});