import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // 完成しているAPIを呼び出す
      const apiResponse = await fetch('http://localhost:3001/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (apiResponse.ok) {
        // APIからのレスポンスをそのまま返す
        const data = await apiResponse.json();
        res.status(200).json(data);
      } else {
        res.status(401).json({ message: 'ログイン失敗' });
      }
    } catch (error) {
      console.error('APIエラー:', error);
      res.status(500).json({ message: 'サーバーエラー' });
    }
  } else {
    res.status(405).json({ message: '許可されていないメソッド' });
  }
}