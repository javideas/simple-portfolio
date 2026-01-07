import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const correctPassword = process.env.APP_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (password === correctPassword) {
    // Set secure HTTP-only cookie
    const token = process.env.APP_AUTH_TOKEN || 'authenticated';
    res.setHeader('Set-Cookie', [
      `app_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
    ]);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Wrong password' });
}
