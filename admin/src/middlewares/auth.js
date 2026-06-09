const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Bạn chưa đăng nhập!' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token không hợp lệ!' });
        req.user = decoded;
        next();
    });
};

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập này!' });
    }
    next();
};

module.exports = { verifyToken, checkRole };