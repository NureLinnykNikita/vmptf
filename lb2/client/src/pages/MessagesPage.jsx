import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import { formatDate } from '../utils/date.js';

export default function MessagesPage({ users, currentUserId, initialPartnerId }) {
  const availableUsers = users.filter(user => user.id !== currentUserId);
  const [partnerId, setPartnerId] = useState(initialPartnerId || availableUsers[0]?.id || '');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialPartnerId && initialPartnerId !== currentUserId) {
      setPartnerId(initialPartnerId);
    }
  }, [initialPartnerId, currentUserId]);

  useEffect(() => {
    const partnerExists = availableUsers.some(user => user.id === Number(partnerId));

    if (!partnerExists) {
      setPartnerId(availableUsers[0]?.id || '');
    }
  }, [currentUserId, users]);

  useEffect(() => {
    if (!currentUserId || !partnerId || Number(partnerId) === currentUserId) {
      return;
    }

    loadConversation();
  }, [currentUserId, partnerId]);

  async function loadConversation() {
    setLoading(true);

    try {
      const data = await api.getConversation(currentUserId, partnerId);
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim() || !partnerId) {
      return;
    }

    const created = await api.sendMessage({
      senderId: currentUserId,
      receiverId: Number(partnerId),
      text: text.trim()
    });

    setMessages(previous => [...previous, created]);
    setText('');
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Особисті повідомлення</h2>
        <p>Демонстрація приватного листування між користувачами.</p>
      </div>

      <div className="card messages-card">
        <div className="messages-toolbar">
          <label htmlFor="partner">Співрозмовник</label>
          <select
            id="partner"
            value={partnerId}
            onChange={event => setPartnerId(Number(event.target.value))}
          >
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.fullName}</option>
            ))}
          </select>
        </div>

        <div className="messages-list">
          {loading ? (
            <p className="muted">Завантаження повідомлень...</p>
          ) : messages.length ? (
            messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.senderId === currentUserId ? 'own' : ''}`}
              >
                <strong>{message.sender?.fullName || 'Користувач'}</strong>
                <p>{message.text}</p>
                <small>{formatDate(message.createdAt)}</small>
              </div>
            ))
          ) : (
            <p className="muted">Повідомлень ще немає. Напишіть першим.</p>
          )}
        </div>

        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            value={text}
            onChange={event => setText(event.target.value)}
            placeholder="Введіть повідомлення..."
          />
          <button type="submit" disabled={!text.trim()}>Надіслати</button>
        </form>
      </div>
    </section>
  );
}
