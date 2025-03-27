import Link from 'next/link';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  // 他のユーザー情報
}

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得 (例)
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const user: User = JSON.parse(userString);
        setCurrentUser(user);
      } catch (error) {
        console.error('ユーザー情報のパースエラー:', error);
      }
    }
  }, []);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/jobs" className="text-xl font-bold text-blue-600">Wantedly風</Link>
        <div className="flex items-center space-x-4">
          <Link href="/jobs" className="text-gray-700 hover:text-blue-600">求人一覧</Link>
          <Link href="/jobs/create" className="text-gray-700 hover:text-blue-600">求人作成</Link>
          {currentUser ? (
            <Link href={`/users/${currentUser.id}/profile/1`} className="text-gray-700 hover:text-blue-600">プロフィール</Link>
          ) : (
            <Link href="/users/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">ログイン</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;