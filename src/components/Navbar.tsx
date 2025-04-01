import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronDownIcon, MenuIcon, XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { FaPlus, FaEnvelope } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  user_type: string;
  profile: {
    user_icon_url: string | null;
    bg_image_url: string | null;
  } | null;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [userIconUrl, setUserIconUrl]: any = useState<string | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URLが設定されていません。');
      }
      axios
        .get<User>(`${apiUrl}/users/show_by_id/${userId}`)
        .then((response) => {
          setUsername(response.data.name);
          setUserType(response.data.user_type);
          setUserIconUrl(response.data.profile?.user_icon_url || 'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png');
          setBgImageUrl(response.data.profile?.bg_image_url || null);
        })
        .catch((error) => {
          console.error('ユーザー情報の取得に失敗しました:', error);
          setUserIconUrl('https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png');
          setBgImageUrl(null);
        });
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
    setUserType(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/jobs');
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/jobs" className="text-2xl font-extrabold text-white tracking-wide flex items-center">
            <img src="/images/logo2.svg" className="w-10 h-10 mr-2" alt="ロゴ" />
            インターンマッチングアプリ
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/jobs" className="text-gray-200 hover:text-white transition-colors duration-300">
              求人一覧
            </Link>
            {isLoggedIn ? (
              <>
                {userType === 'company' && (
                  <Link href="/jobs/create" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center">
                    <FaPlus className="mr-1" /> 求人作成
                  </Link>
                )}
                <Link href="/messages" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center">
                  <FaEnvelope className="mr-1" /> 通知
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex flex-col items-center">
                      {userType && (
                        <span className="text-xs text-gray-300">
                          {userType === 'company' ? '企業' : '学生'}
                        </span>
                      )}
                      {username && (
                        <p className="text-white">
                          {username.length > 5 ? `${username.substring(0, 5)}...` : username}
                        </p>
                      )}
                    </div>
                    <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center overflow-hidden">
                      <img
                        src={userIconUrl}
                        alt="User Icon"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {isDropdownOpen ? (
                      <XIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="flex justify-end p-2">
                        <button onClick={closeDropdown}>
                          <XIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                      <Link
                        href={`/users/${userId}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                        onClick={closeDropdown}
                      >
                        プロフィール
                      </Link>
                      <Link
                        href={`/users/${userId}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        ユーザー情報
                      </Link>
                      {userType === 'student' && (
                        <>
                          <Link
                            href={`/users/${userId}/profile`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeDropdown}
                          >
                            応募した企業
                          </Link>
                          <Link
                            href={`/users/${userId}/profile`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeDropdown}
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
                            onClick={closeDropdown}
                          >
                            募集した求人
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          closeDropdown();
                        }}
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
          <button
            className="text-white focus:outline-none md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white shadow-md rounded-md p-4 mt-2">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/jobs" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">
              求人一覧
            </Link>
            {isLoggedIn ? (
              <>
                {userType === 'company' && (
                  <Link href="/jobs/create" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 flex items-center">
                    <FaPlus className="mr-1" /> 求人作成
                  </Link>
                )}
                <Link href="/messages" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 flex items-center">
                  <FaEnvelope className="mr-1" /> 通知
                </Link>
                <Link
                  href={`/users/${userId}/profile`}
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-300"
                >
                  プロフィール
                </Link>
                <Link href={`/users/${userId}`} className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">
                  ユーザー情報
                </Link>
                {userType === 'student' && (
                  <>
                    <Link
                      href={`/users/${userId}/profile`}
                      className="text-gray-700 hover:text-indigo-600 transition-colors duration-300"
                    >
                      応募した企業
                    </Link>
                    <Link
                      href={`/users/${userId}/profile`}
                      className="text-gray-700 hover:text-indigo-600 transition-colors duration-300"
                    >
                      いいねした求人
                    </Link>
                  </>
                )}
                {userType === 'company' && (
                  <Link href={'/users/jobs'} className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">
                    募集した求人
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-700 hover:text-red-600 transition-colors duration-300"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/users/login"
                  className="text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                >
                  ログイン
                </Link>
                <Link
                  href="/users/register"
                  className="text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;