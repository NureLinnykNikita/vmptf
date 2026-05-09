export default function UserCard({ user, currentUserId, friendshipStatus, onSendFriendRequest, onOpenMessages }) {
  const isCurrentUser = user.id === currentUserId;

  function renderFriendshipButton() {
    if (isCurrentUser) {
      return <span className="badge">Це ви</span>;
    }

    if (friendshipStatus === 'accepted') {
      return <span className="badge success">У друзях</span>;
    }

    if (friendshipStatus === 'pending') {
      return <span className="badge warning">Заявка очікує</span>;
    }

    return (
      <button type="button" onClick={() => onSendFriendRequest(user.id)}>
        Додати в друзі
      </button>
    );
  }

  return (
    <article className="card user-card">
      <img src={user.avatarUrl} alt={user.fullName} />
      <div>
        <h3>{user.fullName}</h3>
        <p className="muted">@{user.username}</p>
        <p>{user.bio}</p>
        <div className="actions-row">
          {renderFriendshipButton()}
          {!isCurrentUser && (
            <button className="secondary" type="button" onClick={() => onOpenMessages(user.id)}>
              Написати
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
