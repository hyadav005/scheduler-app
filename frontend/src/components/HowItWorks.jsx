const HowItWorks = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-on-scroll">
            <div className="text-center mb-16">
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 animate-on-scroll">Workflow</div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 animate-on-scroll">Simple. Seamless. Scheduled.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 01 */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow animate-on-scroll">
                    <div className="text-4xl font-black text-gray-100 mb-6">01</div>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Connect your calendar</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">We'll handle all the cross-referencing, so you don't have to worry about double bookings.</p>
                    </div>
                    <div className="mt-auto relative h-48 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                        <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center font-bold text-xs z-10">Cal.com</div>
                        <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
                            <div className="absolute top-4 left-1/2 -ml-3 w-6 h-6 bg-white shadow-md rounded-lg flex items-center justify-center text-[10px]">🗓️</div>
                            <div className="absolute bottom-4 left-1/2 -ml-3 w-6 h-6 bg-white shadow-md rounded-lg flex items-center justify-center text-[10px]">🍎</div>
                            <div className="absolute left-4 top-1/2 -mt-3 w-6 h-6 bg-white shadow-md rounded-lg flex items-center justify-center text-[10px]">📧</div>
                        </div>
                    </div>
                </div>

                {/* Step 02 */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow animate-on-scroll">
                    <div className="text-4xl font-black text-gray-100 mb-6">02</div>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Set your availability</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Want to block off weekends? Set up any buffers? We make that easy.</p>
                    </div>
                    <div className="mt-auto h-48 bg-gray-50 rounded-xl p-4 flex flex-col gap-2 overflow-hidden">
                        {[
                            { day: 'Mon', time: '9:00am - 5:00pm', on: true },
                            { day: 'Tue', time: '9:00am - 6:30pm', on: true, active: true },
                            { day: 'Wed', time: 'Unavailable', on: false }
                        ].map((row, i) => (
                            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${row.active ? 'bg-white border-gray-200 shadow-sm' : 'border-transparent'}`}>
                                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${row.on ? 'bg-gray-900' : 'bg-gray-200'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${row.on ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-700 w-8">{row.day}</span>
                                <span className={`text-[10px] ${row.on ? 'text-gray-500' : 'text-gray-300'}`}>{row.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 03 */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow animate-on-scroll">
                    <div className="text-4xl font-black text-gray-100 mb-6">03</div>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Choose how to meet</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">It could be a video chat, phone call, or a walk in the park! You're in control.</p>
                    </div>
                    <div className="mt-auto h-48 bg-gray-900 rounded-xl p-3 flex flex-col gap-2 overflow-hidden shadow-inner">
                        <div className="flex gap-1 mb-1">
                            <div className="w-1 h-1 rounded-full bg-red-500"></div>
                            <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
                            <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-gray-800 rounded-lg"></div>
                            <div className="bg-gray-700 rounded-lg"></div>
                        </div>
                        <div className="flex justify-center gap-2 mt-auto">
                            <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700"></div>
                            <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700"></div>
                            <div className="w-6 h-6 rounded-full bg-red-900/50 border border-red-900"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
