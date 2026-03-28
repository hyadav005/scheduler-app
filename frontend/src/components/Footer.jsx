const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12">
                <div className="col-span-2">
                    <a href="#" className="flex items-center gap-2 mb-6">
                        <div className="bg-gray-900 p-1.5 rounded-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="6" fill="#fff"/>
                            </svg>
                        </div>
                        <strong className="font-extrabold text-xl tracking-tight">Cal.com</strong>
                    </a>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">Cal.com® and Cal® are registered trademarks. Our mission is to connect a billion people by 2031 through calendar scheduling.</p>
                    <div className="flex gap-2 mb-8">
                        {['ISO 27001', 'SOC 2', 'GDPR'].map(badge => (
                            <span key={badge} className="text-[10px] font-bold border border-gray-200 px-2 py-1 rounded bg-white text-gray-600">{badge}</span>
                        ))}
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-semibold text-gray-600 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All Systems Operational
                    </div>
                </div>
                
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Solutions</h4>
                    {['iOS/Android App', 'Self-hosted', 'Pricing', 'Docs', 'Cal.ai'].map(link => (
                        <a key={link} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Use Cases</h4>
                    {['Sales', 'Marketing', 'Talent Acquisition', 'Higher Education'].map(link => (
                        <a key={link} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Resources</h4>
                    {['Help Docs', 'Blog', 'Teams', 'Embed'].map(link => (
                        <a key={link} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Company</h4>
                    {['Jobs', 'About', 'Support', 'Privacy', 'Terms'].map(link => (
                        <a key={link} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">© 2025 Cal.com, Inc. Built with love by the open-source community.</p>
            </div>
        </footer>
    );
};

export default Footer;
