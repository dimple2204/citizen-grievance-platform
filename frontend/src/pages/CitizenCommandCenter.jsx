import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, TrendingUp, CheckCircle2, 
  FileText, ClipboardList, Building2, MapPin, XCircle
} from 'lucide-react';
import { getCitizenComplaints } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePortal } from '../context/PortalContext';
import TabBar from '../components/shared/TabBar';

// Tab Content Components
import MyGrievancesTab from '../components/citizen/tabs/MyGrievancesTab';
import LodgeGrievanceTab from '../components/citizen/tabs/LodgeGrievanceTab';
import CivicServicesTab from '../components/citizen/tabs/CivicServicesTab';
import MyWardTab from '../components/citizen/tabs/MyWardTab';
import LokMitraChat from '../components/citizen/LokMitraChat';
import GlobalFooter from '../components/citizen/GlobalFooter';

// ==================== MOCK DATA ====================
const mockUserData = {
  name: 'Rajesh Kumar',
  civicTrustScore: 87,
  totalFiled: 12,
  resolved: 9
};

const mockCommunityAlerts = [
  {
    id: 1,
    message: 'Water supply disruption in Sectors 4-7 on April 6th, 8 AM - 2 PM due to pipeline maintenance.',
    type: 'warning',
    timestamp: '2 hours ago'
  }
];

// ==================== MAIN COMPONENT ====================
const CitizenCommandCenter = () => {
  const navigate = useNavigate();
  const { userId: citizenId, userName } = useAuth();
  const { setPortal } = usePortal();
  const [activeTab, setActiveTab] = useState('my-grievances');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const citizenName = userName || mockUserData.name;

  const fetchComplaints = useCallback(async () => {
    if (!citizenId) {
      setLoading(false);
      setComplaints([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await getCitizenComplaints(citizenId);
      const latestComplaints = response.data || [];
      setComplaints(latestComplaints);

      if (latestComplaints.length > 0) {
        setSelectedComplaint((currentSelection) => {
          if (!currentSelection) {
            return latestComplaints[0];
          }
          return latestComplaints.find((complaint) => complaint.id === currentSelection.id) || latestComplaints[0];
        });
      } else {
        setSelectedComplaint(null);
      }
    } catch (error) {
      console.error("Failed to fetch complaints", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [citizenId]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchComplaints();
      }
    };

    window.addEventListener('focus', fetchComplaints);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      window.removeEventListener('focus', fetchComplaints);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [fetchComplaints]);

  const stats = {
    civicTrustScore: 87,
    totalFiled: complaints.length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    rejected: complaints.filter(c => c.status === 'REJECTED').length
  };

  // ─── Inject portal content into Navbar ──────────────────
  const portalContent = useMemo(() => (
    <div className="flex items-center gap-1.5">
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-white font-bold text-xs">{stats.civicTrustScore}</span>
        <span className="text-slate-400 text-[10px]">trust</span>
      </div>
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-white font-bold text-xs">{stats.totalFiled}</span>
        <span className="text-slate-400 text-[10px]">filed</span>
      </div>
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-white font-bold text-xs">{stats.resolved}</span>
        <span className="text-slate-400 text-[10px]">resolved</span>
      </div>
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5 text-red-400" />
        <span className="text-white font-bold text-xs">{stats.rejected}</span>
        <span className="text-slate-400 text-[10px]">rejected</span>
      </div>
    </div>
  ), [stats.civicTrustScore, stats.totalFiled, stats.resolved, stats.rejected]);

  useEffect(() => {
    if (!loading) {
      setPortal({
        title: 'Command Center',
        content: portalContent,
      });
    }
    return () => setPortal(null);
  }, [portalContent, loading]);

  const tabs = [
    { id: 'my-grievances', label: 'My Grievances', icon: ClipboardList },
    { id: 'lodge-grievance', label: 'Lodge Grievance', icon: FileText },
    { id: 'civic-services', label: 'Civic Services', icon: Building2 },
    { id: 'my-ward', label: 'My Ward', icon: MapPin }
  ];

  const handleComplaintSubmitted = () => {
    fetchComplaints();
    setActiveTab('my-grievances');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* ==================== GLOBAL ALERT TICKER ==================== */}
      {mockCommunityAlerts.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-amber-100 p-1.5 rounded-full">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-sm text-amber-800 font-medium">
                <span className="font-bold">City Alert:</span> {mockCommunityAlerts[0].message}
              </p>
              <span className="hidden sm:block text-xs text-amber-600 ml-auto flex-shrink-0">
                {mockCommunityAlerts[0].timestamp}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB BAR ==================== */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className="flex-1 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Page Context ─────────────────────── */}
          <div className="pt-8 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Welcome back, {citizenName}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              You have filed <span className="font-semibold text-slate-700">{stats.totalFiled} grievance{stats.totalFiled !== 1 ? 's' : ''}</span> — <span className="font-semibold text-emerald-600">{stats.resolved} resolved</span>, <span className="font-semibold text-red-600">{stats.rejected} rejected</span>
            </p>
          </div>

          {activeTab === 'my-grievances' && (
            <MyGrievancesTab 
              complaints={complaints} 
              loading={loading}
              selectedComplaint={selectedComplaint}
              onSelectComplaint={setSelectedComplaint}
              onNavigateToLodge={() => setActiveTab('lodge-grievance')}
            />
          )}
          {activeTab === 'lodge-grievance' && (
            <LodgeGrievanceTab onComplaintSubmitted={handleComplaintSubmitted} />
          )}
          {activeTab === 'civic-services' && (
            <CivicServicesTab />
          )}
          {activeTab === 'my-ward' && (
            <MyWardTab />
          )}
        </div>
      </main>

      {/* ==================== GLOBAL FOOTER ==================== */}
      <GlobalFooter />

      {/* ==================== FLOATING LOKMITRA AI BUTTON ==================== */}
      <LokMitraChat />
    </div>
  );
};

export default CitizenCommandCenter;
