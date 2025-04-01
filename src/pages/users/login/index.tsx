import { useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface LoginResponse {
  token?: string;
  message: string;
  user?: { id: number };
}

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          if (data.user && data.user.id) {
            localStorage.setItem('userId', data.user.id.toString());
          }
          Swal.fire({
            icon: 'success',
            title: 'ログイン成功',
            showConfirmButton: false,
            timer: 1500,
          });
          router.push('/jobs');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'ログイン失敗',
            text: data.message || 'ログインに失敗しました',
          });
        }
      } else {
        const errorData: LoginResponse = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'ログイン失敗',
          text: errorData.message || 'ログインに失敗しました',
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'ログイン中にエラーが発生しました',
        text: err.message || 'ログイン中にエラーが発生しました',
      });
      console.error('ログインエラー:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>
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