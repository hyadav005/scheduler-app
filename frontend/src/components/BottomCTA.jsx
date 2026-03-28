const BottomCTA = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-on-scroll">
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Visual Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-10 tracking-tight">Smarter, simpler scheduling</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                        <a href="#" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                            Get started <span className="text-xl">→</span>
                        </a>
                        <a href="#" className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            Talk to sales <span className="text-xl">→</span>
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-400 font-medium">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-amber-400">★</span>)}
                        </div>
                        <span className="text-sm">1st Product of the day</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BottomCTA;
