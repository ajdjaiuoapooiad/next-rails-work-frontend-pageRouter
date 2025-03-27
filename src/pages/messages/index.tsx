import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Message } from '../../types/message';
import MessageForm from '../../components/MessageForm';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedMessages, setGroupedMessages] = useState<{[key: number]: Message[]}>({});
  const [selectedReceiver, setSelectedReceiver] = useState<number | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const currentUser = { id: 1 }; // ダミーのcurrentUser

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

  useEffect(() => {
    const grouped: {[key: number]: Message[]} = messages.reduce((acc, message) => {
      const receiverId = message.receiver_id;
      if (!acc[receiverId]) {
        acc[receiverId] = [];
      }
      acc[receiverId].push(message);
      return acc;
    }, {});
    setGroupedMessages(grouped);
  }, [messages]);

  const formatMessagesForConversation = (messages: Message[]) => {
    const sortedMessages = messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return sortedMessages.map((message) => ({
      senderId: message.sender_id,
      content: message.content,
      createdAt: message.created_at,
    }));
  };

  if (loading) return <p>ロード中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="w-1/4 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">受信者一覧</h2>
        <ul className="space-y-2">
          {Object.keys(groupedMessages).map((receiverId) => (
            <li
              key={receiverId}
              className={`cursor-pointer ${selectedReceiver === parseInt(receiverId) ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedReceiver(parseInt(receiverId))}
            >
              <p>受信者ID: {receiverId}</p>
              <p>メッセージ数: {groupedMessages[parseInt(receiverId)].length}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* メインコンテンツ */}
      <main className="w-3/4 p-4">
        {selectedReceiver ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">メッセージ詳細</h2>
            <div className="space-y-4">
              {formatMessagesForConversation(groupedMessages[selectedReceiver]).map((message) => (
                <div key={message.createdAt} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg ${message.senderId === currentUser.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <p>{message.content}</p>
                    <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>受信者を選択してください。</p>
        )}
        <MessageForm onMessageSent={() => setRefresh(true)} />
      </main>
    </div>
  );
}