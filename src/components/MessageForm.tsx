import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface MessageFormProps {
  onMessageSent: () => void;
}

export default function MessageForm({ onMessageSent }: MessageFormProps) {
  const [receiverId, setReceiverId] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:3001/api/v1/messages', {
        receiver_id: parseInt(receiverId),
        content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReceiverId('');
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
        <label className="block">受信者ID:</label>
        <input
          type="number"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
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