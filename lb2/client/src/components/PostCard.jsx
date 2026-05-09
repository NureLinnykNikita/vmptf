import { useState } from 'react';
import { formatDate } from '../utils/date.js';

export default function PostCard({ post, currentUserId, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    onAddComment(post.id, commentText.trim());
    setCommentText('');
  }

  return (
    <article className="card post-card">
      <div className="post-header">
        <img src={post.author?.avatarUrl} alt={post.author?.fullName || 'Автор'} />
        <div>
          <h3>{post.author?.fullName || 'Невідомий автор'}</h3>
          <p className="muted">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <section className="comments-section">
        <h4>Коментарі ({post.comments?.length || 0})</h4>

        {post.comments?.length ? (
          <div className="comments-list">
            {post.comments.map(comment => (
              <div className="comment" key={comment.id}>
                <strong>{comment.author?.fullName || 'Користувач'}:</strong>
                <span>{comment.text}</span>
                <small>{formatDate(comment.createdAt)}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Поки що немає коментарів.</p>
        )}

        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            value={commentText}
            onChange={event => setCommentText(event.target.value)}
            placeholder="Напишіть коментар..."
          />
          <button type="submit" disabled={!currentUserId}>Коментувати</button>
        </form>
      </section>
    </article>
  );
}
