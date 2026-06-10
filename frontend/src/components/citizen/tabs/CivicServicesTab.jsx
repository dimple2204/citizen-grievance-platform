import { useState } from 'react';
import { 
  Building, Trash2, FileCheck, UserCheck, 
  ArrowRight, Clock, CheckCircle2, ExternalLink,
  CreditCard, Truck, FileText, Shield, X, Loader2
} from 'lucide-react';

// ==================== MOCK DATA ====================
const mockCivicServices = [
  {
    id: 1,
    title: 'Property Tax Payment',
    description: 'Pay your annual property tax online. View past payments and download receipts.',
    icon: CreditCard,
    category: 'Payments',
    status: 'available',
    estimatedTime: 'Instant',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Schedule Bulk Waste Pickup',
    description: 'Request collection for large items, construction debris, or bulk household waste.',
    icon: Truck,
    category: 'Sanitation',
    status: 'available',
    estimatedTime: '2-3 days',
    color: 'emerald'
  },
  {
    id: 3,
    title: 'Apply for Certificates',
    description: 'Request birth, death, income, or residence certificates online.',
    icon: FileText,
    category: 'Documentation',
    status: 'available',
    estimatedTime: '5-7 days',
    color: 'amber'
  },
  {
    id: 4,
    title: 'Verify Aadhaar/KYC',
    description: 'Link and verify your Aadhaar for faster grievance redressal and service access.',
    icon: Shield,
    category: 'Identity',
    status: 'available',
    estimatedTime: 'Instant',
    color: 'slate'
  },
  {
    id: 5,
    title: 'Building Plan Approval',
    description: 'Submit building plans for approval. Track application status and download permits.',
    icon: Building,
    category: 'Planning',
    status: 'coming_soon',
    estimatedTime: '15-30 days',
    color: 'indigo'
  },
  {
    id: 6,
    title: 'Trade License Renewal',
    description: 'Renew your trade license online. View compliance requirements and fees.',
    icon: FileCheck,
    category: 'Business',
    status: 'coming_soon',
    estimatedTime: '7-10 days',
    color: 'rose'
  }
];

