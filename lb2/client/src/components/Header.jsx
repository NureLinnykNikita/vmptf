export default function Header({ users, currentUserId, onChangeCurrentUser, activeTab, onChangeTab }) {
  const tabs = [
    { id: 'users', label: 'Користувачі' },
    { id: 'posts', label: 'Пости' },
    { id: 'friends', label: 'Друзі' },
    { id: 'messages', label: 'Повідомлення' },
    { id: 'search', label: 'Пошук' }
  ];

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Node.js + Express + React</p>
        <h1>Mini Social Network</h1>
      </div>

      <div className="current-user-panel">
        <label htmlFor="currentUser">Поточний користувач</label>
        <select
          id="currentUser"
          value={currentUserId || ''}
          onChange={event => onChangeCurrentUser(Number(event.target.value))}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.fullName}</option>
          ))}
        </select>
      </div>

      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            type="button"
            onClick={() => onChangeTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
