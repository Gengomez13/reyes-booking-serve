const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

// Register new user
function registerUser(email, password, name, role = 'client') {
    return new Promise((resolve, reject) => {
        if (role !== 'client' && role !== 'admin') {
            return reject(new Error('Invalid role'));
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        db.run(
            'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?) RETURNING id',
            [email, hashedPassword, name, role],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        email,
                        name,
                        role
                    });
                }
            }
        );
    });
}

// Login user
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
            if (err) {
                return reject(err);
            }

            if (!user) {
                return reject(new Error('User not found'));
            }

            if (!bcrypt.compareSync(password, user.password_hash)) {
                return reject(new Error('Invalid password'));
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );

            resolve({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        });
    });
}

// Reset a user's password (used by the temporary admin password-reset endpoint)
function resetPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        db.run(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [hashedPassword, email],
            function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('User not found'));
                } else {
                    resolve({ changes: this.changes });
                }
            }
        );
    });
}

// Verify token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Middleware to check authentication
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
}

// Middleware to check admin role
function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    verifyToken,
    authMiddleware,
    adminMiddleware
};
