import { useState, useMemo, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useEnquiries } from './hooks/useEnquiries';
import { useTheme } from './hooks/useTheme';
import { AuthPage } from './components/auth/AuthPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PipelineView } from './components/enquiry/PipelineView';
import { ListView } from './components/enquiry/ListView';
import { FloatingDetail } from './components/enquiry/FloatingDetail';
import { NewEnquiryModal } from './components/enquiry/NewEnquiryModal';
import { Spinner } from './components/ui';
import { backfillEnquiryIds } from './utils/api';
import styles from './App.module.css';

function CRMApp() {
  const { user } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const { enquiries, loading, fetchAll, addEnquiry, logActivity, closeWon, closeLost } = useEnquiries();

  const [activeView, setActiveView] = useState('pipeline');
  const [selectedId, setSelectedId] = useState(null);
  const [clickRect, setClickRect] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(() => fetchAll(), [fetchAll]);
  useEffect(() => {
    if (user) {
      backfillEnquiryIds().then(() => load());
    }
  }, [user, load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return enquiries.filter((e) => {
      const matchSearch = !q || [e.name, e.company, e.email, e.phone, e.location, e.projectType]
        .some((v) => (v || '').toLowerCase().includes(q));
      const matchView =
        activeView === 'all' ||
        (activeView === 'pipeline' && e.stage !== 'closed_won' && e.stage !== 'closed_lost') ||
        (activeView === 'closed_won' && e.stage === 'closed_won') ||
        (activeView === 'closed_lost' && e.stage === 'closed_lost');
      return matchSearch && matchView;
    });
  }, [enquiries, activeView, search]);

  const selectedEnquiry = enquiries.find((e) => e._id === selectedId) || null;

  const counts = useMemo(() => ({
    pipeline: enquiries.filter((e) => e.stage !== 'closed_won' && e.stage !== 'closed_lost').length,
    all: enquiries.length,
    closed_won: enquiries.filter((e) => e.stage === 'closed_won').length,
    closed_lost: enquiries.filter((e) => e.stage === 'closed_lost').length,
  }), [enquiries]);

  async function handleAddEnquiry(data) {
    const enq = await addEnquiry(data);
    setSelectedId(enq._id);
    setActiveView('pipeline');
  }

  function handleViewChange(v) {
    setActiveView(v);
    setSelectedId(null);
    setClickRect(null);
  }

  // Card click — receives the card's bounding rect
  function handleSelect(id, rect) {
    if (selectedId === id) {
      setSelectedId(null);
      setClickRect(null);
    } else {
      setSelectedId(id);
      setClickRect(rect);
    }
  }

  function handleClose() {
    setSelectedId(null);
    setClickRect(null);
  }

  if (!user) return <AuthPage />;

  return (
    <div className={styles.app}>
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        counts={counts}
        onNewEnquiry={() => setShowNewModal(true)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.main}>
        <Header
          theme={theme}
          onThemeToggle={toggleTheme}
          activeView={activeView}
          onMenuToggle={() => setSidebarOpen(true)}
          search={search}
          onSearch={setSearch}
          onRefresh={load}
          loading={loading}
        />

        <div className={styles.content}>
          {loading && !enquiries.length ? (
            <div className={styles.loadingCenter}><Spinner size={28} /></div>
          ) : activeView === 'pipeline' ? (
            <PipelineView
              enquiries={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
              theme={theme}
            />
          ) : (
            <ListView
              enquiries={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
              theme={theme}
              emptyMessage={
                activeView === 'closed_won' ? 'No won deals yet.' :
                activeView === 'closed_lost' ? 'No lost deals.' : 'No enquiries found.'
              }
            />
          )}
        </div>
      </div>

      {/* Floating detail panel — appears near clicked card */}
      {selectedEnquiry && (
        <FloatingDetail
          enquiry={selectedEnquiry}
          theme={theme}
          onClose={handleClose}
          onLogActivity={logActivity}
          onCloseWon={closeWon}
          onCloseLost={closeLost}
          clickRect={clickRect}
        />
      )}

      {showNewModal && (
        <NewEnquiryModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleAddEnquiry}
        />
      )}
    </div>
  );
}

export default function App() {
  return <AuthProvider><CRMApp /></AuthProvider>;
}
