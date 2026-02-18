import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const user = await User.findById(uid);

        if (!user || !user.activo) {
            return res.status(401).json({ msg: 'Token no válido - usuario inactivo' });
        }

        req.user = user; // Guardamos el usuario en la req para usarlo en los posts
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};