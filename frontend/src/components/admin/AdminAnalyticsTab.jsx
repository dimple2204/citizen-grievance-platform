import { useEffect, useMemo, useState } from 'react';
import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle,
    Clock,
    FileText,
    Megaphone,
    Radio,
    TrendingUp,
    Vote,
    XCircle
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { getAdminAnalytics } from '../../services/api.jsx';

const numberFormatter = new Intl.NumberFormat('en-IN');

const emptyAnalytics = {
    kpis: {
        totalComplaints: 0,
        openComplaints: 0,
        inProgressComplaints: 0,
        resolvedComplaints: 0,
        rejectedComplaints: 0,
        resolutionRate: 0,
        dueTodayComplaints: 0,
        overdueComplaints: 0,
        slaBreachedComplaints: 0,
        slaComplianceRate: 0,
        averageResolutionHours: 0,
        averageSatisfactionScore: 0,
        totalRatings: 0
    },
    departments: [],
    submittedTrend: [],
    resolvedTrend: [],
    categoryDistribution: [],
    community: {
        totalPosts: 0,
        totalBroadcasts: 0,
        totalEvents: 0,
        totalPolls: 0
    }
};

const formatNumber = (value) => numberFormatter.format(value || 0);

const formatDateLabel = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
    });
};

const MetricCard = ({ title, value, icon: Icon, tone, suffix = '' }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-t-4 ${tone}`}>
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900">
                    {value}{suffix}
                </h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
                <Icon className="w-6 h-6 text-slate-700" />
            </div>
        </div>
    </div>
);

const CommunityCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(value)}</p>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-5">{title}</h3>
        {children}
    </section>
);

const AdminAnalyticsTab = () => {
    const [analytics, setAnalytics] = useState(emptyAnalytics);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getAdminAnalytics();
                setAnalytics(response.data || emptyAnalytics);
            } catch (apiError) {
                console.error('Failed to fetch admin analytics', apiError);
                setError('Unable to load analytics right now. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const departments = analytics.departments || [];
    const submittedTrend = analytics.submittedTrend || [];
    const resolvedTrend = analytics.resolvedTrend || [];
    const kpis = analytics.kpis || emptyAnalytics.kpis;
    const community = analytics.community || emptyAnalytics.community;
    const categoryDistribution = analytics.categoryDistribution || [];

    const hasAnalyticsData = useMemo(() => (
        departments.length > 0 ||
        submittedTrend.length > 0 ||
        resolvedTrend.length > 0 ||
        (kpis.totalComplaints || 0) > 0 ||
        (community.totalPosts || 0) > 0 ||
        categoryDistribution.length > 0
    ), [departments.length, submittedTrend.length, resolvedTrend.length, kpis.totalComplaints, community.totalPosts, categoryDistribution.length]);

    const departmentTotals = departments.map((department) => ({
        name: department.departmentName || 'Unknown',
        total: department.totalComplaints || 0
    }));

    const departmentPerformance = departments.map((department) => ({
        name: department.departmentName || 'Unknown',
        resolved: department.resolvedComplaints || 0,
        pending: department.pendingComplaints || 0,
        rejected: department.rejectedComplaints || 0
    }));

    const submittedTrendData = submittedTrend.map((point) => ({
        date: formatDateLabel(point.date),
        count: point.count || 0
    }));

    const resolvedTrendData = resolvedTrend.map((point) => ({
        date: formatDateLabel(point.date),
        count: point.count || 0
    }));

    const categoryDistributionData = categoryDistribution.map((item) => ({
        category: (item.category || 'OTHER').replaceAll('_', ' '),
        count: item.count || 0
    }));

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500 font-medium">
                Loading analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                    <h3 className="font-bold text-slate-900">Analytics unavailable</h3>
                    <p className="text-sm text-slate-600 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!hasAnalyticsData) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center text-slate-500 font-medium">
                No analytics data available.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5">
                <MetricCard title="Total Complaints" value={formatNumber(kpis.totalComplaints)} icon={FileText} tone="border-t-blue-600" />
                <MetricCard title="Open" value={formatNumber(kpis.openComplaints)} icon={AlertCircle} tone="border-t-amber-500" />
                <MetricCard title="In Progress" value={formatNumber(kpis.inProgressComplaints)} icon={Activity} tone="border-t-indigo-500" />
                <MetricCard title="Resolved" value={formatNumber(kpis.resolvedComplaints)} icon={CheckCircle} tone="border-t-emerald-500" />
                <MetricCard title="Rejected" value={formatNumber(kpis.rejectedComplaints)} icon={XCircle} tone="border-t-red-500" />
                <MetricCard title="Resolution Rate" value={Number(kpis.resolutionRate || 0).toFixed(2)} suffix="%" icon={TrendingUp} tone="border-t-cyan-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
                <MetricCard title="Due Today" value={formatNumber(kpis.dueTodayComplaints)} icon={Activity} tone="border-t-amber-500" />
                <MetricCard title="SLA Breached" value={formatNumber(kpis.slaBreachedComplaints)} icon={AlertCircle} tone="border-t-red-500" />
                <MetricCard title="SLA Compliance" value={Number(kpis.slaComplianceRate || 0).toFixed(2)} suffix="%" icon={CheckCircle} tone="border-t-emerald-500" />
                <MetricCard title="Avg Resolution" value={Number(kpis.averageResolutionHours || 0).toFixed(1)} suffix="h" icon={Clock} tone="border-t-indigo-500" />
                <MetricCard title="Avg Satisfaction" value={Number(kpis.averageSatisfactionScore || 0).toFixed(2)} suffix="/5" icon={TrendingUp} tone="border-t-blue-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Complaints by Department">
                    {departmentTotals.length === 0 ? (
                        <p className="text-sm text-slate-500 py-16 text-center">No analytics data available.</p>
                    ) : (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentTotals} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="total" name="Total Complaints" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>

                <ChartCard title="Department Resolution Performance">
                    {departmentPerformance.length === 0 ? (
                        <p className="text-sm text-slate-500 py-16 text-center">No analytics data available.</p>
                    ) : (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentPerformance} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend />
                                    <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>
            </div>

            <ChartCard title="Category Distribution">
                {categoryDistributionData.length === 0 ? (
                    <p className="text-sm text-slate-500 py-16 text-center">No category data available.</p>
                ) : (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryDistributionData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="count" name="Complaints" fill="#0f766e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </ChartCard>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Complaint Submission Trend">
                    {submittedTrendData.length === 0 ? (
                        <p className="text-sm text-slate-500 py-16 text-center">No analytics data available.</p>
                    ) : (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={submittedTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Line type="monotone" dataKey="count" name="Submitted" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>

                <ChartCard title="Complaint Resolution Trend">
                    {resolvedTrendData.length === 0 ? (
                        <p className="text-sm text-slate-500 py-16 text-center">No analytics data available.</p>
                    ) : (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={resolvedTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Line type="monotone" dataKey="count" name="Resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Community Engagement</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <CommunityCard title="Total Posts" value={community.totalPosts} icon={Radio} />
                    <CommunityCard title="Broadcasts" value={community.totalBroadcasts} icon={Megaphone} />
                    <CommunityCard title="Events" value={community.totalEvents} icon={TrendingUp} />
                    <CommunityCard title="Polls" value={community.totalPolls} icon={Vote} />
                </div>
            </section>
        </div>
    );
};

export default AdminAnalyticsTab;
