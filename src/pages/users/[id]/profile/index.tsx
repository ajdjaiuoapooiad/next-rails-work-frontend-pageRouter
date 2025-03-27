import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Profile {
  id: number;
  introduction: string;
  skills: string;
  company_name: string;
  industry: string;
}

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles/1`, { // 1 はダミーのプロフィールID
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('プロフィール情報の取得に失敗しました');
        }
        const data: Profile = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <p>ロード中...</p>;
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  if (!profile) {
    return <p>プロフィール情報がありません。</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <p>自己紹介: {profile.introduction}</p>
      <p>スキル: {profile.skills}</p>
      <p>会社名: {profile.company_name}</p>
      <p>業界: {profile.industry}</p>
    </div>
  );
}