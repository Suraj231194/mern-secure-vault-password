import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStickyNote, FaKey, FaSearch, FaTrash, FaPen, FaShieldAlt, FaStar, FaRegStar, FaFolderOpen, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [vaults, setVaults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const isFavoriteFilter = searchParams.get('isFavorite') === 'true';

    useEffect(() => {
        fetchVaults();
    }, [page, searchTerm, categoryFilter, isFavoriteFilter]);

    const fetchVaults = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 9,
                search: searchTerm,
                category: categoryFilter,
                isFavorite: isFavoriteFilter
            };
            const { data } = await api.get('/vault', { params });
            setVaults(data.vaults);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await api.delete(`/vault/${id}`);
                fetchVaults();
            } catch (err) {
                alert('Failed to delete item');
            }
        }
    };

    const handleToggleFavorite = async (e, item) => {
        e.preventDefault();
        try {
            const updatedVaults = vaults.map(v =>
                v._id === item._id ? { ...v, isFavorite: !v.isFavorite } : v
            );
            setVaults(updatedVaults);
            await api.put(`/vault/${item._id}`, { isFavorite: !item.isFavorite });
        } catch (err) {
            fetchVaults();
        }
    };

    const updateSearch = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', 1);
        setSearchParams(newParams);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'password': return <FaKey />;
            case 'secret': return <FaShieldAlt />;
            default: return <FaStickyNote />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'password': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'secret': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">My Vault</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your secure items safely.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search vault..."
                            value={searchTerm}
                            onChange={(e) => updateSearch('search', e.target.value)}
                            className="input-field pl-10 py-2 w-full sm:w-64"
                        />
                        <FaSearch className="absolute left-3 top-3 text-slate-500" />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => updateSearch('category', e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="note">Notes</option>
                        <option value="password">Passwords</option>
                        <option value="secret">Secrets</option>
                    </select>

                    <button
                        onClick={() => updateSearch('isFavorite', isFavoriteFilter ? '' : 'true')}
                        className={`border rounded-lg px-4 py-2 flex items-center gap-2 transition-all ${isFavoriteFilter ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {isFavoriteFilter ? <FaStar /> : <FaRegStar />}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-2xl bg-slate-800/50 animate-pulse border border-white/5"></div>
                    ))}
                </div>
            ) : vaults.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 text-3xl mx-auto mb-4">
                        <FaFolderOpen />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2">It's quiet here...</h3>
                    <p className="text-slate-500 mb-6">Start by adding your first secure note or password.</p>
                    <Link to="/add" className="btn-primary inline-flex items-center gap-2">
                        <FaPlus /> Create Entry
                    </Link>
                </div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    >
                        <AnimatePresence>
                            {vaults.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={item._id}
                                    className="glass-card p-6 rounded-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                        <Link to={`/edit/${item._id}`} className="p-2 bg-slate-800 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition">
                                            <FaPen size={12} />
                                        </Link>
                                        <button onClick={() => handleDelete(item._id, item.title)} className="p-2 bg-slate-800 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition">
                                            <FaTrash size={12} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${getColor(item.category)}`}>
                                            {getIcon(item.category)}
                                        </div>
                                        <button onClick={(e) => handleToggleFavorite(e, item)} className="text-slate-600 hover:text-amber-400 transition text-xl">
                                            {item.isFavorite ? <FaStar className="text-amber-400" /> : <FaRegStar />}
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-100 mb-1 truncate pr-8" title={item.title}>
                                        {item.title}
                                    </h3>
                                    <div className="text-xs text-slate-500 mb-6 uppercase tracking-wider font-semibold">
                                        {item.category}
                                    </div>

                                    <Link
                                        to={`/view/${item._id}`}
                                        className="block w-full text-center py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm font-medium border border-slate-700"
                                    >
                                        View Content
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => updateSearch('page', pageNum)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
