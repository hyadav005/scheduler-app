import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg shadow-gray-200/50">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gray-900 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="6" fill="#fff"/>
                                </svg>
                            </div>
                            <strong className="font-extrabold text-xl tracking-tight">Cal.com</strong>
                        </Link>
                        
                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-6">
                            {['Solutions', 'Enterprise', 'Cal.ai', 'Pricing'].map(item => (
                                <a key={item} href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wide">{item}</a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-4">
                            <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Admin Dashboard</Link>
                            <Link to="/event/1" className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition-all flex items-center gap-2">
                                Try it free <span className="text-lg">→</span>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="lg:hidden absolute top-20 left-4 right-4 bg-white border border-gray-100 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
                        <div className="flex flex-col gap-6">
                            {['Solutions', 'Enterprise', 'Cal.ai', 'Pricing'].map(item => (
                                <a key={item} href="#" className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">{item}</a>
                            ))}
                            <div className="flex flex-col gap-4 pt-4">
                                <Link to="/dashboard" className="text-lg font-bold text-blue-600">Admin Dashboard</Link>
                                <Link to="/event/1" className="w-full bg-gray-900 text-white py-4 rounded-2xl text-center font-bold">Get Started</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
