import {CheckCircle2, Clock, FileText, XCircle} from "lucide-react";

const CivicImpactStats = ({ complaints }) => {
    // gracefully handle null/undefined data safely
    const safeComplaints = complaints || [];

    const total = safeComplaints.length;
    const resolved = safeComplaints.filter(c => c.status === 'RESOLVED').length;
    const pending = safeComplaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;
    const rejected = safeComplaints.filter(c => c.status === 'REJECTED').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><FileText className="w-6 h-6" /></div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Filed</p>
                    <h4 className="text-2xl font-bold text-slate-800">{total}</h4>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
                <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</p>
                    <h4 className="text-2xl font-bold text-slate-800">{resolved}</h4>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
                <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Clock className="w-6 h-6" /></div >
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Action</p>
                    <h4 className="text-2xl font-bold text-slate-800">{pending}</h4>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
                <div className="p-3 bg-red-50 rounded-lg text-red-600"><XCircle className="w-6 h-6" /></div >
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejected</p>
                    <h4 className="text-2xl font-bold text-slate-800">{rejected}</h4>
                </div>
            </div>
        </div>
    );
};

export default CivicImpactStats;
