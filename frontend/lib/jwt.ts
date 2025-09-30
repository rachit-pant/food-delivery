import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  role: number;
}
export const jwt = async () => {
  const cookieStore = await cookies();

  const refreshtoken = cookieStore.get('refreshtoken')?.value as string;
  let role: number = 0;
  if (refreshtoken) {
    try {
      const payload = verify(refreshtoken, process.env.REFRESH_SECRET_KEY!);
      const decoded = payload as unknown as JwtPayload;
      console.log('Decoded JWT payload:', decoded);
      role = decoded.role;
    } catch (err) {
      console.error('JWT verify error:', err);
    }
  }
  return role;
};
