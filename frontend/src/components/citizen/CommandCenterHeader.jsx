import { Activity, CheckCircle, XCircle } from 'lucide-react';

const CommandCenterHeader = ({ citizenName, complaints = [] }) => {
    const totalFiled = complaints.length;
    const totalResolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const totalRejected = complaints.filter(c => c.status === 'REJECTED').length;

    return (
        // 1. Changed background to a distinct deep midnight slate and added border-b
        <div className="w-full relative overflow-hidden bg-[#0B1120] border-b border-slate-800 pt-10 pb-10">

            {/* 2. THE FIX: The glowing boundary line. This physically separates it from the Navbar! */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-[100rem] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">

                {/* Left Side: Welcome Text */}
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Citizen Command Center
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">
                        Welcome back, {citizenName}. Track your active requests.
                    </p>
                </div>

                {/* Right Side: Discrete Stat Cards */}
                <div className="flex gap-4 w-full md:w-auto">

                    {/* Total Filed Card */}
                    <div className="bg-slate-800/60 backdrop-blur shadow-sm border border-slate-700/50 px-5 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-none">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white leading-none">{totalFiled}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Total Filed</div>
                        </div>
                    </div>

                    {/* Resolved Card */}
                    <div className="bg-slate-800/60 backdrop-blur shadow-sm border border-slate-700/50 px-5 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-none">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white leading-none">{totalResolved}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Resolved</div>
                        </div>
                    </div>

                    {/* Rejected Card */}
                    <div className="bg-slate-800/60 backdrop-blur shadow-sm border border-slate-700/50 px-5 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-none">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white leading-none">{totalRejected}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Rejected</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CommandCenterHeader;
