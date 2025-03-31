import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URLが設定されていません。');
      }
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('ユーザー情報の削除に失敗しました');
      }

      router.push('/users');
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

  if (!user) {
    return <p className="text-center mt-8">ユーザーが見つかりません</p>;
  }

  const userTypeString = user.user_type === 'student' ? '学生' : user.user_type === 'company' ? '企業' : '不明';

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Head>
        <title>ユーザー情報ページ</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">ユーザー詳細</h1>
      <div className="rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row mb-2">
          <p className="flex-1 text-left sm:text-right">
            <strong>ID:</strong>
          </p>
          <p className="flex-1">{user.id}</p>
        </div>
        <div className="flex flex-col sm:flex-row mb-2">
          <p className="flex-1 text-left sm:text-right">
            <strong>名前:</strong>
          </p>
          <p className="flex-1">{user.name}</p>
        </div>
        <div className="flex flex-col sm:flex-row mb-2">
          <p className="flex-1 text-left sm:text-right">
            <strong>メールアドレス:</strong>
          </p>
          <p className="flex-1">{user.email}</p>
        </div>
        <div className="flex flex-col sm:flex-row mb-2">
          <p className="flex-1 text-left sm:text-right">
            <strong>ユーザータイプ:</strong>
          </p>
          <p className="flex-1">{userTypeString}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mt-4">
        <Link href={`/users/${user.id}/edit`}>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 w-full sm:w-auto">
            編集
          </button>
        </Link>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full sm:w-auto sm:ml-2 mt-2 sm:mt-0">
          削除
        </button>
      </div>
    </div>
  );
}