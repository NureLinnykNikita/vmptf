const API_BASE_URL = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  getUsers: () => request('/users'),
  getUser: id => request(`/users/${id}`),
  getPosts: () => request('/posts'),
  createPost: payload => request('/posts', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  createComment: (postId, payload) => request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getFriends: userId => request(`/users/${userId}/friends`),
  getFriendRequests: userId => request(`/users/${userId}/friend-requests`),
  sendFriendRequest: payload => request('/friends/request', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  acceptFriendRequest: payload => request('/friends/accept', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getConversation: (userId, friendId) => request(`/messages/${userId}/${friendId}`),
  sendMessage: payload => request('/messages', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  search: query => request(`/search?q=${encodeURIComponent(query)}`)
};
