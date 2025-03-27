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
        const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles/1`, {
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
      const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles`, {
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
      const response = await fetch(`http://localhost:3001/api/v1/users/${id}/profiles/1`, {
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
    return <p className="text-center mt-8">ロード中...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">エラー: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
      {profile ? (
        editing ? (
          <div className="max-w-2xl mx-auto"> {/* 修正: max-w-2xl に変更 */}
            <ProfileForm initialProfile={profile} onSubmit={handleUpdateProfile} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4"> {/* 修正: max-w-2xl に変更 */}
            <div className="border p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-2">自己紹介</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{profile.introduction}</p>
            </div>
            <div className="border p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-2">スキル</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{profile.skills}</p>
            </div>
            <div className="border p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-2">会社名</h2>
              <p>{profile.company_name}</p>
            </div>
            <div className="border p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-2">業界</h2>
              <p>{profile.industry}</p>
            </div>
            <div className="text-center">
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                編集
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="max-w-2xl mx-auto"> {/* 修正: max-w-2xl に変更 */}
          <ProfileForm onSubmit={handleCreateProfile} />
        </div>
      )}
    </div>
  );
}