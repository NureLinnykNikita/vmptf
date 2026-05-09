export function attachAuthor(post, users) {
  const author = users.find(user => user.id === post.userId);

  return {
    ...post,
    author: author || null
  };
}

export function attachComments(post, comments, users) {
  const postComments = comments
    .filter(comment => comment.postId === post.id)
    .map(comment => ({
      ...comment,
      author: users.find(user => user.id === comment.userId) || null
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    ...post,
    comments: postComments
  };
}

export function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function getFriendshipBetween(friendships, firstUserId, secondUserId) {
  return friendships.find(friendship => {
    const direct = friendship.requesterId === firstUserId && friendship.addresseeId === secondUserId;
    const reverse = friendship.requesterId === secondUserId && friendship.addresseeId === firstUserId;

    return direct || reverse;
  });
}

export function getAcceptedFriends(users, friendships, userId) {
  const friendIds = friendships
    .filter(friendship => {
      return friendship.status === 'accepted' &&
        (friendship.requesterId === userId || friendship.addresseeId === userId);
    })
    .map(friendship => friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId);

  return users.filter(user => friendIds.includes(user.id));
}