const CivicServicesTab = () => {
  const [activeService, setActiveService] = useState(null);
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        icon: 'bg-blue-100 text-blue-600',
        hover: 'hover:border-blue-300 hover:shadow-blue-100/50'
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        icon: 'bg-emerald-100 text-emerald-600',
        hover: 'hover:border-emerald-300 hover:shadow-emerald-100/50'
      },
      amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        icon: 'bg-amber-100 text-amber-600',
        hover: 'hover:border-amber-300 hover:shadow-amber-100/50'
      },
      slate: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'bg-slate-200 text-slate-600',
        hover: 'hover:border-slate-300 hover:shadow-slate-100/50'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        icon: 'bg-indigo-100 text-indigo-600',
        hover: 'hover:border-indigo-300 hover:shadow-indigo-100/50'
      },
      rose: {
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        icon: 'bg-rose-100 text-rose-600',
        hover: 'hover:border-rose-300 hover:shadow-rose-100/50'
      }
    };
    return colors[color] || colors.blue;
  };

  const handleInputChange = (field, val) => {
    setFormState(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    setTimeout(() => {
      setLoading(false);
      if (activeService.id === 1) {
        setSuccessMsg('Payment of ₹2,450 successful! Receipt #TXN-98432 generated & sent to email.');
      } else if (activeService.id === 2) {
        setSuccessMsg('Bulk waste collection scheduled! Your request ID is WST-74320. Crews will arrive within 48 hours.');
      } else if (activeService.id === 3) {
        setSuccessMsg(`Application for Certificate (${formState.certType || 'Residence'}) submitted successfully! Tracking ID: CERT-89410.`);
      } else if (activeService.id === 4) {
        setSuccessMsg('Aadhaar verified successfully! Your citizen account KYC is now verified.');
      }
    }, 1500);
  };

  const closeModal = () => {
    setActiveService(null);
    setFormState({});
    setSuccessMsg('');
  };

  return (
    <div className="px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 relative">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Civic Services</h1>
        <p className="text-slate-500">
          Access municipal services, make payments, and apply for certificates - all in one place.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCivicServices.map((service) => {
          const Icon = service.icon;
          const colorClasses = getColorClasses(service.color);
          const isComingSoon = service.status === 'coming_soon';

          return (
            <div
              key={service.id}
              onClick={() => !isComingSoon && setActiveService(service)}
              className={`
                bg-white rounded-2xl border transition-all duration-200 overflow-hidden group
                ${isComingSoon 
                  ? 'border-slate-200 opacity-75 cursor-not-allowed' 
                  : `${colorClasses.border} ${colorClasses.hover} hover:shadow-lg cursor-pointer`
                }
              `}
            >
              <div className="p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isComingSoon ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" />
                      Available
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {service.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
                    {service.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{service.estimatedTime}</span>
                  </div>
                  
                  {!isComingSoon && (
                    <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      Access Service
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{activeService.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeService.category}</p>
              </div>
              <button 
                onClick={closeModal} 
                className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {successMsg ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-950 text-lg mb-2">Service Completed</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{successMsg}</p>
                  <button 
                    onClick={closeModal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dynamic Form Fields based on service ID */}
                  {activeService.id === 1 && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 mb-2">
                        <p className="font-semibold text-blue-950 mb-1">Billing Account Summary:</p>
                        <p>Owner: <span className="font-medium">Rajesh Kumar</span></p>
                        <p>Property ID: <span className="font-medium">PROP-2024-8742</span></p>
                        <p>Tax Due: <span className="font-bold text-base text-blue-950">₹2,450.00</span></p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Payment Mode</label>
                        <select 
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        >
                          <option>Net Banking</option>
                          <option>UPI / QR Scan</option>
                          <option>Credit / Debit Card</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeService.id === 2 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type of Bulk Waste</label>
                        <select 
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          onChange={(e) => handleInputChange('wasteType', e.target.value)}
                          required
                        >
                          <option value="e-waste">E-Waste (Appliance/TV/Computer)</option>
                          <option value="debris">Construction Debris</option>
                          <option value="furniture">Furniture / Wood</option>
                          <option value="garden">Tree Prunings / Garden Waste</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preferred Pickup Date</label>
                        <input 
                          type="date"
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup Address</label>
                        <textarea 
                          rows="2"
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                          placeholder="Provide collection street address..."
                          required
                        />
                      </div>
                    </div>
                  )}

                  {activeService.id === 3 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Certificate Type</label>
                        <select 
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          onChange={(e) => handleInputChange('certType', e.target.value)}
                          required
                        >
                          <option value="Residence">Residence Certificate</option>
                          <option value="Income">Income Certificate</option>
                          <option value="Birth">Birth Certificate</option>
                          <option value="Death">Death Certificate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Applicant Name</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          placeholder="Full name as in government records"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supporting Document (PDF)</label>
                        <input 
                          type="file"
                          accept=".pdf,.png,.jpg"
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {activeService.id === 4 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aadhaar Card Number (12 Digits)</label>
                        <input 
                          type="text"
                          pattern="\d{12}"
                          maxLength="12"
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all tracking-widest text-center text-base font-bold"
                          placeholder="XXXX XXXX XXXX"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="consent" className="rounded text-blue-600 focus:ring-blue-500" required />
                        <label htmlFor="consent" className="text-xs text-slate-500 select-none">
                          I consent to share my Aadhaar credentials for citizen demographic validation.
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="mt-12 bg-slate-900 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Need Help?</h2>
            <p className="text-slate-400">
              Contact our support team or visit the nearest municipal office for in-person assistance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:1800-111-2222"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Call Helpline
              <ExternalLink className="w-4 h-4" />
            </a>
            <button 
              onClick={() => alert("BMC Municipal Office Office Location:\nPlot 12, Patia Square, Bhubaneswar, Odisha\nTiming: 10:00 AM - 5:00 PM")}
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Find Nearest Office
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicServicesTab;
