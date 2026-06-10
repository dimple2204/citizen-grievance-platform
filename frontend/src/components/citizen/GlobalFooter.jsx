import { useState } from 'react';
import { 
  ShieldCheck, Phone, Heart, Flame, 
  Globe, ExternalLink, X 
} from 'lucide-react';

const GlobalFooter = () => {
  const [activeLang, setActiveLang] = useState('en');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const emergencyNumbers = [
    { name: 'Police', number: '100', icon: ShieldCheck, color: 'text-blue-400' },
    { name: 'Ambulance', number: '108', icon: Heart, color: 'text-emerald-400' },
    { name: 'Fire', number: '101', icon: Flame, color: 'text-orange-400' }
  ];

  const footerLinks = {
    legal: [
      { name: 'Terms of Service', type: 'terms' },
      { name: 'Privacy Policy', type: 'privacy' },
      { name: 'RTI Guidelines', type: 'rti' }
    ],
    resources: [
      { name: 'Help Center', type: 'help' },
      { name: 'API Documentation', type: 'api' },
      { name: 'Accessibility', type: 'access' }
    ]
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'or', name: 'ଓଡ଼ିଆ' }
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
      case 'rti':
        return {
          title: 'RTI Guidelines',
          paragraphs: [
            'Under the Right to Information Act, citizens are entitled to transparent auditing of public grievances. LokShikayat complaint status transitions are logged publicly for auditing.',
            'Annual reports on department performance, resolution timelines, and citizen feedback scores are compiled and forwarded to state administrative committees.',
            'For formal RTI filings concerning municipal expenditures, please visit the central RTI e-portal.'
          ]
        };
      case 'help':
        return {
          title: 'Help Center',
          paragraphs: [
            '1. How do I lodge a complaint? Navigate to "Lodge Grievance", fill out the title, description, select a category, and optionally share location coordinates.',
            '2. What is the SLA? Service Level Agreements set automated deadlines for response times (e.g. Critical is resolved in 24-48 hours). Overdue tickets are automatically flagged to admins.',
            '3. Who is LokMitra? LokMitra is our integrated AI civic helper. Click the floating chat bubble on the bottom right to ask questions or draft complaint text.'
          ]
        };
      case 'api':
        return {
          title: 'API Documentation Overview',
          paragraphs: [
            'Developers can integrate with LokShikayat endpoints using standard REST protocols. All endpoints require JSON formatting and JWT bearer tokens.',
            'Authentication Endpoint: POST /api/users/login (returns jwt_token). Send this token in your headers: Authorization: Bearer <token>.',
            'To query citizen grievances, perform a GET request to: /api/complaints/citizen/{citizenId}. Community ward updates are fetched via GET /api/community/feed?ward={wardName}.'
          ]
        };
      case 'access':
        return {
          title: 'Accessibility Statement',
          paragraphs: [
            'LokShikayat is built following Web Content Accessibility Guidelines (WCAG 2.1) to ensure all citizens can easily register issues.',
            'We support screen reader readability, high-contrast layouts, and keyboard-only tab navigation across pages.',
            'If you experience accessibility blockers, please submit feedback to support@lokshikayat.gov.in so we can address it.'
          ]
        };
      default:
        return null;
    }
  };

  const selectedDocContent = selectedDoc ? getDocContent(selectedDoc) : null;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-white text-lg">LokShikayat</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens with transparent and efficient grievance redressal. 
              Your voice matters in building a better community.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => setSelectedDoc(link.type)}
                    className="text-sm text-slate-400 hover:text-white transition-colors border-0 bg-transparent p-0 cursor-pointer text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => setSelectedDoc(link.type)}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 border-0 bg-transparent p-0 cursor-pointer text-left"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Language Toggle */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setActiveLang(lang.code);
                    if (lang.code !== 'en') {
                      alert(`Language translations for ${lang.name} are coming soon in next release.`);
                    }
                  }}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border-0 cursor-pointer
                    ${activeLang === lang.code 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Numbers Bar */}
        <div className="py-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Emergency Helplines
            </span>
            <div className="flex items-center gap-6">
              {emergencyNumbers.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    className="flex items-center gap-2 group decoration-transparent"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <div>
                      <span className="text-slate-500 text-[10px] block leading-none">{item.name}</span>
                      <span className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.number}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2026 LokShikayat. An initiative under the Digital India Programme.
          </p>
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png" 
              alt="Government of India Emblem" 
              className="h-8 opacity-50"
            />
            <span className="text-xs text-slate-500">
              Government of India
            </span>
          </div>
        </div>
      </div>

      {/* Policies Document Modal */}
      {selectedDocContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedDocContent.title}</h3>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
              {selectedDocContent.paragraphs.map((para, index) => (
                <p key={index} className="text-sm text-slate-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer border-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default GlobalFooter;
