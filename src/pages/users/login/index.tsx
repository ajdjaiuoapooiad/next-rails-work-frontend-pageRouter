import { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginResponseSuccess {
  token: string;
  user: { id: number };
}

interface LoginResponseError {
  message: string;
}

type LoginResponse = LoginResponseSuccess | LoginResponseError;

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URLが設定されていません。');
  }
  return apiUrl;
};

const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData: LoginResponseError = await response.json();
    throw new Error(errorData.message || 'ログインに失敗しました。');
  }
  return response.json();
};

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const data: LoginResponse = await apiRequest(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if ('token' in data) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user.id.toString());
        router.push('/jobs');
      } else {
        setError(data.message || 'ログインに失敗しました。');
      }
    } catch (err: any) {
      setError('ログイン中にエラーが発生しました。');
      console.error('ログインエラー:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>
        {error && <p className="text-red-500 mb-4 p-2 border border-red-500 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}