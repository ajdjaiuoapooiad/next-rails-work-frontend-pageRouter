import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Message } from '../../types/message';
import MessageForm from '../../components/MessageForm';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
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
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="w-1/4 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">メッセージ一覧</h2>
        <ul className="space-y-2">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`cursor-pointer ${selectedMessage?.id === message.id ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <p>送信者: {message.sender_id}</p>
              <p>受信者: {message.receiver_id}</p>
              <p>内容: {message.content.substring(0, 50)}...</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* メインコンテンツ */}
      <main className="w-3/4 p-4">
        {selectedMessage ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">メッセージ詳細</h2>
            <p>送信者: {selectedMessage.sender_id}</p>
            <p>受信者: {selectedMessage.receiver_id}</p>
            <p>内容: {selectedMessage.content}</p>
          </div>
        ) : (
          <p>メッセージを選択してください。</p>
        )}
        <MessageForm onMessageSent={() => setRefresh(true)} />
      </main>
    </div>
  );
}