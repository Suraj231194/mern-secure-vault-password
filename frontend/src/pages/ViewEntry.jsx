import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FaArrowLeft, FaCopy, FaEye, FaEyeSlash, FaPen, FaClock, FaLock, FaCalendarAlt } from 'react-icons/fa';

const ViewEntry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchEntry();
        return () => clearInterval(timerRef.current);
    }, [id]);

    useEffect(() => {
        if (showPassword) {
            setTimeLeft(30);
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setShowPassword(false);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setTimeLeft(null);
        }
    }, [showPassword]);

    const fetchEntry = async () => {
        try {
            const { data } = await api.get(`/vault/${id}`);
            setEntry(data);
        } catch (err) {
            setError('Failed to retrieve entry or decryption failed.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (entry?.content) {
            navigator.clipboard.writeText(entry.content);
        }
    };

    if (loading) return <div className="text-center mt-20 text-slate-400 animate-pulse">Decrypting Entry...</div>;

    if (error) return (
        <div className="text-center mt-20">
            <div className="text-red-400 mb-4 bg-red-500/10 p-4 rounded-lg inline-block">{error}</div>
            <br />
            <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:text-white underline">Return to Dashboard</button>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <FaArrowLeft /> Back
                </button>
                <Link to={`/edit/${id}`} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                    <FaPen /> Edit Entry
                </Link>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -z-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-8">
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${entry.category === 'secret' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                entry.category === 'password' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                            {entry.category}
                        </span>
                        <h1 className="text-3xl font-bold text-white mb-2">{entry.title}</h1>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FaLock /> AES-256-GCM Encrypted</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="flex justify-between items-center p-4 bg-slate-800/50 border-b border-slate-700/50">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {entry.category === 'password' ? 'Password' : 'Decrypted Content'}
                        </h3>
                        {timeLeft && (
                            <div className="text-xs text-orange-400 flex items-center gap-1 font-bold bg-orange-500/10 px-2 py-1 rounded">
                                <FaClock /> Re-locking in {timeLeft}s
                            </div>
                        )}
                    </div>

                    <div className="p-6 relative">
                        {entry.category === 'password' || entry.category === 'secret' ? (
                            <div className="flex items-center justify-between gap-4">
                                <div className={`font-mono text-xl w-full truncate select-all ${showPassword ? 'text-white' : 'text-slate-500 tracking-widest'}`}>
                                    {showPassword ? entry.content : '••••••••••••••••••••••••'}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition tooltip"
                                        title={showPassword ? "Hide" : "Reveal"}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition shadow-lg shadow-blue-500/20"
                                        title="Copy"
                                    >
                                        <FaCopy size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="font-mono text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[150px]">
                                    {entry.content}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white transition"
                                    title="Copy"
                                >
                                    <FaCopy />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-600">
                        This content is decrypted locally in your browser memory. <br />
                        It is never stored in plaintext on our servers or your specific disk.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewEntry;
