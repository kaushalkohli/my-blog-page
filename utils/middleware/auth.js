import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        res.locals.token = {
            userId: decoded.userId,
            username: decoded.username 
        };
        
        next();
    } catch (e) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};