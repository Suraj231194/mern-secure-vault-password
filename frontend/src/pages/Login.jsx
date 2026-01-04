import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaLock, FaArrowRight } from 'react-icons/fa';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = async (data) => {
        setServerError('');
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            if (err.response?.status === 429) {
                setServerError("Too many attempts. Please try again later.");
            } else {
                setServerError(err.response?.data?.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 overflow-hidden">
            {/* Left Side - Visual */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden"
            >
                <div className="absolute inset-0 bg-blue-600/10 z-0"></div>
                <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full z-0"></div>
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full z-0"></div>

                <div className="glass-card p-10 rounded-2xl max-w-lg z-10 border border-slate-700/50">
                    <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        SecureVault Architecture
                    </h2>
                    <div className="space-y-6 text-slate-300 font-mono text-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">1</span>
                            <p>PBKDF2 Key Derivation</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">2</span>
                            <p>AES-256-GCM Encryption</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">3</span>
                            <p>Zero-Knowledge Cloud Storage</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative"
            >
                <div className="max-w-md w-full">
                    <div className="mb-10 text-center lg:text-left">
                        <Link to="/" className="inline-block text-2xl font-bold text-blue-500 mb-6"><FaLock /> SecureVault</Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Enter your credentials to access your encrypted vault.</p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <span className="text-xl">!</span> {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                                className="input-field"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Master Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('password', { required: 'Password is required' })}
                                className="input-field"
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                            <div className="text-right mt-1">
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex justify-center items-center gap-2 py-4 text-base"
                        >
                            {isLoading ? 'Decrypting...' : <>Access Vault <FaArrowRight /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        New to SecureVault? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Create an account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
