import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WatchPage } from './pages/WatchPage';
import { UploadPage } from './pages/UploadPage';
import { ChannelPage } from './pages/ChannelPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-dark">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/watch/:videoId" element={<WatchPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/channel/:username" element={<ChannelPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/profile-settings" element={<ProfileSettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
