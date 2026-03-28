import { useEffect } from 'react';

const Hero = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left animate-on-scroll">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm mb-6 animate-on-scroll">
                    <span className="text-sm font-medium text-gray-900">Cal.com launches v6.3 &gt;</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1] animate-on-scroll">
                    The better way to<br className="hidden lg:block" /> schedule your<br className="hidden lg:block" /> meetings
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-on-scroll">
                    A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto lg:mx-0 mb-4 animate-on-scroll">
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20'%3E%3Cpath fill='%23fff' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%23fff' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23fff' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23fff' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" alt="Google" /> Sign up with Google
                    </a>
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all">Sign up with email &gt;</a>
                </div>
                <p className="text-sm text-gray-500 animate-on-scroll">No credit card required</p>

                <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 animate-on-scroll">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-emerald-500 w-5 h-5 flex items-center justify-center rounded-sm">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                            ))}
                            <div className="bg-emerald-500/50 w-5 h-5 flex items-center justify-center rounded-sm overflow-hidden">
                                <div className="bg-emerald-500 w-1/2 h-full"></div>
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="#fff" className="absolute"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium flex items-center gap-1.5"><svg viewBox="0 0 24 24" width="16" height="16" fill="#00b67a"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Trustpilot</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full animate-on-scroll">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-2xl mx-auto">
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Sarah Smith" className="w-12 h-12 rounded-full mb-4" />
                        <p className="text-sm text-gray-500 font-medium mb-1">Dr. Sarah Smith</p>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Medical Appointment</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">Welcome to Sacred Hearth Hospital. Please pick a time for your appointment.</p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {[15, 30, 45, '1h'].map(dur => (
                                <span key={dur} className={`py-2 text-center rounded-lg text-sm border ${dur === '1h' ? 'bg-white border-gray-400 font-bold text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                    {dur === 15 && '⏱️ '}{dur}{typeof dur === 'number' && 'm'}
                                </span>
                            ))}
                        </div>
                        <div className="mt-auto space-y-3">
                            <div className="text-sm text-gray-500 flex items-center gap-2">📍 22 Street, Chicago</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 text-blue-600 font-medium">🌐 Asia/Singapore &or;</div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 bg-white">
                        <div className="flex items-center gap-2 mb-6 text-lg font-bold">May <span className="text-gray-400 font-normal">2025</span></div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                <div key={d} className="text-[10px] font-bold text-gray-400 mb-2">{d}</div>
                            ))}
                            {Array.from({ length: 3 }).map((_, i) => <div key={i}></div>)}
                            {Array.from({ length: 30 }).map((_, i) => {
                                const day = i + 1;
                                const isSelected = day === 27;
                                const isSpecial = day === 1 || day === 5 || day === 12 || day === 26;
                                return (
                                    <div key={day} className={`h-10 flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-gray-900 text-white' : isSpecial ? 'text-gray-900' : 'bg-gray-50 text-gray-400'}`}>
                                        {day}
                                        {day === 1 && <div className="w-1 h-1 rounded-full bg-gray-900 mt-0.5"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
