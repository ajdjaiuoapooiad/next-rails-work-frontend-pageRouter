import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

export default function UserEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<string>('student');

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('API URLが設定されていません。');
        }
        const response = await fetch(`${apiUrl}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const data: User = await response.json();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setUserType(data.user_type);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URLが設定されていません。');
      }
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          user_type: userType === 'student' ? 0 : 1,
        }),
      });
      if (!response.ok) {
        throw new Error('ユーザーの更新に失敗しました');
      }
      Swal.fire({
        icon: 'success',
        title: 'ユーザー情報を更新しました。',
        showConfirmButton: false,
        timer: 1500,
      });
      router.push(`/users/${id}`);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ユーザー情報の更新に失敗しました。',
        text: err.message,
      });
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">ロード中...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">エラー: {error}</p>;
  }

  if (!user) {
    return <p className="text-center mt-8">ユーザーが見つかりません</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">ユーザー編集</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ユーザータイプ</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="student">学生</option>
            <option value="company">企業</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
        >
          更新
        </button>
      </form>
    </div>
  );
}