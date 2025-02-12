// server/middleware/adminAuthMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminAuth = (req, res, next) => {
    // authorization হেডার থেকে টোকেন পান
    const token = req.header('Authorization');

    // যদি টোকেন না থাকে
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' }); // Unauthorized
    }

    try {
        // টোকেন ভেরিফাই করুন
        const decoded = jwt.verify(token.replace('Bearer ', '').trim(), process.env.JWT_SECRET); // Bearer স্কিম সরাতে এবং trim করতে

        // verified ইউজার রিকোয়েস্ট অবজেক্ট এ যোগ করুন
        req.adminId = decoded.adminId; // টোকেন থেকে adminId বের করে রিকোয়েস্টে যোগ করুন
        next(); // পরবর্তী middleware বা route handler এ যান
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' }); // Unauthorized - টোকেন ইনভ্যালিড
    }
};

export default adminAuth;