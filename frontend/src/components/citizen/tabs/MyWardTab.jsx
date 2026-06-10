import { useEffect, useState } from 'react';
import {
  Megaphone, Vote, User, Phone, Mail, MapPin,
  ThumbsUp, MessageSquare, Calendar, ExternalLink,
  Clock, CheckCircle2, Users, X, Loader2
} from 'lucide-react';
import { getCommunityFeed, submitPollVote } from "../../../services/api.jsx";

// ==================== MOCK DATA (For Councillor Only) ====================
const mockWardCouncillor = {
  name: 'Smt. Priya Mohanty',
  designation: 'Ward Councillor',
  ward: 'Ward 15 - Patia',
  phone: '+91 98765 43210',
  email: 'councillor.ward15@bmc.gov.in',
  officeHours: 'Mon-Sat, 10 AM - 5 PM',
  avatar: null
};

const MyWardTab = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track votes locally so UI updates instantly. Key = pollId, Value = selected optionId
  const [votedPolls, setVotedPolls] = useState({});

  // Scheduler Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('10:00 AM - 10:30 AM');
  const [meetingSubject, setMeetingSubject] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState('');

  // 1. Fetch data from Spring Boot on load
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await getCommunityFeed('Ward 15 - Patia');
        setFeed(response.data);
      } catch (error) {
        console.error('Error fetching community feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // 2. Handle Real Voting
  const handleVote = async (pollId, optionId) => {
    try {
      // Send vote to the Spring Boot backend
      await submitPollVote(optionId);

      // Mark as voted in the local UI state
      setVotedPolls((prev) => ({ ...prev, [pollId]: optionId }));

      // Instantly update the local feed state to show the new vote count
      setFeed((prevFeed) => prevFeed.map(post => {
        if (post.id === pollId) {
          return {
            ...post,
            pollOptions: post.pollOptions.map(opt =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Infrastructure: 'bg-blue-100 text-blue-700',
      Community: 'bg-emerald-100 text-emerald-700',
      Traffic: 'bg-amber-100 text-amber-700',
      Health: 'bg-rose-100 text-rose-700',
      default: 'bg-slate-100 text-slate-700'
    };
    return colors[category] || colors.default;
  };

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'BROADCAST': return Megaphone;
      case 'POLL': return Vote;
      case 'EVENT': return Calendar;
      default: return Megaphone;
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setScheduleLoading(true);
    setScheduleSuccess('');

    setTimeout(() => {
      setScheduleLoading(false);
      setScheduleSuccess(`Appointment requested for ${meetingDate} at ${meetingTime}. A confirmation SMS has been sent.`);
    }, 1200);
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading Community Feed...</div>;
  }

  return (
      <div className="px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 relative">
        <div className="max-w-[800px] mx-auto">

          {/* Ward Councillor Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
            <div className="bg-slate-900 px-6 py-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Your Ward Representative
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <User className="w-12 h-12 text-white/90" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {mockWardCouncillor.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 font-medium">
                    {mockWardCouncillor.designation} • {mockWardCouncillor.ward}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={`tel:${mockWardCouncillor.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                      <div className="bg-slate-100 p-2 rounded-lg"><Phone className="w-4 h-4" /></div>
                      {mockWardCouncillor.phone}
                    </a>
                    <a href={`mailto:${mockWardCouncillor.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                      <div className="bg-slate-100 p-2 rounded-lg"><Mail className="w-4 h-4" /></div>
                      <span className="truncate">{mockWardCouncillor.email}</span>
                    </a>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="bg-slate-100 p-2 rounded-lg"><Clock className="w-4 h-4" /></div>
                      {mockWardCouncillor.officeHours}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="bg-slate-100 p-2 rounded-lg"><MapPin className="w-4 h-4" /></div>
                      Ward Office, Sector 4
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="sm:self-start">
                  <button 
                    onClick={() => setShowScheduleModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                  >
                    Schedule Meeting
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Community Feed Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Community Feed</h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{mockWardCouncillor.ward}</span>
          </div>

          {/* Dynamic Feed Items from Database */}
          <div className="space-y-4">
            {feed.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-2xl border border-slate-200 text-slate-500">
                  No updates in your ward yet.
                </div>
            ) : feed.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              const isPoll = item.type?.toUpperCase() === 'POLL';

              // Dynamic Poll Calculations
              const totalVotes = isPoll && item.pollOptions ? item.pollOptions.reduce((sum, opt) => sum + opt.votes, 0) : 0;
              const hasVoted = votedPolls[item.id] !== undefined;
              const selectedOptionId = votedPolls[item.id];

              return (
                  <article
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6">
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <TypeIcon className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{item.author}</p>
                            <p className="text-xs font-medium text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                      </div>

                      {/* Post Content */}
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{item.content}</p>

                      {/* Poll Options (Only visible if type is POLL) */}
                      {isPoll && item.pollOptions && (
                          <div className="space-y-2 mt-4">
                            {item.pollOptions.map((option) => {
                              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                              const isSelected = selectedOptionId === option.id;

                              return (
                                  <button
                                      key={option.id}
                                      onClick={() => !hasVoted && handleVote(item.id, option.id)}
                                      disabled={hasVoted}
                                      className={`
                              w-full relative overflow-hidden rounded-xl border transition-all text-left
                              ${hasVoted ? 'cursor-default' : 'hover:border-blue-400 cursor-pointer'}
                              ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'}
                            `}
                                  >
                                    {/* Visual Progress bar (shown after voting) */}
                                    {hasVoted && (
                                        <div
                                            className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    )}

                                    <div className="relative px-4 py-3 flex items-center justify-between z-10">
                                      <div className="flex items-center gap-3">
                                        {hasVoted && isSelected && (
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                   {option.text}
                                 </span>
                                      </div>
                                      {hasVoted && (
                                          <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                                   {percentage}%
                                 </span>
                                      )}
                                    </div>
                                  </button>
                              );
                            })}

                            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              <Users className="w-4 h-4" />
                              <span>{totalVotes} total votes</span>
                            </div>
                          </div>
                      )}

                      {/* Event Date Badge (Only visible if type is EVENT) */}
                      {item.type?.toUpperCase() === 'EVENT' && item.eventDate && (
                          <div className="mt-5 flex items-center gap-3 bg-emerald-50/50 text-emerald-700 p-3 rounded-xl border border-emerald-100/50">
                            <div className="bg-emerald-100 p-2 rounded-lg"><Calendar className="w-4 h-4 text-emerald-600" /></div>
                            <div>
                              <div className="text-sm font-bold">{item.eventDate}</div>
                              <div className="text-xs font-medium text-emerald-600/80">Mark your calendar</div>
                            </div>
                          </div>
                      )}

                      {/* Engagement Actions */}
                      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </article>
              );
            })}
          </div>

          {/* Load More */}
          {feed.length > 0 && (
              <div className="mt-10 text-center">
                <button className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md">
                  Load previous updates
                </button>
              </div>
          )}
        </div>

        {/* Schedule Meeting Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleIn">
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Schedule Meeting</h3>
                  <p className="text-xs text-slate-400 mt-0.5">With Councillor Priya Mohanty</p>
                </div>
                <button 
                  onClick={() => { setShowScheduleModal(false); setScheduleSuccess(''); }} 
                  className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {scheduleSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-950 text-lg mb-2">Meeting Requested</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{scheduleSuccess}</p>
                    <button 
                      onClick={() => { setShowScheduleModal(false); setScheduleSuccess(''); }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Date</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        onChange={(e) => setMeetingDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Time Slot</label>
                      <select 
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        onChange={(e) => setMeetingTime(e.target.value)}
                        required
                      >
                        <option>10:00 AM - 10:30 AM</option>
                        <option>11:00 AM - 11:30 AM</option>
                        <option>02:30 PM - 03:00 PM</option>
                        <option>04:00 PM - 04:30 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject of Meeting</label>
                      <textarea 
                        rows="3"
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        placeholder="Briefly state your civic issue or agenda..."
                        onChange={(e) => setMeetingSubject(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={scheduleLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                    >
                      {scheduleLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          Book Appointment
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default MyWardTab;