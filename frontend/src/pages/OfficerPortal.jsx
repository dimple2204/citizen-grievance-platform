import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, ListTodo, Megaphone, Activity, CheckCircle, ChevronDown, XCircle } from 'lucide-react';
import QueueManagementTab from '../components/officer/QueueManagementTab';
import CommunityBroadcastTab from '../components/officer/CommunityBroadcastTab';
import { getDepartmentComplaints, getMyDepartments } from '../services/api.jsx';
import { useAuth } from '../context/AuthContext';
import { usePortal } from '../context/PortalContext';
import TabBar from '../components/shared/TabBar';

const OfficerPortal = () => {
    const { userName } = useAuth();
    const { setPortal } = usePortal();
    const [activeTab, setActiveTab] = useState('queue');
    const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, rejected: 0 });

    // Dynamic Department States
    const [myDepartments, setMyDepartment] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const officerName = userName || "Officer";

    // 1. Fetch the departments this specific officer is assigned to
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getMyDepartments();
                const depts = response.data;
                setMyDepartment(depts);

                // If they have departments, select the first one by default
                if (depts.length > 0) {
                    setSelectedDeptId(depts[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch officer depts", error);
            } finally {
                setLoadingAuth(false);
            }
        };
        fetchInitialData();
    }, []);

    // 2. Fetch stats whenever the selected department changes
    useEffect(() => {
        if(!selectedDeptId) return;

        const fetchStats = async () => {
            try {
                const response = await getDepartmentComplaints(selectedDeptId);
                const complaints = response.data;
                setStats({
                    total: complaints.length,
                    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
                    pending: complaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length,
                    rejected: complaints.filter(c => c.status === 'REJECTED').length
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, [selectedDeptId]);

    // 3. Inject portal content into the Navbar
    const portalContent = useMemo(() => (
        <>
            {/* Department Switcher */}
            {myDepartments.length > 1 && (
                <div className="relative inline-flex items-center">
                    <select
                        value={selectedDeptId}
                        onChange={(e) => setSelectedDeptId(Number(e.target.value))}
                        className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm font-medium px-3 py-1.5 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                        {myDepartments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
            )}

            {/* Department badge (single dept) */}
            {myDepartments.length === 1 && (
                <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                    {myDepartments[0].name}
                </span>
            )}

            {/* Compact stat badges */}
            <div className="flex items-center gap-1.5">
                <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-white font-bold text-xs">{stats.pending}</span>
                    <span className="text-slate-400 text-[10px]">pending</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white font-bold text-xs">{stats.resolved}</span>
                    <span className="text-slate-400 text-[10px]">resolved</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-white font-bold text-xs">{stats.rejected}</span>
                    <span className="text-slate-400 text-[10px]">rejected</span>
                </div>
            </div>
        </>
    ), [myDepartments, selectedDeptId, stats]);

    useEffect(() => {
        if (!loadingAuth && myDepartments.length > 0) {
            setPortal({
                title: 'Department Command',
                content: portalContent,
            });
        }
        return () => setPortal(null);
    }, [portalContent, loadingAuth, myDepartments.length]);

    const tabs = [
        { id: 'queue', label: 'Queue Management', icon: ListTodo },
        { id: 'broadcast', label: 'Community Broadcast', icon: Megaphone },
    ];

    if (loadingAuth) {
        return <div className="text-center py-20 text-slate-500">Authenticating Officer Credentials...</div>;
    }

    // Security Block: If they were created but not assigned to any department
    if (myDepartments.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 text-center max-w-md">
                    <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Unassigned Account</h2>
                    <p className="text-slate-600">Your officer account has been created, but you have not been assigned to a department yet. Please contact the System Administrator.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-screen bg-slate-50">

            {/* ── TAB BAR (sticks below navbar) ───────────────── */}
            <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* ── MAIN CONTENT ───────────────────────────────── */}
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                    {/* ── Page Context ─────────────────────── */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Welcome back, {officerName}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Managing grievances for <span className="font-semibold text-slate-700">{myDepartments.find(d => d.id === selectedDeptId)?.name || 'your department'}</span>
                        </p>
                    </div>

                    {activeTab === 'queue' && <QueueManagementTab departmentId={selectedDeptId} />}
                    {activeTab === 'broadcast' && <CommunityBroadcastTab />}
                </div>
            </div>
        </div>
    );
};

export default OfficerPortal;
