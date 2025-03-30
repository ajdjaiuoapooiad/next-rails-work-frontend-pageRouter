import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginResponseSuccess {
  token: string;
  user: { id: number };
}

interface LoginResponseError {
  message: string;
}

type LoginResponse = LoginResponseSuccess | LoginResponseError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/login'; // 環境変数からAPI URLを取得
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return res.status(500).json({ message: 'API URLが設定されていません。' });
      }

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (apiResponse.ok) {
        const data: LoginResponseSuccess = await apiResponse.json();
        res.status(200).json(data);
      } else {
        const errorData: LoginResponseError = await apiResponse.json();
        res.status(apiResponse.status).json(errorData);
      }
    } catch (error: any) {
      console.error('APIエラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
  } else {
    res.status(405).json({ message: '許可されていないメソッドです。' });
  }
}