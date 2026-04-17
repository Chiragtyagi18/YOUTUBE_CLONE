import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useVideos } from '../hooks/useVideos';
import { useComments } from '../hooks/useComments';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { CommentSection } from '../components/CommentSection';
import { VideoCard } from '../components/VideoCard';

export function WatchPage() {
  const { videoId } = useParams();
  const { fetchById: fetchVideo, videos: allVideos } = useVideos();
  const { comments, fetchByVideo, create: addComment } = useComments();
  const { toggleSubscription } = useSubscription();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const viewIncrementedRef = useRef(false);

  useEffect(() => {
    // Reset the ref when videoId changes
    viewIncrementedRef.current = false;
  }, [videoId]);

  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);
      // Only increment views once per video load
      const shouldIncrementViews = !viewIncrementedRef.current;
      const videoData = await fetchVideo(videoId, shouldIncrementViews);
      if (videoData) {
        setVideo(videoData);
        await fetchByVideo(videoId);
        viewIncrementedRef.current = true; // Mark that we've incremented views
      }
      setLoading(false);
    };
    loadVideo();
  }, [videoId]);

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      await toggleSubscription(video.owner._id);
      setSubscribed(!subscribed);
      // Refresh video data WITHOUT incrementing views
      const updatedVideo = await fetchVideo(videoId, false);
      if (updatedVideo) {
        setVideo(updatedVideo);
      }
    } catch (err) {
      console.error('Subscription toggle failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 px-4 pb-8 text-center text-gray-400">
        Loading video...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="pt-20 px-4 pb-8 text-center text-red-500">
        Video not found
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 pb-8 bg-gradient-dark min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Video Player */}
        <div className="relative w-full mb-8 bg-black rounded-xl overflow-hidden shadow-2xl">
          {video.videoFile ? (
            <video
              src={video.videoFile}
              controls
              className="w-full h-auto aspect-video"
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-secondary">
              <span className="text-gray-400">Video not available</span>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="mb-8 pb-8 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={video.owner?.avatar || 'https://via.placeholder.com/48'}
                alt={video.owner?.username}
                crossOrigin="anonymous"
                className="w-12 h-12 rounded-full object-cover border border-gray-700"
              />
              <div>
                <p className="font-semibold text-white hover:text-primary transition-colors">{video.owner?.username}</p>
                <p className="text-sm text-gray-400">
                  {video.owner?.subscribersCount || 0} subscribers
                </p>
              </div>
              <button
                onClick={handleSubscribe}
                className={`ml-4 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  subscribed
                    ? 'bg-secondary text-white hover:bg-gray-700 border border-gray-700'
                    : 'bg-gradient-primary text-white hover:shadow-glow'
                }`}
              >
                {subscribed ? '✓ Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="flex gap-6 text-gray-400 text-sm">
              <span className="flex items-center gap-1">👁️ {video.views || 0} views</span>
              <span className="flex items-center gap-1">📅 {new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-4 mt-4 border border-gray-700">
            <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        {/* Comments */}
        <CommentSection
          comments={comments}
          onAddComment={addComment}
          videoId={videoId}
          loading={false}
        />

        {/* Recommended Videos */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Recommended Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.slice(0, 6).map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
