// ConversationList.tsx
import { Message, User } from '@/utils/types';
import Link from 'next/link';

interface ConversationListProps {
  groupedMessages: { [key: string]: Message[] };
  users: { [key: number]: User };
  currentUser: { id: number | null };
}

const ConversationList: React.FC<ConversationListProps> = ({ groupedMessages, users, currentUser }) => {
  return (
    <aside className="w-1/4 border-r p-4 bg-white shadow-md sm:block pd:w-full pd:block">
      <h2 className="text-lg font-semibold mb-4">会話一覧</h2>
      <ul className="space-y-2">
        {Object.keys(groupedMessages).map((conversationId) => {
          const conversationMessages = groupedMessages[conversationId];
          const otherUserId = conversationMessages[0].sender_id === currentUser.id ? conversationMessages[0].receiver_id : conversationMessages[0].sender_id;
          const otherUser = users[otherUserId];
          const otherUserName = otherUser?.name || '不明なユーザー';
          const otherUserIcon = otherUser?.profile?.user_icon_url || 'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png';

          return (
            <li key={conversationId} className="cursor-pointer p-3 rounded-lg hover:bg-gray-100">
              <Link href={`/messages/${conversationId}`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <img src={otherUserIcon} alt={`${otherUserName}のアイコン`} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">{otherUserName}</p>
                    <p className="text-sm text-gray-500">メッセージ数: {conversationMessages.length}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ConversationList;