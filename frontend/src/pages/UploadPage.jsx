import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../hooks/useVideos';
import { useAuth } from '../hooks/useAuth';

export function UploadPage() {
  const { isAuthenticated } = useAuth();
  const { create: createVideo, loading, error } = useVideos();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: false,
  });
  const [files, setFiles] = useState({
    videoFile: null,
    thumbnail: null,
  });
  const [preview, setPreview] = useState({
    videoFile: '',
    thumbnail: '',
  });
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setUploadError('');
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    
    if (!file) return;

    setFiles((prev) => ({ ...prev, [name]: file }));

    if (name === 'thumbnail') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview((prev) => ({
          ...prev,
          thumbnail: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setUploadError('Title is required');
      return;
    }

    if (!files.videoFile) {
      setUploadError('Video file is required');
      return;
    }

    if (loading) {
      return; // Prevent duplicate submissions
    }

    try {
      setUploadProgress(30);
      const video = await createVideo(formData, files.videoFile, files.thumbnail);
      setUploadProgress(100);
      
      setTimeout(() => {
        navigate(`/watch/${video._id}`);
      }, 1000);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
      setUploadProgress(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 px-4 pb-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to upload</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to upload videos</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upload Video</h1>

        <form onSubmit={handleSubmit} className="bg-darkGray rounded-lg p-8 border border-gray-600 space-y-6">
          {(error || uploadError) && (
            <div className="bg-red-900 text-red-100 p-4 rounded-lg">
              {error || uploadError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description (optional)"
              rows="5"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video File *
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                name="videoFile"
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
                id="videoInput"
              />
              <label htmlFor="videoInput" className="cursor-pointer">
                <p className="text-gray-400">
                  {files.videoFile ? files.videoFile.name : 'Click to select video file'}
                </p>
                <p className="text-xs text-gray-500 mt-2">MP4, WebM, MKV (max 2GB)</p>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              {preview.thumbnail ? (
                <div>
                  <img
                    src={preview.thumbnail}
                    alt="Thumbnail preview"
                    className="max-h-40 mx-auto rounded"
                  />
                  <p className="text-sm text-gray-400 mt-2">{files.thumbnail?.name}</p>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="thumbnailInput"
                  />
                  <label htmlFor="thumbnailInput" className="cursor-pointer">
                    <p className="text-gray-400">Click to select thumbnail</p>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG (16:9 aspect ratio recommended)</p>
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-300 cursor-pointer flex-1">
              Publish immediately after upload
            </label>
            <span className={`text-xs px-2 py-1 rounded ${formData.isPublished ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
              {formData.isPublished ? 'Will be Published' : 'Will be Draft'}
            </span>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">{uploadProgress}% uploading...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploadProgress > 0}
            className="w-full bg-white text-dark font-semibold py-3 rounded-lg hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : uploadProgress === 100 ? 'Redirecting...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}
