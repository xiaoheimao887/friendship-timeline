import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { TimelinePage } from './components/timeline/TimelinePage';
import { FriendListPage } from './components/friend/FriendListPage';
import { FriendDetailPage } from './components/friend/FriendDetailPage';
import { AddFriendPage } from './pages/AddFriendPage';
import { MapPage } from './components/map/MapPage';
import { StatsPage } from './components/stats/StatsPage';
import { SetupPinPage } from './pages/SetupPinPage';
import { ToastProvider } from './components/ui/ToastProvider';
import { NotFound } from './pages/NotFound';
import { useFriendStore } from './store/useFriendStore';

function AppContent() {
  const { initialized, pinHash } = useFriendStore();
  const [showPin, setShowPin] = useState(!pinHash);

  // On mount, check if we have a stored pinHash
  useEffect(() => {
    const stored = localStorage.getItem('pinHash');
    if (stored) {
      useFriendStore.getState().setPinHash(stored);
      useFriendStore.getState().loadFriends(stored);
      setShowPin(false);
    } else {
      setShowPin(true);
    }
  }, []);

  const handlePinComplete = () => {
    setShowPin(false);
  };

  if (showPin) {
    return <SetupPinPage onComplete={() => {
      const hash = useFriendStore.getState().pinHash;
      if (hash) localStorage.setItem('pinHash', hash);
      setShowPin(false);
    }} />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/friends" element={<FriendListPage />} />
        <Route path="/friends/new" element={<AddFriendPage />} />
        <Route path="/friends/:id" element={<FriendDetailPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}
