export default function FriendsPage({ currentUser, friends, friendRequests, onAcceptFriendRequest }) {
  return (
    <section>
      <div className="section-heading">
        <h2>Дружні зв'язки</h2>
        <p>Поточний користувач: <strong>{currentUser?.fullName}</strong></p>
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Мої друзі</h3>
          {friends.length ? (
            <div className="compact-list">
              {friends.map(friend => (
                <div className="compact-item" key={friend.id}>
                  <img src={friend.avatarUrl} alt={friend.fullName} />
                  <div>
                    <strong>{friend.fullName}</strong>
                    <p className="muted">@{friend.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Список друзів поки що порожній.</p>
          )}
        </div>

        <div className="card">
          <h3>Вхідні заявки</h3>
          {friendRequests.incoming.length ? (
            <div className="compact-list">
              {friendRequests.incoming.map(request => (
                <div className="compact-item request-item" key={request.id}>
                  <img src={request.requester?.avatarUrl} alt={request.requester?.fullName} />
                  <div>
                    <strong>{request.requester?.fullName}</strong>
                    <p className="muted">хоче додати вас у друзі</p>
                  </div>
                  <button type="button" onClick={() => onAcceptFriendRequest(request.id)}>
                    Прийняти
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Немає вхідних заявок.</p>
          )}

          <h3 className="with-margin">Вихідні заявки</h3>
          {friendRequests.outgoing.length ? (
            <div className="compact-list">
              {friendRequests.outgoing.map(request => (
                <div className="compact-item" key={request.id}>
                  <img src={request.addressee?.avatarUrl} alt={request.addressee?.fullName} />
                  <div>
                    <strong>{request.addressee?.fullName}</strong>
                    <p className="muted">очікує підтвердження</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Немає вихідних заявок.</p>
          )}
        </div>
      </div>
    </section>
  );
}
