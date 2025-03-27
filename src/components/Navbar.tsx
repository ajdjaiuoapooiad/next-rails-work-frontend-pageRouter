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
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <Link href="/jobs" className="text-2xl font-extrabold text-white tracking-wide">
      Wantedly風
    </Link>
    <div className="flex items-center space-x-6">
      <Link
        href="/jobs"
        className="text-gray-200 hover:text-white transition-colors duration-300"
      >
        求人一覧
      </Link>
      <Link
        href="/jobs/create"
        className="text-gray-200 hover:text-white transition-colors duration-300"
      >
        求人作成
      </Link>
      {currentUser ? (
        <Link
          href={`/users/${currentUser.id}/profile/1`}
          className="text-gray-200 hover:text-white transition-colors duration-300"
        >
          プロフィール
        </Link>
      ) : (
        <Link
          href="/users/login"
          className="px-5 py-2 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-100 transition-colors duration-300"
        >
          ログイン
        </Link>
      )}
    </div>
  </div>
</nav>
  );
};

export default Navbar;