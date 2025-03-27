import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginResponse {
  token?: string;
  message: string;
  user?: { id: number }; // ユーザーIDを追加
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const apiResponse = await fetch(process.env.RAILS_API_LOGIN_URL || 'http://localhost:3001/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (apiResponse.ok) {
        const data: LoginResponse = await apiResponse.json();
        res.status(200).json(data);
      } else {
        const errorData: LoginResponse = await apiResponse.json();
        res.status(apiResponse.status).json(errorData);
      }
    } catch (error: any) {
      console.error('APIエラー:', error);
      res.status(500).json({ message: 'サーバーエラー' });
    }
  } else {
    res.status(405).json({ message: '許可されていないメソッド' });
  }
}