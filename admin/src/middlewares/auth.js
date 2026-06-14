const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Chưa cung cấp token!' });

    // Kiểm tra xem SECRET có được load lên không
    if (!process.env.JWT_SECRET) {
        console.error("LỖI: JWT_SECRET chưa được cấu hình trong file .env");
        return res.status(500).json({ message: 'Lỗi cấu hình server!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verify Error:", err.message);
            return res.status(401).json({ message: 'Token không hợp lệ!' });
        }
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

const isAdmin = (req, res, next) => {
    // req.user được gán từ middleware verifyToken trước đó
    if (req.user && req.user.role === 'admin') {
        next(); // Cho phép truy cập
    } else {
        res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này!' });
    }
};

module.exports = { verifyToken, checkRole, isAdmin };