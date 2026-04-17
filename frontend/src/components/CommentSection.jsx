import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export function CommentSection({ comments, onAddComment, videoId, loading }) {
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(newComment, videoId);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        💬 {comments?.length || 0} {comments?.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex gap-4 items-start">
            <img
              src={user?.avatar || 'https://via.placeholder.com/32'}
              alt="Your avatar"
              crossOrigin="anonymous"
              className="w-10 h-10 rounded-full object-cover mt-1 border border-gray-700"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a thoughtful comment..."
                className="w-full bg-secondary text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 resize-none transition-all duration-200"
                rows="3"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setNewComment('')}
                  className="px-6 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {submitting ? '⏳ Posting...' : '✓ Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-secondary border border-gray-700 p-6 rounded-xl mb-8 text-center text-gray-400">
          🔒 Sign in to comment
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-8">⏳ Loading comments...</div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-secondary rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200">
              <div className="flex gap-4">
                <img
                  src={comment.owner?.avatar || 'https://via.placeholder.com/32'}
                  alt={comment.owner?.username}
                  crossOrigin="anonymous"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white hover:text-primary transition-colors">
                      {comment.owner?.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2 break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">📝 No comments yet. Be the first to comment!</div>
      )}
    </div>
  );
}
