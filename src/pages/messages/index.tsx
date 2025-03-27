import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Message } from '@/utils/types';
import MessageForm from '@/components/MessageForm';



export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get<Message[]>('http://localhost:3001/api/v1/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          setError(axiosError.response?.data?.error || 'メッセージの取得に失敗しました。');
        } else {
          setError('メッセージの取得中に予期しないエラーが発生しました。');
        }
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    };

    fetchMessages();
  }, [refresh]);

  if (loading) return <p>ロード中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">メッセージ一覧</h1>
      {messages.map((message) => (
        <div key={message.id} className="border p-4 mb-2">
          <p>送信者: {message.sender_id}</p>
          <p>受信者: {message.receiver_id}</p>
          <p>内容: {message.content}</p>
        </div>
      ))}
      <MessageForm onMessageSent={() => setRefresh(true)} />
    </div>
  );
}