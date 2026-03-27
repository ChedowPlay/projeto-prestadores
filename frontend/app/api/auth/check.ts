import { NextApiRequest, NextApiResponse } from 'next';

import { cookies } from 'next/headers';
import { decrypt } from '../../lib/sessions';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (token || session?.userId) {
    return res.status(200).json({
      isAuthenticated: true,
      user: { userId: session?.userId, email: token?.email },
    });
  }

  return res.status(200).json({ isAuthenticated: false, user: null });
}
