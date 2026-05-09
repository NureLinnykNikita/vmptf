import { useState } from 'react';
import PostCard from '../components/PostCard.jsx';

export default function PostsPage({ posts, currentUserId, onCreatePost, onAddComment }) {
  const [content, setContent] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    onCreatePost(content.trim());
    setContent('');
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Пости</h2>
        <p>Створення постів і коментування публікацій інших користувачів.</p>
      </div>

      <form className="card create-post-form" onSubmit={handleSubmit}>
        <label htmlFor="postContent">Новий пост</label>
        <textarea
          id="postContent"
          value={content}
          onChange={event => setContent(event.target.value)}
          placeholder="Про що хочете написати?"
          rows="4"
        />
        <button type="submit" disabled={!currentUserId || !content.trim()}>
          Опублікувати
        </button>
      </form>

      <div className="posts-list">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onAddComment={onAddComment}
          />
        ))}
      </div>
    </section>
  );
}
