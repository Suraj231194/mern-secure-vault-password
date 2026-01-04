import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { FaSave, FaArrowLeft, FaShieldAlt, FaKey, FaStickyNote } from 'react-icons/fa';

const EntryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        category: 'note',
        content: '',
        isFavorite: false
    });

    useEffect(() => {
        if (id) {
            fetchEntry();
        }
    }, [id]);

    const fetchEntry = async () => {
        try {
            const { data } = await api.get(`/vault/${id}`);
            setFormData({
                title: data.title,
                category: data.category,
                content: data.content,
                isFavorite: data.isFavorite
            });
        } catch (err) {
            setError('Failed to fetch entry details');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (id) {
                await api.put(`/vault/${id}`, formData);
            } else {
                await api.post('/vault', formData);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save entry');
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="text-center mt-10 text-slate-400">Loading Entry...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                <FaArrowLeft /> Back to Dashboard
            </button>

            <div className="glass-card p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -z-10"></div>

                <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                    {id ? 'Edit Entry' : 'Create New Entry'}
                </h2>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-400 font-medium mb-2 text-sm">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                            placeholder="e.g. Gmail Password"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 font-medium mb-3 text-sm">Category</label>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'note', label: 'Note', icon: FaStickyNote },
                                { id: 'password', label: 'Password', icon: FaKey },
                                { id: 'secret', label: 'Secret', icon: FaShieldAlt }
                            ].map((cat) => (
                                <label key={cat.id} className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${formData.category === cat.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={cat.id}
                                        checked={formData.category === cat.id}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="sr-only"
                                    />
                                    <cat.icon size={20} />
                                    <span className="text-xs font-bold uppercase tracking-wide">{cat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-white/5">
                        <input
                            type="checkbox"
                            id="isFavorite"
                            checked={formData.isFavorite}
                            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-700"
                        />
                        <label htmlFor="isFavorite" className="text-slate-300 font-medium cursor-pointer select-none">Mark as Favorite</label>
                    </div>

                    <div>
                        <label className="block text-slate-400 font-medium mb-2 text-sm">
                            {formData.category === 'note' ? 'Secure Note Content' : 'Secret Value'}
                        </label>
                        {formData.category === 'note' ? (
                            <textarea
                                required
                                rows={6}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="input-field font-mono text-sm leading-relaxed"
                                placeholder="Enter your private note here..."
                            ></textarea>
                        ) : (
                            <input
                                type="text"
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="input-field font-mono"
                                placeholder="Enter password or secret"
                                autoComplete="off"
                            />
                        )}
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <FaShieldAlt className="text-blue-500" /> Content will be encrypted with AES-256-GCM before saving.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex justify-center items-center gap-2 py-4"
                    >
                        <FaSave /> {loading ? 'Encrypting & Saving...' : 'Save to Vault'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EntryForm;
