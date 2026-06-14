const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set')
    process.exit(1)
}

/**
 * Middleware that verifies the JWT from the Authorization header.
 * Attaches decoded payload to req.user on success.
 */
function authenticate(req, res, next) {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = header.slice(7)

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        return res.status(401).json({ message: 'Invalid token' })
    }
}

/**
 * Returns a middleware that checks req.user.role matches the required role.
 * Must be used AFTER authenticate.
 */
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' })
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Requires ${role} role` })
        }
        next()
    }
}

/**
 * Returns a middleware that checks req.user.permissionLevel.
 * Must be used AFTER authenticate.
 */
function requirePermission(level) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' })
        }
        if (req.user.permissionLevel !== level) {
            return res.status(403).json({ message: `Requires ${level} permission` })
        }
        next()
    }
}

module.exports = { authenticate, requireRole, requirePermission }
