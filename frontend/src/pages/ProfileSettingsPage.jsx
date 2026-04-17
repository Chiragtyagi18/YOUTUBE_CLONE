import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl, getCoverImageUrl } from '../utils/defaultImages';

export function ProfileSettingsPage() {
  const { user, updateAvatar, updateCoverImage, updateProfile, loading, error } = useAuth();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [coverPreview, setCoverPreview] = useState(user?.coverImage);
  const [successMessage, setSuccessMessage] = useState('');
  const [updateError, setUpdateError] = useState('');

  // Account details state
  const [accountDetails, setAccountDetails] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
  });
  const [accountLoading, setAccountLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccountDetailsChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setUpdateError('Please select an avatar image');
      return;
    }

    setUpdateError('');
    setSuccessMessage('');
    try {
      await updateAvatar(avatarFile);
      setSuccessMessage('Avatar updated successfully!');
      setAvatarFile(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update avatar');
    }
  };

  const handleUploadCover = async () => {
    if (!coverFile) {
      setUpdateError('Please select a cover image');
      return;
    }

    setUpdateError('');
    setSuccessMessage('');
    try {
      await updateCoverImage(coverFile);
      setSuccessMessage('Cover image updated successfully!');
      setCoverFile(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update cover image');
    }
  };

  const handleUpdateAccountDetails = async () => {
    if (!accountDetails.fullName.trim()) {
      setUpdateError('Full name is required');
      return;
    }

    setAccountLoading(true);
    setUpdateError('');
    setSuccessMessage('');

    try {
      const response = await updateProfile({
        fullName: accountDetails.fullName.trim(),
        username: accountDetails.username.trim(),
      });

      if (response?.data) {
        setAccountDetails({
          fullName: response.data.fullName || '',
          username: response.data.username || '',
        });
        setSuccessMessage('Account details updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update account details');
    } finally {
      setAccountLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-20 px-4 pb-8 text-center">
        <p className="text-gray-400">Please log in to access settings</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

        {(error || updateError) && (
          <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
            {error || updateError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900 text-green-100 p-4 rounded-lg mb-6">
            ✅ {successMessage}
          </div>
        )}

        {/* Account Details Section */}
        <div className="bg-darkGray rounded-lg p-8 border border-gray-600 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Account Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={accountDetails.username}
                onChange={handleAccountDetailsChange}
                placeholder="Enter username"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Your unique username for the channel</p>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={accountDetails.fullName}
                onChange={handleAccountDetailsChange}
                placeholder="Enter full name"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              onClick={handleUpdateAccountDetails}
              disabled={accountLoading}
              className="w-full px-6 py-2 bg-white text-dark rounded-lg hover:opacity-80 transition disabled:opacity-50 font-semibold mt-6"
            >
              {accountLoading ? 'Updating...' : 'Update Account Details'}
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="bg-darkGray rounded-lg p-8 border border-gray-600 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Avatar</h2>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Current Avatar */}
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-4">Current Avatar</p>
              <img
               src={avatarPreview || getAvatarUrl(user?.avatar)}
                alt="Current Avatar"
                crossOrigin="anonymous"
                className="w-32 h-32 rounded-full object-cover border-2 border-primary"
              />
            </div>

            {/* Avatar Upload */}
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-4">Upload New Avatar</p>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatarInput"
                />
                <label htmlFor="avatarInput" className="cursor-pointer">
                  <p className="text-gray-400">
                    {avatarFile ? avatarFile.name : 'Click to select image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG (max 5MB)</p>
                </label>
              </div>

              <button
                onClick={handleUploadAvatar}
                disabled={loading || !avatarFile}
                className="w-full px-6 py-2 bg-white text-dark rounded-lg hover:opacity-80 transition disabled:opacity-50 font-semibold"
              >
                {loading ? 'Uploading...' : 'Update Avatar'}
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image Section */}
        <div className="bg-darkGray rounded-lg p-8 border border-gray-600 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Cover Image</h2>

          <div className="flex flex-col gap-6">
            {/* Current Cover */}
            <div>
              <p className="text-gray-400 text-sm mb-4">Current Cover Image</p>
              <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-700">
                <img
                  src={coverPreview || getCoverImageUrl(user?.coverImage)}
                  alt="Current Cover"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Cover Upload */}
            <div>
              <p className="text-gray-400 text-sm mb-4">Upload New Cover Image</p>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                  id="coverInput"
                />
                <label htmlFor="coverInput" className="cursor-pointer">
                  <p className="text-gray-400">
                    {coverFile ? coverFile.name : 'Click to select image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG (16:9 aspect ratio recommended, max 10MB)
                  </p>
                </label>
              </div>

              <button
                onClick={handleUploadCover}
                disabled={loading || !coverFile}
                className="w-full px-6 py-2 bg-white text-dark rounded-lg hover:opacity-80 transition disabled:opacity-50 font-semibold"
              >
                {loading ? 'Uploading...' : 'Update Cover Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/channel/' + user.username)}
          className="mt-8 px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-dark transition font-semibold"
        >
          Back to Channel
        </button>
      </div>
    </div>
  );
}
