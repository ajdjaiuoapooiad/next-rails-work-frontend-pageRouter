import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';

interface User {
  id: number;
  user_type: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(parseInt(id));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3001/api/v1/users/show_by_id/${userId}`)
        .then((response) => {
          setUsername(response.data.name);
          setUserType(response.data.user_type);
        })
        .catch((error) => {
          console.error('ユーザー情報の取得に失敗しました:', error);
        });
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
    setUserType(null);
    setIsDropdownOpen(false);
    router.push('/jobs');
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/jobs" className="text-2xl font-extrabold text-white tracking-wide flex items-center"> {/* flexを追加 */}
          <img src="/images/logo2.svg" className="w-10 h-10 mr-2" alt="ロゴ" /> {/* mr-2でアイコンと文字の間にスペースを追加 */}
          インターンマッチングアプリ
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/jobs" className="text-gray-200 hover:text-white transition-colors duration-300">
            求人一覧
          </Link>
          {isLoggedIn ? (
            <>
              {userType === 'company' && (
                <Link href="/jobs/create" className="text-gray-200 hover:text-white transition-colors duration-300">
                  求人作成
                </Link>
              )}
              <Link href="/messages" className="text-gray-200 hover:text-white transition-colors duration-300">
                通知
              </Link>
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {username && (
                    <p className="text-white">
                      {username.length > 5 ? `${username.substring(0, 5)}...` : username}
                    </p>
                  )}
                  <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center overflow-hidden">
                    <img
                      src={'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png'}
                      alt="User Icon"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link
                      href={`/users/${userId}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                    >
                      プロフィール
                    </Link>
                    <Link href={`/users/${userId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ユーザー情報
                    </Link>
                    {userType === 'student' && (
                      <>
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
                      </>
                    )}
                    {userType === 'company' && (
                      <>
                        <Link
                          href={'/users/jobs'}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          募集した求人
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 rounded-b-md"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <Link
                href="/users/login"
                className="px-5 py-2 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-100 transition-colors duration-300"
              >
                ログイン
              </Link>
              <Link
                href="/users/register"
                className="px-5 py-2 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-100 transition-colors duration-300"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;