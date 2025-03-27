import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface MessageFormProps {
  onMessageSent: () => void;
  receiverId: number | null; // receiverId をプロパティとして追加
}

export default function MessageForm({ onMessageSent, receiverId }: MessageFormProps) {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId) {
      setError('送信相手を選択してください。');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:3001/api/v1/messages', {
        receiver_id: receiverId,
        content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContent('');
      setError(null);
      onMessageSent();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        setError(axiosError.response?.data?.errors?.join(', ') || 'メッセージの送信に失敗しました。');
      } else {
        setError('メッセージの送信中に予期しないエラーが発生しました。');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-2">
        <label className="block">内容:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2">
        送信
      </button>
    </form>
  );
}