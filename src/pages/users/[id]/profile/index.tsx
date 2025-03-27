import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProfileForm from '@/components/ProfileForm';

interface Profile {
  id: number;
  user_id: number;
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
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles/1`, { // 修正: /profiles/1
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleCreateProfile = async (profileData: { introduction: string; skills: string; company_name: string; industry: string }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles`, { // 修正: /profiles
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('プロフィールの作成に失敗しました');
      }
      const newProfile: Profile = await response.json();
      setProfile(newProfile);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateProfile = async (profileData: { introduction: string; skills: string; company_name: string; industry: string }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles/1`, { // 修正: /profiles/1
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('プロフィールの更新に失敗しました');
      }
      const updatedProfile: Profile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>ロード中...</p>;
  }

  if (error) {
    return <p>エラー: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      {profile ? (
        editing ? (
          <ProfileForm initialProfile={profile} onSubmit={handleUpdateProfile} />
        ) : (
          <div>
            <p>自己紹介: {profile.introduction}</p>
            <p>スキル: {profile.skills}</p>
            <p>会社名: {profile.company_name}</p>
            <p>業界: {profile.industry}</p>
            <button onClick={() => setEditing(true)}>編集</button>
          </div>
        )
      ) : (
        <ProfileForm onSubmit={handleCreateProfile} />
      )}
    </div>
  );
}