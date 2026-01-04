import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUserPlus, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const password = watch('password', '');

    const onSubmit = async (data) => {
        setServerError('');
        setIsLoading(true);
        try {
            await registerUser(data.email, data.password);
            navigate('/dashboard');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed');
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
                className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden bg-slate-800"
            >
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1558494949-efdeb6bf80d1?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[150px] rounded-full z-0"></div>

                <div className="relative z-10 text-center max-w-lg">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl text-white mx-auto mb-8 shadow-2xl shadow-blue-500/50"
                    >
                        <FaShieldAlt />
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-6 text-white">Bank-Grade Security for Everyone</h2>
                    <p className="text-lg text-slate-400">
                        Join thousands of developers and professionals who trust SecureVault with their most sensitive data.
                    </p>
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
                    <div className="mb-8 text-center lg:text-left">
                        <Link to="/" className="inline-block text-2xl font-bold text-blue-500 mb-6 lg:hidden"><FaShieldAlt /> SecureVault</Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400">Setup your encrypted vault in seconds.</p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                className="input-field"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Master Password</label>
                            <input
                                type="password"
                                placeholder="Min 6 chars"
                                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                className="input-field"
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                {...register('confirmPassword', { validate: value => value === password || "Passwords differ" })}
                                className="input-field"
                            />
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex justify-center items-center gap-2 py-4 text-base"
                            >
                                {isLoading ? 'Generating Keys...' : <>Initialize Vault <FaArrowRight /></>}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Already have an vault? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
