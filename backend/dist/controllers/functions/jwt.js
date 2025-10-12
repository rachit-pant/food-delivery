import jwt from 'jsonwebtoken';
export const AccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        role: user.role_id,
        email: user.email,
    }, process.env.ACCESS_SECRET_KEY, { expiresIn: '20s' });
};
export const RefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        role: user.role_id,
    }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1d' });
};
