import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaUserSecret, FaGlobe, FaServer, FaCheckCircle, FaLaptopCode, FaFingerprint } from 'react-icons/fa';

const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen overflow-x-hidden">
            {/* 1. Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-blue-500">
                        <FaShieldAlt className="text-3xl" /> SecureVault
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link to="/login" className="text-slate-300 hover:text-white font-medium transition">Log In</Link>
                        <Link to="/signup" className="btn-primary py-2 px-4 shadow-blue-500/20">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.span variants={itemVariants} className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                            Production-Grade Security
                        </motion.span>
                        <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                            Fort Knox for your <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Digital Secrets</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Zero-knowledge architecture means we can't see your data even if we tried.
                            Store notes, passwords, and secrets with AES-256-GCM encryption.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/signup" className="btn-primary text-lg px-8">Start Securing Now</Link>
                            <Link to="#features" className="btn-secondary text-lg px-8 bg-transparent hover:bg-slate-800">Learn Architecture</Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Social Proof (Mock) */}
            <section className="py-10 border-y border-white/5 bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <p className="text-center text-slate-500 text-sm uppercase tracking-widest mb-8 font-semibold">Trusted Security Standards</p>
                    <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-xl font-bold"><FaLock /> OWASP</div>
                        <div className="flex items-center gap-2 text-xl font-bold"><FaGlobe /> NIST</div>
                        <div className="flex items-center gap-2 text-xl font-bold"><FaCheckCircle /> GDPA</div>
                        <div className="flex items-center gap-2 text-xl font-bold"><FaFingerprint /> SOC2</div>
                    </div>
                </div>
            </section>

            {/* 4. Features Grid */}
            <section id="features" className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Defense in Depth</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">We don't just encrypt your data. We ensure every layer of the interaction is secured against modern threats.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: FaUserSecret, title: "Client-Side Privacy", desc: "Data is decrypted only in your browser memory. We never see the plaintext." },
                            { icon: FaLock, title: "AES-256-GCM", desc: "Military-grade authenticated encryption ensures data integrity and confidentiality." },
                            { icon: FaServer, title: "Zero Persistence", desc: "We don't cache secrets. Once you close the tab, the decrypted data is gone." },
                            { icon: FaFingerprint, title: "Audit Logging", desc: "Track every access attempt. Know exactly when and where your vault was accessed." },
                            { icon: FaGlobe, title: "Secure Headers", desc: "Protected against XSS and injection attacks with strict Content Security Policies." },
                            { icon: FaLaptopCode, title: "Developer API", desc: "Integrate secrets into your workflow with our secure REST API." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="glass-card p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-6 text-2xl">
                                    <feature.icon />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Architecture Diagram (CSS Visual) */}
            <section className="py-24 bg-slate-800/30">
                <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">How It Works</h2>
                        <ul className="space-y-6">
                            {[
                                { step: "01", title: "Key Derivation", text: "We generate a unique salt for you. Your master password never leaves your device in a reversible format." },
                                { step: "02", title: "Encryption", text: "Data is encrypted with a unique IV and Auth Tag for every single entry." },
                                { step: "03", title: "Secure Storage", text: "Only the encrypted blob is sent to our MongoDB servers. Not even our admins can read it." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="text-blue-500 font-mono text-xl font-bold">{item.step}</span>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                        <p className="text-slate-400">{item.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:w-1/2 relative">
                        {/* Abstract Code/Security Visual */}
                        <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl font-mono text-xs text-blue-300">
                            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <p className="text-green-400">// Client-Side Encryption Flow</p>
                            <p className="mt-2"><span className="text-purple-400">const</span> key = <span className="text-yellow-300">deriveKey</span>(userSecret, salt);</p>
                            <p className="mt-1"><span className="text-purple-400">const</span> encrypted = <span className="text-yellow-300">aes256gcm</span>(content, key);</p>
                            <p className="mt-2 text-slate-500">/* Result sent to server */</p>
                            <p className="mt-1">{`{`}</p>
                            <p className="pl-4">"iv": "a3f1...",</p>
                            <p className="pl-4">"payload": "89c2... <span className="text-slate-600">// Garbage to us</span>",</p>
                            <p className="pl-4">"tag": "e1b9..."</p>
                            <p>{`}`}</p>
                        </div>
                        <div className="absolute top-10 -right-10 w-full h-full border-2 border-blue-500/20 rounded-xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* 6. Use Cases */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Who needs SecureVault?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Software Engineers", "Legal Teams", "Cryptocurrency Owners", "Journalists", "Enterprises"].map((tag, i) => (
                            <span key={i} className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CTA / Pricing Mock */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Open Source & Secure</h2>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        Start securing your digital life today. No credit card required.
                        Just pure, open-source security engineering.
                    </p>
                    <Link to="/signup" className="btn-primary text-xl px-10 py-4 shadow-2xl shadow-blue-500/30">
                        Create Free Vault
                    </Link>
                    <p className="mt-6 text-sm text-slate-500">Free forever for developers.</p>
                </div>
            </section>

            {/* 8. Footer */}
            <footer className="py-12 border-t border-white/5 bg-slate-900">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-60">
                    <div className="flex items-center gap-2 font-bold mb-4 md:mb-0">
                        <FaShieldAlt /> SecureVault
                    </div>
                    <div className="text-sm">
                        &copy; {new Date().getFullYear()} SecureVault Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
