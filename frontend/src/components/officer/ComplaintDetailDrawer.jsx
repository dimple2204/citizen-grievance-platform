import { useState } from 'react';
import { AlertCircle, Calendar, Building2, FileText, MessageSquare, Send, User, X, Download, Clock } from 'lucide-react';
import ComplaintHistoryTimeline from '../shared/ComplaintHistoryTimeline';

const statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const ComplaintDetailDrawer = ({ complaint, onClose, onAddRemark, onStatusChange, savingRemark, remarkMessage, onClearRemarkMessage }) => {
    const [remark, setRemark] = useState('');

    if (!complaint) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const cleanRemark = remark.trim();
        if (!cleanRemark) return;
        const result = await onAddRemark(complaint.id, cleanRemark);
        if (result?.success) setRemark('');
    };

    const formatEnum = (value) => value ? value.replaceAll('_', ' ') : 'Not set';

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/40"
                aria-label="Close complaint details"
                onClick={onClose}
            />

            <aside className="relative w-full lg:max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in fade-in duration-200">
                <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-mono text-slate-400 mb-1">Complaint #{complaint.id}</p>
                        <h2 className="text-xl font-bold text-slate-900">{complaint.title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-500">Citizen</p>
                                    <p className="text-slate-900">{complaint.citizenName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-500">Department</p>
                                    <p className="text-slate-900">{complaint.departmentName || 'Assigned'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-500">Created</p>
                                    <p className="text-slate-900">
                                        {new Date(complaint.createdAt).toLocaleString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-500">Current Status</p>
                                    <select
                                        value={complaint.status}
                                        onChange={(event) => onStatusChange(complaint.id, event.target.value)}
                                        className="mt-1 text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-500">Category / Priority</p>
                                    <p className="text-slate-900">{formatEnum(complaint.category)} • {complaint.priority || 'MEDIUM'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-500">SLA Deadline</p>
                                    <p className={complaint.slaBreached ? 'text-red-700 font-semibold' : 'text-slate-900'}>
                                        {complaint.slaDueAt ? new Date(complaint.slaDueAt).toLocaleString('en-IN') : 'Not set'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <h3 className="font-bold text-slate-900">Complaint Details</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{complaint.description}</p>
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Download className="w-4 h-4 text-blue-600" />
                            <h3 className="font-bold text-slate-900">Attachments</h3>
                        </div>
                        {(complaint.attachments || []).length === 0 ? (
                            <p className="text-sm text-slate-500">No files were attached.</p>
                        ) : (
                            <div className="space-y-3">
                                {complaint.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={`http://localhost:8081/api${attachment.downloadUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:border-blue-300 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{attachment.originalFileName}</p>
                                            <p className="text-xs text-slate-500">{Math.ceil((attachment.sizeBytes || 0) / 1024)} KB</p>
                                        </div>
                                        <Download className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <h3 className="font-bold text-slate-900">Add Officer Remark</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <textarea
                                value={remark}
                                onChange={(event) => {
                                    setRemark(event.target.value);
                                    if (remarkMessage && onClearRemarkMessage) {
                                        onClearRemarkMessage();
                                    }
                                }}
                                rows="3"
                                placeholder="Inspection scheduled, field team dispatched, awaiting materials..."
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                            />
                            <button
                                type="submit"
                                disabled={savingRemark || !remark.trim()}
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {savingRemark ? 'Saving...' : 'Save Remark'}
                                <Send className="w-4 h-4" />
                            </button>
                            {remarkMessage && (
                                <div className={`p-3 rounded-lg border text-sm font-medium ${
                                    remarkMessage.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                    {remarkMessage.text}
                                </div>
                            )}
                        </form>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-900 mb-4">Complaint History</h3>
                        <ComplaintHistoryTimeline history={complaint.history || []} />
                    </section>
                </div>
            </aside>
        </div>
    );
};

export default ComplaintDetailDrawer;
