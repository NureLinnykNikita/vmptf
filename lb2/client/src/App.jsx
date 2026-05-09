import { useEffect, useMemo, useState } from 'react';
import { api } from './api/api.js';
import Header from './components/Header.jsx';
import UsersPage from './pages/UsersPage.jsx';
import PostsPage from './pages/PostsPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import SearchPage from './pages/SearchPage.jsx';

export default function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
  const [friendships, setFriendships] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [messagePartnerId, setMessagePartnerId] = useState(null);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const currentUser = useMemo(() => {
    return users.find(user => user.id === currentUserId) || null;
  }, [users, currentUserId]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadSocialData(currentUserId);
    }
  }, [currentUserId]);

  async function loadInitialData() {
    try {
      const [loadedUsers, loadedPosts] = await Promise.all([
        api.getUsers(),
        api.getPosts()
      ]);

      setUsers(loadedUsers);
      setPosts(loadedPosts);
      setCurrentUserId(loadedUsers[0]?.id || null);
    } catch (error) {
      showError(error.message);
    }
  }

  async function loadSocialData(userId) {
    try {
      const [loadedFriends, loadedRequests] = await Promise.all([
        api.getFriends(userId),
        api.getFriendRequests(userId)
      ]);

      setFriends(loadedFriends);
      setFriendRequests(loadedRequests);

      const allFriendships = [
        ...loadedRequests.incoming,
        ...loadedRequests.outgoing,
        ...loadedFriends.map(friend => ({
          id: `accepted-${friend.id}`,
          requesterId: userId,
          addresseeId: friend.id,
          status: 'accepted'
        }))
      ];

      setFriendships(allFriendships);
    } catch (error) {
      showError(error.message);
    }
  }

  async function refreshPosts() {
    const loadedPosts = await api.getPosts();
    setPosts(loadedPosts);
  }

  async function handleCreatePost(content) {
    try {
      const created = await api.createPost({ userId: currentUserId, content });
      setPosts(previous => [created, ...previous]);
      showNotification('Пост успішно створено.');
    } catch (error) {
      showError(error.message);
    }
  }

  async function handleAddComment(postId, text) {
    try {
      await api.createComment(postId, { userId: currentUserId, text });
      await refreshPosts();
      showNotification('Коментар додано.');
    } catch (error) {
      showError(error.message);
    }
  }

  async function handleSendFriendRequest(addresseeId) {
    try {
      await api.sendFriendRequest({ requesterId: currentUserId, addresseeId });
      await loadSocialData(currentUserId);
      showNotification('Заявку в друзі надіслано.');
    } catch (error) {
      showError(error.message);
    }
  }

  async function handleAcceptFriendRequest(friendshipId) {
    try {
      await api.acceptFriendRequest({ friendshipId, userId: currentUserId });
      await loadSocialData(currentUserId);
      showNotification('Заявку прийнято.');
    } catch (error) {
      showError(error.message);
    }
  }

  function handleOpenMessages(userId) {
    setMessagePartnerId(userId);
    setActiveTab('messages');
  }

  function showNotification(message) {
    setNotification(message);
    setError('');
    setTimeout(() => setNotification(''), 3500);
  }

  function showError(message) {
    setError(message);
    setNotification('');
    setTimeout(() => setError(''), 5000);
  }

  function renderPage() {
    if (activeTab === 'users') {
      return (
        <UsersPage
          users={users}
          currentUserId={currentUserId}
          friendships={friendships}
          onSendFriendRequest={handleSendFriendRequest}
          onOpenMessages={handleOpenMessages}
        />
      );
    }

    if (activeTab === 'posts') {
      return (
        <PostsPage
          posts={posts}
          currentUserId={currentUserId}
          onCreatePost={handleCreatePost}
          onAddComment={handleAddComment}
        />
      );
    }

    if (activeTab === 'friends') {
      return (
        <FriendsPage
          currentUser={currentUser}
          friends={friends}
          friendRequests={friendRequests}
          onAcceptFriendRequest={handleAcceptFriendRequest}
        />
      );
    }

    if (activeTab === 'messages') {
      return (
        <MessagesPage
          users={users}
          currentUserId={currentUserId}
          initialPartnerId={messagePartnerId}
        />
      );
    }

    return (
      <SearchPage
        currentUserId={currentUserId}
        onAddComment={handleAddComment}
        onOpenMessages={handleOpenMessages}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        users={users}
        currentUserId={currentUserId}
        onChangeCurrentUser={setCurrentUserId}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {notification && <div className="toast success-toast">{notification}</div>}
      {error && <div className="toast error-toast">{error}</div>}

      <main>
        {renderPage()}
      </main>
    </div>
  );
}
