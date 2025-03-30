import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

import MessageForm from '../../components/MessageForm';
import { Message } from '@/utils/types';

interface User {
  id: number;
  name: string;
}

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URLが設定されていません。');
  }
  return apiUrl;
};

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedMessages, setGroupedMessages] = useState<{[key: string]: Message[]}>({});
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ id: number | null }>({ id: null });
  const [users, setUsers] = useState<{[key: number]: string}>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      setCurrentUser({ id: userId ? parseInt(userId) : null });
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('authToken');
        const response = await axios.get<Message[]>(`${apiUrl}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
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
    const grouped: {[key: string]: Message[]} = messages.reduce((acc, message) => {
      const conversationId = [Math.min(message.sender_id, message.receiver_id), Math.max(message.sender_id, message.receiver_id)].join('-');
      if (!acc[conversationId]) {
        acc[conversationId] = [];
      }
      acc[conversationId].push(message);
      return acc;
    }, {});
    setGroupedMessages(grouped);
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('authToken');
        const response = await axios.get<User[]>(`${apiUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersMap: {[key: number]: string} = {};
        response.data.forEach(user => {
          usersMap[user.id] = user.name;
        });
        setUsers(usersMap);
      } catch (err) {
        console.error('ユーザーの取得に失敗しました。', err);
      }
    };
    fetchUsers();
  }, []);

  const formatMessagesForConversation = (messages: Message[]) => {
    const sortedMessages = messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return sortedMessages.map((message) => ({
      senderId: message.sender_id,
      content: message.content,
      createdAt: message.created_at,
      isCurrentUser: message.sender_id === currentUser.id,
      isFirstMessage: false,
    }));
  };

  if (loading) return <p>ロード中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/4 border-r p-4 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4">会話一覧</h2>
        <ul className="space-y-2">
          {Object.keys(groupedMessages).map((conversationId) => {
            const conversationMessages = groupedMessages[conversationId];
            const otherUserId = conversationMessages[0].sender_id === currentUser.id ? conversationMessages[0].receiver_id : conversationMessages[0].sender_id;
            const otherUserName = users[otherUserId] || '不明なユーザー';

            return (
              <li
                key={conversationId}
                className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 ${selectedConversation === conversationId ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedConversation(conversationId)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <img
                      src={'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png'} // otherUserIconが存在しない場合はデフォルトのアイコンを表示
                      alt={`${otherUserName}のアイコン`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{otherUserName}</p>
                    <p className="text-sm text-gray-500">メッセージ数: {conversationMessages.length}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="w-3/4 p-4">
        {selectedConversation ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">メッセージ詳細</h2>
            <div className="space-y-4">
              {formatMessagesForConversation(groupedMessages[selectedConversation]).map((message, index, array) => {
                const isFirstMessage = index === 0 || array[index - 1].senderId !== message.senderId;
                return (
                  <div key={message.createdAt} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-lg ${message.isCurrentUser ? 'bg-blue-100' : 'bg-gray-50'} w-1/2`}>
                      {isFirstMessage && <p className="text-sm font-semibold">{message.isCurrentUser ? 'あなた' : users[message.senderId] || '不明なユーザー'}</p>}
                      <p className="text-base leading-relaxed">{message.content}</p>
                      <p className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <MessageForm
              onMessageSent={() => setRefresh(true)}
              receiverId={selectedConversation ? groupedMessages[selectedConversation].find(message => message.sender_id !== currentUser.id)?.sender_id : null}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p>会話を選択してください。</p>
          </div>
        )}
      </main>
    </div>
  );
}