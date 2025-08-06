import jwt from 'jsonwebtoken';

interface User {
  id: number;
  role_id: number | null;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  password: string;
  refreshToken: string | null;
}

const AccessToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role_id,
      email: user.email,
    },
    process.env.ACCESS_SECRET_KEY as string,
    { expiresIn: '1h' }
  );
};

const RefreshToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_SECRET_KEY as string,
    { expiresIn: '1d' }
  );
};

module.exports = { AccessToken, RefreshToken };
