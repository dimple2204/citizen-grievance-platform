import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, FileText, Send, AlertCircle, CheckCircle2, 
  Navigation, Upload, X, Clock, Shield, Info,
  ChevronDown, LogIn
} from 'lucide-react';
import { submitComplaint, getAllDepartments, uploadComplaintAttachments } from '../../../services/api.jsx';

// ==================== MOCK DATA ====================
const mockDepartments = [
  { id: 1, name: 'Roads & Infrastructure' },
  { id: 2, name: 'Water Works' },
  { id: 3, name: 'Electricity Board' },
  { id: 4, name: 'Sanitation & Waste' },
  { id: 5, name: 'Public Health' },
  { id: 6, name: 'Urban Planning' }
];

const slaGuidelines = [
  {
    title: 'Standard Processing Time',
    content: 'Most grievances are acknowledged within 24 hours. Resolution time varies by department and issue complexity, typically 3-15 working days.',
    icon: Clock
  },
  {
    title: 'Required Information',
    content: 'Provide accurate location coordinates, clear description, and relevant photos if possible. Incomplete submissions may cause delays.',
    icon: Info
  },
  {
    title: 'Escalation Process',
    content: 'If unresolved within SLA, grievances are automatically escalated to senior officials. You will be notified of any status changes.',
    icon: Shield
  }
];

const complaintCategories = [
  { value: 'WATER_SUPPLY', label: 'Water Supply' },
  { value: 'ROAD_DAMAGE', label: 'Road Damage' },
  { value: 'ELECTRICITY', label: 'Electricity' },
  { value: 'DRAINAGE', label: 'Drainage' },
  { value: 'GARBAGE', label: 'Garbage' },
  { value: 'OTHER', label: 'Other' }
];

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const LodgeGrievanceTab = ({ onComplaintSubmitted }) => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState('idle');
  const [expandedAccordion, setExpandedAccordion] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const currentUserId = localStorage.getItem('user_id');
  const isAuthenticated = !!currentUserId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    latitude: '',
    longitude: ''
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await getAllDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to load departments", error);
        setDepartments(mockDepartments);
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
        },
        () => {
          alert("Please allow location access in your browser to use this feature.");
        }
      );
    }
  };

  // File handling
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
    setUploadedFiles(prev => [...prev, ...files].slice(0, 4));
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
    setUploadedFiles(prev => [...prev, ...files].slice(0, 4));
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setStatus('submitting');

    const submissionData = {
      ...formData,
      citizenId: parseInt(currentUserId, 10),
      departmentId: parseInt(formData.departmentId, 10)
    };

    try {
      const response = await submitComplaint(submissionData);
      if (uploadedFiles.length > 0) {
        await uploadComplaintAttachments(response.data.id, uploadedFiles);
      }
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
        setFormData({ title: '', description: '', departmentId: '', category: 'OTHER', priority: 'MEDIUM', latitude: '', longitude: '' });
        setUploadedFiles([]);
        if (onComplaintSubmitted) onComplaintSubmitted();
      }, 2500);
    } catch (error) {
      console.error("Submission Error: ", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const displayDepartments = departments.length > 0 ? departments : mockDepartments;

  return (
    <div className="flex min-h-[calc(100vh-280px)]">
      
      {/* ==================== LEFT PANEL (70%) - Form ==================== */}
      <div className="w-full lg:w-[70%] bg-white border-r border-slate-200">
        <div className="max-w-3xl mx-auto p-8">
          
          {/* Form Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Lodge a Grievance</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Submit your civic issue directly to the concerned department
              </p>
            </div>
          </div>

          {/* Login Notice for Unauthenticated Users */}
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Sign in to submit a grievance</p>
                <p className="text-sm text-amber-700 mt-1">
                  You need to be logged in to file a grievance. Your account helps us track and update you on your submission.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-3 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Continue
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Department Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="departmentId"
                  required
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700"
                >
                  <option value="" disabled>Select the relevant department...</option>
                  {displayDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Issue Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Broken Streetlight on Main Road"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700"
                >
                  {complaintCategories.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-slate-700"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe the issue in detail. Include relevant information such as how long the problem has persisted, any safety concerns, and how it affects the community..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Location Detection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Incident Location
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Click detect to capture GPS coordinates"
                    value={formData.latitude ? `${formData.latitude}, ${formData.longitude}` : ''}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-600 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Detect GPS Location
                </button>
              </div>
            </div>

            {/* Photo Upload Dropzone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attach Photos (Optional)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">
                    Drag and drop images here, or <span className="text-blue-600">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB (max 4 files)</p>
                  <p className="text-xs text-slate-400">PDF files are also supported.</p>
                </label>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type === 'application/pdf' ? (
                        <div className="w-20 h-20 rounded-lg border border-slate-200 bg-red-50 text-red-700 flex items-center justify-center text-xs font-bold px-2 text-center">
                          PDF
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === 'submitting' || !isAuthenticated}
                className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>Submitting...</>
                ) : !isAuthenticated ? (
                  <>
                    Sign In Required
                    <LogIn className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Submit Grievance
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Status Feedback */}
            {status === 'success' && (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Grievance Registered Successfully!</p>
                  <p className="text-sm text-emerald-600">You will receive updates on your registered email.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Submission Failed</p>
                  <p className="text-sm text-red-600">Please check your connection and try again.</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ==================== RIGHT PANEL (30%) - Smart Guidelines ==================== */}
      <div className="hidden lg:block lg:w-[30%] bg-slate-50 p-6 overflow-y-auto">
        <div className="sticky top-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Smart Guidelines</h2>
          <p className="text-sm text-slate-500 mb-6">
            Review the SLA times and filing rules before submitting your grievance.
          </p>

          {/* Accordion Items */}
          <div className="space-y-3">
            {slaGuidelines.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedAccordion === index;

              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedAccordion(isExpanded ? -1 : index)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="flex-1 font-semibold text-sm text-slate-800">
                      {item.title}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-slate-600 leading-relaxed pl-11">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SLA Reference Card */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 text-sm mb-3">Expected SLA by Department</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Roads & Infrastructure</span>
                <span className="font-medium text-slate-800">7-10 days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Water Works</span>
                <span className="font-medium text-slate-800">3-5 days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Electricity Board</span>
                <span className="font-medium text-slate-800">1-3 days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sanitation</span>
                <span className="font-medium text-slate-800">2-4 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LodgeGrievanceTab;
