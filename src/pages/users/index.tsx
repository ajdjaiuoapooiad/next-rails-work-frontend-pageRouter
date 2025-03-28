import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: number;
  icon?: string;
}

const defaultIcon = 'https://via.placeholder.com/150';

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
          <li
            key={user.id}
            className="border p-4 rounded-md shadow-sm flex items-center"
            style={{ minHeight: '100px' }} // heightを調整
          >
            <img
              src={'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png'}
              alt={`${user.name}のアイコン`}
              className="w-14 h-14 rounded-full mr-4"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <strong>名前:</strong> {user.name}
              </div>
              <div>
                <strong>メールアドレス:</strong> {user.email}
              </div>
              <div>
                <strong>ユーザータイプ:</strong> {user.user_type === 0 ? '学生' : '企業'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}