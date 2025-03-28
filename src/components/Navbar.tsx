import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon } from '@heroicons/react/solid'// アイコンをインポート

interface User {
  id: number;
  // 他のユーザー情報
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // ドロップダウンの開閉状態

  useEffect(() => {
    // localStorageからauthTokenを取得し、ログイン状態を確認
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // トークンが存在すればログイン状態をtrueに設定

    // localStorageからuserIdを取得
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(parseInt(id));
    }
  }, []);

  useEffect(() => {
    // userIdが存在する場合、ユーザー名を取得
    if (userId) {
      axios
        .get(`http://localhost:3001/api/v1/users/show_by_id/${userId}`)
        .then((response) => {
          setUsername(response.data.name);
        })
        .catch((error) => {
          console.error('ユーザー名の取得に失敗しました:', error);
        });
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
    setIsDropdownOpen(false); // ドロップダウンを閉じる
  };

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
          <Link
            href="/messages"
            className="text-gray-200 hover:text-white transition-colors duration-300"
          >
            通知
          </Link>
          {isLoggedIn && userId && username ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="rounded-full h-8 w-8 bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700">{username.charAt(0).toUpperCase()}</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 ${isDropdownOpen ? 'transform rotate-180' : ''}`} /> {/* アイコンを追加 */}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <Link
                    href={`/users/${userId}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                  >
                    プロフィール
                  </Link>
                  <Link
                    href={`/users/${userId}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ユーザー情報
                  </Link>
                  <Link
                    href={`/users/${userId}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    応募した企業
                  </Link>
                  <Link
                    href={`/users/${userId}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    いいねした求人
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 rounded-b-md"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
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