// pages/api/profiles/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'; // axiosをインポート

interface Profile {
  id: number;
  user_id: number;
  introduction: string;
  skills: string;
  company_name: string;
  industry: string;
  created_at: string;
  updated_at: string;
  user_icon_url: string;
  bg_image_url: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Profile | { error: string }>) {
  const { id } = req.query;

  try {
    // RailsバックエンドAPIからプロフィールデータを取得
    const response = await axios.get<Profile>(`http://127.0.0.1:3001/api/v1/profiles/${id}`);
    const profile = response.data;

    res.status(200).json(profile);
  } catch (error) {
    console.error('プロフィールの取得に失敗しました:', error);
    res.status(500).json({ error: 'プロフィールの取得に失敗しました' });
  }
}