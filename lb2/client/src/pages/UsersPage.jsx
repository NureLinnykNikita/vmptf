import UserCard from '../components/UserCard.jsx';

export default function UsersPage({ users, currentUserId, friendships, onSendFriendRequest, onOpenMessages }) {
  function getFriendshipStatus(userId) {
    if (userId === currentUserId) {
      return 'self';
    }

    const friendship = friendships.find(item => {
      const direct = item.requesterId === currentUserId && item.addresseeId === userId;
      const reverse = item.requesterId === userId && item.addresseeId === currentUserId;
      return direct || reverse;
    });

    return friendship?.status || null;
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Користувачі</h2>
        <p>Перегляд профілів, додавання друзів та перехід до особистих повідомлень.</p>
      </div>

      <div className="grid users-grid">
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            currentUserId={currentUserId}
            friendshipStatus={getFriendshipStatus(user.id)}
            onSendFriendRequest={onSendFriendRequest}
            onOpenMessages={onOpenMessages}
          />
        ))}
      </div>
    </section>
  );
}
