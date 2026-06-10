import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, BarChart3, 
  Users, FileText, Zap, Globe, Phone, Mail, MapPin,
  ChevronRight, Shield, Bell, Award, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPublicStats } from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showDeptModal, setShowDeptModal] = useState(false);

    const [liveStats, setLiveStats] = useState({
        resolvedComplaints: 15234,
        avgResponseTimeHours: 48,
        citizenSatisfactionRate: 95,
        departmentsConnected: 6
    });

    useEffect(() => {
        getPublicStats()
            .then(response => {
                if (response.data) {
                    setLiveStats(response.data);
                }
            })
            .catch(error => {
                console.error("Failed to load public statistics", error);
            });
    }, []);

    const handleGetStarted = () => {
        if (isAuthenticated && userRole === 'CITIZEN') {
            navigate('/citizen');
        } else if (isAuthenticated) {
            navigate('/officer');
        } else {
            navigate('/register');
        }
    };

    const features = [
        { 
            icon: FileText, 
            title: 'Easy Filing', 
            description: 'Submit grievances in minutes with our streamlined digital forms',
            color: 'blue'
        },
        { 
            icon: Clock, 
            title: 'SLA Tracking', 
            description: 'Monitor resolution timelines with guaranteed service levels',
            color: 'amber'
        },
        { 
            icon: Bell, 
            title: 'Real-time Updates', 
            description: 'Get instant notifications on your grievance status',
            color: 'emerald'
        },
        { 
            icon: Shield, 
            title: 'Secure & Private', 
            description: 'Your data is protected with enterprise-grade security',
            color: 'slate'
        }
    ];

    const stats = [
        { value: liveStats.resolvedComplaints.toLocaleString() + '+', label: 'Grievances Resolved', icon: CheckCircle2 },
        { value: liveStats.avgResponseTimeHours + ' hrs', label: 'Avg. Response Time', icon: Clock },
        { value: liveStats.citizenSatisfactionRate + '%', label: 'Citizen Satisfaction', icon: Award },
        { value: liveStats.departmentsConnected + '+', label: 'Departments Connected', icon: Globe }
    ];

    const departments = [
        'Roads & Infrastructure',
        'Water Supply',
        'Electricity Board',
        'Sanitation & Waste',
        'Public Health',
        'Urban Planning'
    ];

    const departmentDetails = [
        { name: 'Roads & Infrastructure', head: 'Shri Manoj Das (Superintendent Engineer)', phone: '+91 94370 11223', email: 'roads.infra@bmc.gov.in', activeTickets: 14 },
        { name: 'Water Supply', head: 'Smt. Smita Patnaik (Executive Engineer)', phone: '+91 94370 22334', email: 'water.supply@bmc.gov.in', activeTickets: 9 },
        { name: 'Electricity Board', head: 'Shri Alok Mishra (Division Head)', phone: '+91 94370 33445', email: 'electricity@odisha.gov.in', activeTickets: 18 },
        { name: 'Sanitation & Waste', head: 'Shri Ramesh Sahu (Health Officer)', phone: '+91 94370 44556', email: 'sanitation@bmc.gov.in', activeTickets: 22 },
        { name: 'Public Health', head: 'Dr. Kabita Mohanty (Chief Medical Officer)', phone: '+91 94370 55667', email: 'health.dept@bmc.gov.in', activeTickets: 5 },
        { name: 'Urban Planning', head: 'Shri S. K. Nayak (Planning Director)', phone: '+91 94370 66778', email: 'urban.plan@bmc.gov.in', activeTickets: 3 }
    ];

    const getDocContent = (type) => {
        switch (type) {
            case 'terms':
                return {
                    title: 'Terms of Service',
                    paragraphs: [
                        'By accessing and using LokShikayat, you agree to submit truthful, accurate details about municipal issues. Filing false or malicious reports is strictly prohibited.',
                        'The platform serves to route community concerns to official departments. While we aim for prompt redressing under SLA limits, resolution depends on department capacity.',
                        'Citizens must not upload copyrighted materials, promotional files, or offensive text. Violations will result in account suspension.'
                    ]
                };
            case 'privacy':
                return {
                    title: 'Privacy Policy',
                    paragraphs: [
                        'We value citizen privacy. Your geographic coordinates, contact phone numbers, and email addresses are securely stored and encrypted.',
                        'Data is solely shared with the specific government department and assigned redressal officer handling your grievance. No user metadata is sold or exposed to third parties.',
                        'You have the right to request deletion of your account and archived complaint logs by contacting support.'
                    ]
                };
            case 'help':
                return {
                    title: 'Help Center & Support',
                    paragraphs: [
                        '1. How do I lodge a complaint? Navigate to "Lodge Grievance", fill out the title, description, select a category, and optionally share location coordinates.',
                        '2. What is the SLA? Service Level Agreements set automated deadlines for response times (e.g. Critical is resolved in 24-48 hours). Overdue tickets are automatically flagged to admins.',
                        '3. Who is LokMitra? LokMitra is our integrated AI civic helper. Click the floating chat bubble on the bottom right to ask questions or draft complaint text.'
                    ]
                };
            default:
                return null;
        }
    };

    const docContent = selectedDoc ? getDocContent(selectedDoc) : null;

    return (
        <div className="min-h-screen bg-white relative">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span className="text-sm font-medium text-blue-700">Digital India Initiative</span>
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 text-balance">
                                Your Voice,{' '}
                                <span className="text-blue-600">Our Priority</span>
                            </h1>
                            
                            <p className="text-lg sm:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
                                LokShikayat is the AI-powered civic grievance platform that connects citizens directly 
                                with government departments for faster, transparent issue resolution.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={handleGetStarted}
                                    className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                                >
                                    {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <Link
                                    to="/login"
                                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
                                >
                                    Sign In
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>100% Free Service</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>No Registration Required to Track</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual - Stats Card */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                {/* Main Card */}
                                <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-600 p-3 rounded-xl">
                                            <ShieldCheck className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">LokShikayat</h3>
                                            <p className="text-slate-500 text-sm">Citizen Command Center</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {stats.map((stat, index) => {
                                            const Icon = stat.icon;
                                            return (
                                                <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                    <Icon className="w-5 h-5 text-blue-600 mb-2" />
                                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg animate-pulse">
                                    Live Tracking
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Why Choose LokShikayat?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A modern approach to civic grievance redressal with transparency at its core
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const colors = {
                                blue: 'bg-blue-50 text-blue-600 border-blue-100',
                                amber: 'bg-amber-50 text-amber-600 border-amber-100',
                                emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                                slate: 'bg-slate-100 text-slate-600 border-slate-200'
                            };
                            return (
                                <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colors[feature.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Departments Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                Connected to All Major Departments
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                File grievances directly to the concerned department. Our AI-powered routing 
                                ensures your complaint reaches the right authority instantly.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {departments.map((dept, index) => (
                                    <div key={index} className="flex items-center gap-2 text-slate-700">
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium">{dept}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowDeptModal(true)}
                                className="mt-8 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors border-0 bg-transparent cursor-pointer"
                            >
                                View All Departments
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-8 text-white">
                            <h3 className="text-xl font-bold mb-6">How It Works</h3>
                            <div className="space-y-6">
                                {[
                                    { step: '01', title: 'Register', desc: 'Create your free citizen account' },
                                    { step: '02', title: 'Submit', desc: 'Describe your issue with location & photos' },
                                    { step: '03', title: 'Track', desc: 'Monitor real-time status updates' },
                                    { step: '04', title: 'Resolve', desc: 'Get timely resolution with feedback' }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{item.title}</h4>
                                            <p className="text-slate-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of citizens who have successfully resolved their civic issues through LokShikayat.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGetStarted}
                            className="bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Start Filing Now'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <Link
                            to="/login"
                            className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
                        >
                            Already Registered? Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">LokShikayat</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-4 max-w-md">
                                An initiative under Digital India Programme to provide transparent, 
                                efficient and accountable grievance redressal to citizens.
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <button 
                                    onClick={() => setSelectedDoc('privacy')} 
                                    className="hover:text-white transition-colors border-0 bg-transparent p-0 cursor-pointer"
                                >
                                    Privacy Policy
                                </button>
                                <span>•</span>
                                <button 
                                    onClick={() => setSelectedDoc('terms')} 
                                    className="hover:text-white transition-colors border-0 bg-transparent p-0 cursor-pointer"
                                >
                                    Terms of Service
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/citizen" className="hover:text-white transition-colors">Citizen Portal</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                                <li>
                                    <button 
                                        onClick={() => setSelectedDoc('help')} 
                                        className="hover:text-white transition-colors border-0 bg-transparent p-0 cursor-pointer text-left text-sm text-slate-400"
                                    >
                                        Help & Support
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-blue-400" />
                                    <a href="tel:18001112222" className="hover:text-white text-slate-400 transition-colors decoration-transparent">
                                        1800-111-2222 (Toll Free)
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    <a href="mailto:support@lokshikayat.gov.in" className="hover:text-white text-slate-400 transition-colors decoration-transparent">
                                        support@lokshikayat.gov.in
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-10 pt-8 text-center text-sm">
                        <p>Government of India • Ministry of Electronics & Information Technology</p>
                    </div>
                </div>
            </footer>

            {/* Document Policy Modal Overlay */}
            {docContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                            <h3 className="font-bold text-lg">{docContent.title}</h3>
                            <button 
                                onClick={() => setSelectedDoc(null)} 
                                className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg border-0 bg-transparent cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
                            {docContent.paragraphs.map((para, index) => (
                                <p key={index} className="text-sm text-slate-600 leading-relaxed">
                                    {para}
                                </p>
                            ))}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedDoc(null)}
                                className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer border-0"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View All Departments Modal */}
            {showDeptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Connected Municipal Departments</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Contact directories and telemetry</p>
                            </div>
                            <button 
                                onClick={() => setShowDeptModal(false)} 
                                className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg border-0 bg-transparent cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {departmentDetails.map((dept, index) => (
                                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base mb-1">{dept.name}</h4>
                                            <p className="text-xs text-slate-500 mb-3"><span className="font-medium">Head:</span> {dept.head}</p>
                                        </div>
                                        <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-2.5">
                                            <p className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-blue-500" />
                                                <a href={`tel:${dept.phone}`} className="hover:text-blue-600 transition-colors">{dept.phone}</a>
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-blue-500 animate-none" />
                                                <a href={`mailto:${dept.email}`} className="hover:text-blue-600 transition-colors truncate">{dept.email}</a>
                                            </p>
                                            <p className="flex items-center gap-1.5 mt-2 bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded w-fit text-[10px]">
                                                {dept.activeTickets} Active Grievances
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setShowDeptModal(false)}
                                className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer border-0"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
