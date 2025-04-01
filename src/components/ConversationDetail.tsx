// ConversationDetail.tsx
import { useState, useEffect } from 'react';
import { Message, User } from '@/utils/types';
import MessageForm from '@/components/MessageForm';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';

interface ConversationDetailProps {
  users: { [key: number]: User };
  currentUser: { id: number | null };
  conversationId: string;
}

interface ErrorResponse {
  error: string;
}

const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URLが設定されていません。');
  }
  return apiUrl;
};

const ConversationDetail: React.FC<ConversationDetailProps> = ({ users, currentUser, conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    if (!conversationId) {
      setError('会話IDが存在しません。');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl();
        const token = localStorage.getItem('authToken');
        // conversationId を数値に変換
        const [senderId, receiverId] = conversationId.split('-').map(Number);
        const response = await axios.get<Message[]>(`${apiUrl}/messages/${senderId}-${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;
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
  }, [conversationId, refresh]);

  const formatMessagesForConversation = (messages: Message[]) => {
    const sortedMessages = messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return sortedMessages.map((message) => ({
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      createdAt: message.created_at,
      isCurrentUser: message.sender_id === currentUser.id,
      isFirstMessage: false,
    }));
  };

  if (loading) return <p>ロード中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <main className="flex-1 p-4">
      {conversationId ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">メッセージ詳細</h2>
          <div className="space-y-4">
            {formatMessagesForConversation(messages).map((message, index, array) => {
              const isFirstMessage = index === 0 || array[index - 1].senderId !== message.senderId;
              const senderName = users[message.senderId]?.name || '不明なユーザー';
              const receiverName = users[message.receiverId]?.name || '不明なユーザー';
              const messageOwnerName = message.isCurrentUser ? 'あなた' : senderName;

              return (
                <div key={message.createdAt} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-lg ${message.isCurrentUser ? 'bg-blue-100' : 'bg-gray-50'} max-w-2/3`}>
                    {isFirstMessage && <p className="text-sm font-semibold">{messageOwnerName}</p>}
                    <p className="text-base leading-relaxed">{message.content}</p>
                    <p className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <MessageForm
            onMessageSent={() => setRefresh(true)}
            receiverId={conversationId ? messages.find(message => message.sender_id !== currentUser.id)?.sender_id : null}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>会話を選択してください。</p>
        </div>
      )}
    </main>
  );
};

export default ConversationDetail;