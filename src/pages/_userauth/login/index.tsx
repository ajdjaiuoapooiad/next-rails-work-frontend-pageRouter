import { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginResponse {
  message: string;
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
        // ログイン成功時の処理
        router.push('/dashboard');
      } else {
        // ログイン失敗時の処理
        const data: LoginResponse = await response.json();
        alert(`ログインに失敗しました: ${data.message}`);
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログイン中にエラーが発生しました');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>パスワード:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}