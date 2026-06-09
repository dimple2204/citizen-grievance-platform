import { CheckCircle2, Clock, MessageSquare, RefreshCw, XCircle } from 'lucide-react';

const getHistoryIcon = (action) => {
    if (action === 'Complaint Resolved') return CheckCircle2;
    if (action === 'Complaint Rejected') return XCircle;
    if (action === 'Remark Added') return MessageSquare;
    if (action === 'Status Changed') return RefreshCw;
    return Clock;
};

const getHistoryTone = (action) => {
    if (action === 'Complaint Resolved') return 'bg-emerald-500 text-white';
    if (action === 'Complaint Rejected') return 'bg-red-500 text-white';
    if (action === 'Remark Added') return 'bg-blue-500 text-white';
    return 'bg-slate-700 text-white';
};

const ComplaintHistoryTimeline = ({ history = [], emptyText = 'No history available yet.' }) => {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 p-4 text-sm text-slate-500">
                {emptyText}
            </div>
        );
    }

    return (
        <div className="relative space-y-5">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
            {history.map((item) => {
                const Icon = getHistoryIcon(item.action);

                return (
                    <div key={item.id || `${item.action}-${item.createdAt}`} className="relative flex gap-4">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${getHistoryTone(item.action)}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h4 className="text-sm font-bold text-slate-900">{item.action}</h4>
                                <span className="text-xs text-slate-500">
                                    {new Date(item.createdAt).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                {item.officerName || 'System'}
                            </p>
                            {item.remark && (
                                <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                                    {item.remark}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ComplaintHistoryTimeline;
