import { useState } from 'react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Megaphone,
    Plus,
    Send,
    Trash2,
    Vote
} from 'lucide-react';
import { createCommunityPost } from '../../services/api.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const postTypes = [
    { id: 'BROADCAST', label: 'Broadcast', icon: Megaphone },
    { id: 'EVENT', label: 'Event', icon: Calendar },
    { id: 'POLL', label: 'Poll', icon: Vote },
];

const categories = [
    'Infrastructure',
    'Community',
    'Traffic',
    'Health',
    'Sanitation',
    'Public Notice'
];

const CommunityBroadcastTab = () => {
    const { userName, userRole } = useAuth();
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        type: 'BROADCAST',
        title: '',
        content: '',
        category: 'Public Notice',
        ward: 'Ward 15 - Patia',
        eventDate: '',
        pollOptions: ['', '']
    });

    const selectedType = postTypes.find((type) => type.id === formData.type) || postTypes[0];
    const SelectedIcon = selectedType.icon;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (type) => {
        setStatus('idle');
        setMessage('');
        setFormData((prev) => ({
            ...prev,
            type,
            eventDate: type === 'EVENT' ? prev.eventDate : '',
            pollOptions: type === 'POLL' ? prev.pollOptions : ['', '']
        }));
    };

    const handlePollOptionChange = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            pollOptions: prev.pollOptions.map((option, optionIndex) =>
                optionIndex === index ? value : option
            )
        }));
    };

    const addPollOption = () => {
        setFormData((prev) => ({
            ...prev,
            pollOptions: [...prev.pollOptions, '']
        }));
    };

    const removePollOption = (index) => {
        setFormData((prev) => ({
            ...prev,
            pollOptions: prev.pollOptions.filter((_, optionIndex) => optionIndex !== index)
        }));
    };

    const resetForm = () => {
        setFormData({
            type: 'BROADCAST',
            title: '',
            content: '',
            category: 'Public Notice',
            ward: 'Ward 15 - Patia',
            eventDate: '',
            pollOptions: ['', '']
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('submitting');
        setMessage('');

        const trimmedOptions = formData.pollOptions
            .map((option) => option.trim())
            .filter(Boolean);

        if (formData.type === 'POLL' && trimmedOptions.length < 2) {
            setStatus('error');
            setMessage('Polls require at least two valid options.');
            return;
        }

        const payload = {
            type: formData.type,
            author: userRole === 'ADMIN'
                ? 'System Administrator'
                : `${userName || 'Department Officer'}`,
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            ward: formData.ward.trim(),
            eventDate: formData.type === 'EVENT' ? formData.eventDate : '',
            pollOptions: formData.type === 'POLL' ? trimmedOptions : []
        };

        try {
            await createCommunityPost(payload);
            setStatus('success');
            setMessage('Community post published successfully.');
            resetForm();
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data || 'Failed to publish community post. Please try again.');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-6 animate-in fade-in duration-300">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg">
                            <SelectedIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Community Broadcast</h3>
                            <p className="text-sm text-slate-500">
                                Publish official updates, events, and polls to the citizen ward feed.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Post Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {postTypes.map((type) => {
                                const Icon = type.icon;
                                const isActive = formData.type === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleTypeChange(type.id)}
                                        className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                                            isActive
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Ward <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ward"
                                required
                                value={formData.ward}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Ward 15 - Patia"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            maxLength="150"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="e.g., Water supply maintenance notice"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="content"
                            required
                            rows="5"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                            placeholder="Write the official update citizens should see..."
                        />
                    </div>

                    {formData.type === 'EVENT' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Event Date / Time
                            </label>
                            <input
                                type="text"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="e.g., 12 June 2026, 10:00 AM"
                            />
                        </div>
                    )}

                    {formData.type === 'POLL' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900">Poll Options</label>
                                    <p className="text-xs text-slate-500 mt-1">Add at least two options for citizens to vote on.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addPollOption}
                                    className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.pollOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(event) => handlePollOptionChange(index, event.target.value)}
                                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePollOption(index)}
                                            disabled={formData.pollOptions.length <= 2}
                                            className="p-2.5 rounded-lg border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            aria-label={`Remove option ${index + 1}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 rounded-lg border flex items-start gap-3 text-sm font-medium ${
                            status === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                            {status === 'success'
                                ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            }
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === 'submitting' ? 'Publishing...' : 'Publish to Ward Feed'}
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </section>

            <aside className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-fit">
                <h3 className="font-bold text-slate-900 mb-3">Publishing Preview</h3>
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center gap-2 mb-3">
                        <SelectedIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                            {selectedType.label}
                        </span>
                    </div>
                    <h4 className="font-bold text-slate-900">
                        {formData.title || 'Post title will appear here'}
                    </h4>
                    <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">
                        {formData.content || 'The broadcast message preview will appear here as you type.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                            {formData.ward || 'Ward'}
                        </span>
                        <span className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                            {formData.category}
                        </span>
                    </div>
                    {formData.type === 'EVENT' && formData.eventDate && (
                        <div className="mt-4 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                            {formData.eventDate}
                        </div>
                    )}
                    {formData.type === 'POLL' && (
                        <div className="mt-4 space-y-2">
                            {formData.pollOptions.filter(Boolean).map((option, index) => (
                                <div key={index} className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default CommunityBroadcastTab;
