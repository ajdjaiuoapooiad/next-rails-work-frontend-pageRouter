import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: number;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3001/api/v1/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">ロード中...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">エラー: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ユーザー一覧</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border p-4 rounded-md shadow-sm">
            <p>
              <strong>名前:</strong> {user.name}
            </p>
            <p>
              <strong>メールアドレス:</strong> {user.email}
            </p>
            <p>
              <strong>ユーザータイプ:</strong> {user.user_type === 0 ? '学生' : '企業'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}