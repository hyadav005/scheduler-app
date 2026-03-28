const Features = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-on-scroll">
            <div className="text-center mb-16">
                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 animate-on-scroll">Features</div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 animate-on-scroll">Everything you need to schedule better</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Large Card */}
                <div className="md:col-span-2 bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden relative min-h-[400px] hover:shadow-md transition-shadow animate-on-scroll group">
                    <div className="relative z-10 max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom booking links</h3>
                        <p className="text-gray-500 text-base leading-relaxed">Create personalized links that match your brand. Choose your timezone, set availability, and go.</p>
                    </div>
                    <div className="mt-auto h-48 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                        <div className="absolute bottom-8 left-8 bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl group-hover:-translate-y-2 transition-transform">cal.com/john</div>
                    </div>
                </div>
                
                {/* Small Card 1 */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden relative min-h-[400px] hover:shadow-md transition-shadow animate-on-scroll group">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Automated reminders</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Reduce no-shows with built-in emails, SMS messages, and WhatsApp reminders.</p>
                    </div>
                    <div className="mt-auto flex justify-center py-8">
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-xl">🔔</span>
                            Meeting in 10 mins
                        </div>
                    </div>
                </div>

                {/* Small Card 2 */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden relative min-h-[400px] hover:shadow-md transition-shadow animate-on-scroll group">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Team scheduling</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Round-robin, collective, and split availability types for advanced scheduling.</p>
                    </div>
                    <div className="mt-auto flex justify-center -space-x-6 py-12 relative overflow-visible">
                        {[
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80',
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                        ].map((src, i) => (
                            <img 
                                key={i} 
                                src={src} 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-2xl transition-all duration-500 hover:z-20 group-hover:-translate-y-4 group-hover:scale-110"
                                style={{ 
                                    transitionDelay: `${i * 100}ms`,
                                    transform: `rotate(${i * 5 - 5}deg)` 
                                }}
                                alt="User" 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
