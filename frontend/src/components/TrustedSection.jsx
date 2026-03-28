const TrustedSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-on-scroll">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">Trusted by fast-growing companies around the world</p>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <div className="flex gap-16 items-center whitespace-nowrap animate-marquee">
                    {['Supabase', 'Udemy', 'Rho', 'Deel', 'Framer', 'Ramp', 'Supabase', 'Udemy', 'Rho', 'Deel', 'Framer', 'Ramp'].map((brand, i) => (
                        <span key={i} className="text-2xl font-bold text-gray-300 hover:text-gray-900 transition-colors cursor-default">{brand}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedSection;
