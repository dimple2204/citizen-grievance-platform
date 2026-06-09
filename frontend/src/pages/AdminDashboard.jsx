import { useEffect, useState, useMemo } from "react";
import { createDepartment, getAllDepartments, registerOfficer } from "../services/api.jsx";
import { AlertCircle, BarChart3, Building2, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { usePortal } from '../context/PortalContext';
import TabBar from '../components/shared/TabBar';
import AdminAnalyticsTab from '../components/admin/AdminAnalyticsTab';

const AdminDashboard = () => {
    const { setPortal } = usePortal();
    // Tab State
    const [activeTab, setActiveTab] = useState('analytics'); // Default to your awesome charts!

    // Data States
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userName } = useAuth();
    const adminName = userName || "Super Admin";

    // Form States
    const [deptStatus, setDeptStatus] = useState('idle');
    const [deptForm, setDeptForm] = useState({ name: '', description: '', headOfficer: '' });
    const [officerStatus, setOfficerStatus] = useState('idle');
    const [officerForm, setOfficerForm] = useState({ fullName: '', email: '', password: '', departmentIds: [] });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const deptsRes = await getAllDepartments();
            setDepartments(deptsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Inject portal content into Navbar ---
    const portalContent = useMemo(() => (
        <div className="flex items-center gap-1.5">
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-bold text-xs">{departments.length}</span>
                <span className="text-slate-400 text-[10px]">departments</span>
            </div>
        </div>
    ), [departments.length]);

    useEffect(() => {
        if (!loading) {
            setPortal({
                title: 'System Administration',
                content: portalContent,
            });
        }
        return () => setPortal(null);
    }, [portalContent, loading]);

    // --- Form Handlers (From our new secure backend logic) ---
    const handleDeptChange = (e) => setDeptForm({ ...deptForm, [e.target.name]: e.target.value });

    const handleDeptSubmit = async (e) => {
        e.preventDefault();
        setDeptStatus('submitting');
        try {
            await createDepartment(deptForm);
            setDeptStatus('success');
            // Refresh the departments list!
            const newDepts = await getAllDepartments();
            setDepartments(newDepts.data);
            setTimeout(() => {
                setDeptStatus('idle');
                setDeptForm({ name: '', description: '', headOfficer: '' });
            }, 3000);
        } catch (error) {
            setDeptStatus('error');
            setTimeout(() => setDeptStatus('idle'), 3000);
        }
    };

    const handleOfficerChange = (e) => setOfficerForm({ ...officerForm, [e.target.name]: e.target.value });

    const handleCheckboxChange = (deptId) => {
        setOfficerForm(prev => ({
            ...prev,
            departmentIds: prev.departmentIds.includes(deptId)
                ? prev.departmentIds.filter(id => id !== deptId)
                : [...prev.departmentIds, deptId]
        }));
    };

    const handleOfficerSubmit = async (e) => {
        e.preventDefault();
        if (officerForm.departmentIds.length === 0) {
            alert("Please assign the officer to at least one department.");
            return;
        }
        setOfficerStatus('submitting');
        try {
            await registerOfficer(officerForm);
            setOfficerStatus('success');
            setTimeout(() => {
                setOfficerStatus('idle');
                setOfficerForm({ fullName: '', email: '', password: '', departmentIds: [] });
            }, 3000);
        } catch (error) {
            setOfficerStatus('error');
            setTimeout(() => setOfficerStatus('idle'), 3000);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500 font-medium text-lg">Loading Executive Command Center...</div>;

    const tabs = [
        { id: 'analytics', label: 'Global Analytics', icon: BarChart3 },
        { id: 'departments', label: 'Manage Departments', icon: Building2 },
        { id: 'officers', label: 'Onboard Officers', icon: UserPlus },
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-slate-50">

            {/* ── TAB BAR (sticks below navbar) ───────────────── */}
            <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* MAIN WORKSPACE */}
            <div className="w-full flex-grow flex flex-col">

                {/* DYNAMIC CONTENT AREA */}
                <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                    {/* ── Page Context ─────────────────────── */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Welcome back, {adminName}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Managing <span className="font-semibold text-slate-700">{departments.length} department{departments.length !== 1 ? 's' : ''}</span> across the platform
                        </p>
                    </div>

                    {activeTab === 'analytics' && <AdminAnalyticsTab />}

                    {/* === TAB 2: DEPARTMENTS (50/50 Split) === */}
                    {activeTab === 'departments' && (
                        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
                            {/* Left: Create Form */}
                            <div className="lg:w-1/2 bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-fit">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Register New Department</h2>
                                <form onSubmit={handleDeptSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Department Name</label>
                                        <input type="text" name="name" required value={deptForm.name} onChange={handleDeptChange} placeholder="e.g., Water Works" className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                        <textarea name="description" required rows="3" value={deptForm.description} onChange={handleDeptChange} placeholder="Responsibilities..." className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 resize-none"></textarea>
                                    </div>
                                    <button type="submit" disabled={deptStatus === 'submitting'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                                        {deptStatus === 'submitting' ? 'Creating...' : 'Create Department'}
                                    </button>
                                    {deptStatus === 'success' && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Created successfully</div>}
                                </form>
                            </div>

                            {/* Right: Existing Departments List */}
                            <div className="lg:w-1/2">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Active Departments</h2>
                                <div className="space-y-3">
                                    {departments.length === 0 ? <p className="text-slate-500">No departments found.</p> : departments.map(dept => (
                                        <div key={dept.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-blue-600 transition-colors">
                                            <div className="bg-blue-50 p-3 rounded-lg"><Building2 className="w-5 h-5 text-blue-600"/></div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{dept.name}</h3>
                                                <p className="text-sm text-slate-500 mt-1">{dept.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === TAB 3: OFFICERS === */}
                    {activeTab === 'officers' && (
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <UserPlus className="w-6 h-6 text-blue-600" />
                                Provision Internal Officer
                            </h2>
                            <form onSubmit={handleOfficerSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input type="text" name="fullName" required value={officerForm.fullName} onChange={handleOfficerChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Official Email</label>
                                        <input type="email" name="email" required value={officerForm.email} onChange={handleOfficerChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Secure Password</label>
                                    <input type="password" name="password" required value={officerForm.password} onChange={handleOfficerChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600" />
                                </div>

                                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">Assign to Departments</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {departments.map(dept => (
                                            <label key={dept.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={officerForm.departmentIds.includes(dept.id)}
                                                    onChange={() => handleCheckboxChange(dept.id)}
                                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                                                />
                                                <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" disabled={officerStatus === 'submitting'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-colors shadow-md">
                                    {officerStatus === 'submitting' ? 'Registering...' : 'Provision Officer Account'}
                                </button>

                                {officerStatus === 'success' && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Officer provisioned successfully!</div>}
                                {officerStatus === 'error' && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Failed to register officer. Email may exist.</div>}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
