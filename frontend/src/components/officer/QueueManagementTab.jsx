import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { addComplaintRemark, getDepartmentComplaints, updateComplaintStatus } from '../../services/api.jsx';
import ComplaintDetailDrawer from './ComplaintDetailDrawer';

const QueueManagementTab = ({ departmentId }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [savingRemark, setSavingRemark] = useState(false);
    const [remarkMessage, setRemarkMessage] = useState(null);

    useEffect(() => {
        fetchDepartmentComplaints();
    }, [departmentId]);

    const fetchDepartmentComplaints = async () => {
        try {
            const response = await getDepartmentComplaints(departmentId);
            setComplaints(response.data);
            if (selectedComplaint) {
                const freshSelection = response.data.find((complaint) => complaint.id === selectedComplaint.id);
                setSelectedComplaint(freshSelection || null);
            }
        } catch (error) {
            console.error("Failed to fetch department complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (complaintId, newStatus) => {
        try {
            // Optimistically update the UI
            setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
            const response = await updateComplaintStatus(complaintId, newStatus);
            setComplaints((current) => current.map(c => c.id === complaintId ? response.data : c));
            if (selectedComplaint?.id === complaintId) {
                setSelectedComplaint(response.data);
            }
        } catch (error) {
            console.error("Failed to update status", error);
            fetchDepartmentComplaints(); // Revert on failure
        }
    };

    const handleAddRemark = async (complaintId, remark) => {
        try {
            setSavingRemark(true);
            setRemarkMessage(null);
            const response = await addComplaintRemark(complaintId, remark);
            setComplaints((current) => current.map(c => c.id === complaintId ? response.data : c));
            setSelectedComplaint(response.data);
            setRemarkMessage({ type: 'success', text: 'Remark saved successfully.' });
            return { success: true };
        } catch (error) {
            console.error("Failed to add remark", error);
            const errorText = error.response?.data || 'Failed to save remark. Please try again.';
            setRemarkMessage({ type: 'error', text: errorText });
            return { success: false, message: errorText };
        } finally {
            setSavingRemark(false);
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'RESOLVED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500';
            case 'IN_PROGRESS':
                return 'bg-blue-50 text-[#000080] border-blue-200 focus:ring-[#000080]';
            case 'REJECTED':
                return 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500';
        }
    };

    const filteredComplaints = complaints.filter((complaint) => {
        const matchesStatus = filter === 'ALL' || complaint.status === filter;
        const matchesCategory = categoryFilter === 'ALL' || complaint.category === categoryFilter;
        const matchesPriority = priorityFilter === 'ALL' || complaint.priority === priorityFilter;
        const query = searchTerm.trim().toLowerCase();

        if (!query) return matchesStatus && matchesCategory && matchesPriority;

        const searchableText = [
            complaint.id?.toString(),
            complaint.title,
            complaint.description,
            complaint.citizenName
        ].join(' ').toLowerCase();

        return matchesStatus && matchesCategory && matchesPriority && searchableText.includes(query);
    });

    const activeComplaints = complaints.filter((complaint) => complaint.status === 'OPEN' || complaint.status === 'IN_PROGRESS');
    const today = new Date().toDateString();
    const dueToday = activeComplaints.filter((complaint) => complaint.slaDueAt && new Date(complaint.slaDueAt).toDateString() === today).length;
    const overdue = activeComplaints.filter((complaint) => complaint.slaDueAt && new Date(complaint.slaDueAt) < new Date()).length;
    const breached = complaints.filter((complaint) => complaint.slaBreached).length;

    const formatEnum = (value) => value ? value.replaceAll('_', ' ') : 'Not set';

    if (loading) return <div className="text-center py-10 text-slate-500">Loading department queue...</div>;

    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-white border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Due Today</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{dueToday}</p>
            </div>
            <div className="bg-white border border-red-200 rounded-xl p-4">
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Overdue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{overdue}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Breached</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{breached}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
            {/* Action Toolbar */}
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search ID, title, description, citizen..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#000080] outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full sm:w-auto text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#000080]">
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full sm:w-auto text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#000080]">
                        <option value="ALL">All Categories</option>
                        <option value="WATER_SUPPLY">Water Supply</option>
                        <option value="ROAD_DAMAGE">Road Damage</option>
                        <option value="ELECTRICITY">Electricity</option>
                        <option value="DRAINAGE">Drainage</option>
                        <option value="GARBAGE">Garbage</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full sm:w-auto text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#000080]">
                        <option value="ALL">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                        <th className="p-4 font-semibold">Ticket ID</th>
                        <th className="p-4 font-semibold">Citizen Info</th>
                        <th className="p-4 font-semibold w-2/5">Issue Details</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Priority / SLA</th>
                        <th className="p-4 font-semibold">Date Logged</th>
                        <th className="p-4 font-semibold">Action Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.length === 0 ? (
                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">No active grievances match your criteria.</td></tr>
                    ) : (
                        filteredComplaints.map((complaint) => (
                            <tr
                                key={complaint.id}
                                onClick={() => setSelectedComplaint(complaint)}
                                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                                <td className="p-4 text-sm font-mono text-slate-500">#{complaint.id}</td>
                                <td className="p-4 text-sm text-slate-800 font-medium">{complaint.citizenName}</td>
                                <td className="p-4 text-sm text-slate-600">
                                    <p className="font-bold text-slate-800 line-clamp-1">{complaint.title}</p>
                                    <p className="line-clamp-1 mt-1">{complaint.description}</p>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{formatEnum(complaint.category)}</td>
                                <td className="p-4 text-sm">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                                        complaint.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                        complaint.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                        complaint.priority === 'LOW' ? 'bg-slate-100 text-slate-600' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {complaint.priority || 'MEDIUM'}
                                    </span>
                                    {complaint.slaDueAt && (
                                        <p className={`mt-1 text-xs ${complaint.slaBreached || new Date(complaint.slaDueAt) < new Date() ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                                            Due {new Date(complaint.slaDueAt).toLocaleDateString('en-IN')}
                                        </p>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(complaint.createdAt).toLocaleDateString('en-IN')}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={complaint.status}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                                        className={`text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 border outline-none cursor-pointer transition-colors ${getStatusClasses(complaint.status)}`}
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        {selectedComplaint && (
            <ComplaintDetailDrawer
                complaint={selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                onAddRemark={handleAddRemark}
                onStatusChange={handleStatusChange}
                savingRemark={savingRemark}
                remarkMessage={remarkMessage}
                onClearRemarkMessage={() => setRemarkMessage(null)}
            />
        )}
        </>
    );
};

export default QueueManagementTab;
