import React from 'react';
import { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import ComplaintHistoryTimeline from '../shared/ComplaintHistoryTimeline';

const ComplaintList = ({ complaints = [], loading = false }) => {
    // State to track which row is currently expanded
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><AlertCircle className="w-3 h-3" /> Open</span>;
            case 'IN_PROGRESS': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Loader2 className="w-3 h-3 animate-spin" /> In Progress</span>;
            case 'RESOLVED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
            case 'REJECTED': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Rejected</span>;
            default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Unknown</span>;
        }
    };

    // Helper function to determine the progress bar state
    const getProgressStep = (status) => {
        if (status === 'RESOLVED') return 3;
        if (status === 'REJECTED') return 3;
        if (status === 'IN_PROGRESS') return 2;
        return 1; // OPEN
    };

    if (loading) return <div className="text-center py-10 text-slate-500">Loading your grievances...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                        <th className="p-4 font-semibold w-16">ID</th>
                        <th className="p-4 font-semibold">Title</th>
                        <th className="p-4 font-semibold">Department</th>
                        <th className="p-4 font-semibold">Date Submitted</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold w-10"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {complaints.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No grievances submitted yet.</td></tr>
                    ) : (
                        complaints.map((complaint) => (
                            <React.Fragment key={complaint.id}>
                                {/* Main Row */}
                                <tr
                                    onClick={() => toggleExpand(complaint.id)}
                                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedId === complaint.id ? 'bg-slate-50' : ''}`}
                                >
                                    <td className="p-4 text-sm text-slate-500">#{complaint.id}</td>
                                    <td className="p-4 text-sm font-medium text-slate-800">{complaint.title}</td>
                                    <td className="p-4 text-sm text-slate-600">{complaint.departmentName || complaint.department?.name || 'Assigned'}</td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-4">{getStatusBadge(complaint.status)}</td>
                                    <td className="p-4 text-slate-400">
                                        {expandedId === complaint.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </td>
                                </tr>

                                {/* Expandable Timeline Details */}
                                {expandedId === complaint.id && (
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <td colSpan="6" className="p-6">
                                            <div className="max-w-3xl mx-auto">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-4">Tracking Timeline</h4>

                                                {/* The Stepper UI */}
                                                <div className="relative flex justify-between items-center w-full">
                                                    {/* Background Line */}
                                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>

                                                    {/* Active Progress Line */}
                                                    <div
                                                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500 ${complaint.status === 'REJECTED' ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${((getProgressStep(complaint.status) - 1) / 2) * 100}%` }}
                                                    ></div>

                                                    {/* Step 1: Submitted */}
                                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white shadow-sm">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-700">Submitted</span>
                                                    </div>

                                                    {/* Step 2: Under Review */}
                                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${getProgressStep(complaint.status) >= 2 ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                                                            {getProgressStep(complaint.status) >= 2 ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                        </div>
                                                        <span className={`text-xs font-medium ${getProgressStep(complaint.status) >= 2 ? 'text-slate-700' : 'text-slate-400'}`}>Under Review</span>
                                                    </div>

                                                    {/* Step 3: Resolved */}
                                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${getProgressStep(complaint.status) === 3 ? complaint.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-green-500 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                                                            {complaint.status === 'REJECTED' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                        </div>
                                                        <span className={`text-xs font-medium ${getProgressStep(complaint.status) === 3 ? 'text-slate-700' : 'text-slate-400'}`}>{complaint.status === 'REJECTED' ? 'Rejected' : 'Resolved'}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                                                    <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Description:</span> {complaint.description}</p>
                                                </div>

                                                <div className="mt-6">
                                                    <h4 className="text-sm font-semibold text-slate-700 mb-4">History</h4>
                                                    <ComplaintHistoryTimeline
                                                        history={complaint.history || []}
                                                        emptyText="No officer updates have been posted yet."
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComplaintList;
