import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import PostCard from '../components/PostCard.jsx';

export default function SearchPage({ currentUserId, onAddComment, onOpenMessages }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        runSearch(query.trim());
      } else {
        setResults({ users: [], posts: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function runSearch(value) {
    setLoading(true);

    try {
      const data = await api.search(value);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Пошук</h2>
        <p>Пошук виконується одночасно серед профілів користувачів і текстів постів.</p>
      </div>

      <div className="card search-card">
        <label htmlFor="search">Пошуковий запит</label>
        <input
          id="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Наприклад: React, Express, Нікіта..."
        />
      </div>

      {loading && <p className="muted">Пошук...</p>}

      <div className="two-columns">
        <div>
          <h3>Знайдені користувачі</h3>
          {results.users.length ? (
            <div className="compact-list">
              {results.users.map(user => (
                <div className="card compact-item search-user" key={user.id}>
                  <img src={user.avatarUrl} alt={user.fullName} />
                  <div>
                    <strong>{user.fullName}</strong>
                    <p className="muted">@{user.username}</p>
                    <p>{user.bio}</p>
                    {user.id !== currentUserId && (
                      <button className="secondary" type="button" onClick={() => onOpenMessages(user.id)}>
                        Написати
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Нічого не знайдено.</p>
          )}
        </div>

        <div>
          <h3>Знайдені пости</h3>
          {results.posts.length ? (
            <div className="posts-list compact-posts">
              {results.posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onAddComment={onAddComment}
                />
              ))}
            </div>
          ) : (
            <p className="muted">Нічого не знайдено.</p>
          )}
        </div>
      </div>
    </section>
  );
}
