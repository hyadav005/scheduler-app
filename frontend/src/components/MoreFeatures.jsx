import React from 'react';

const MoreFeatures = () => {
    const extraFeatures = [
        { icon: '💳', title: 'Accept payments', description: 'Monetize your bookings through Stripe.' },
        { icon: '🎥', title: 'Built-in video conferencing', description: 'Google Meet, Zoom, and Cal Video.' },
        { icon: '🔗', title: 'Short booking links', description: 'Customizable and brandable extensions.' },
        { icon: '🛡️', title: 'Privacy first', description: 'GDPR/CCPA compliant data handling.' },
        { icon: '🌍', title: '65+ languages', description: 'Localized booking for global teams.' },
        { icon: '🧩', title: 'Easy embeds', description: 'Add your calendar to any website.' },
        { icon: '📱', title: 'All your favorite apps', description: 'Sync with 50+ third-party tools.' },
        { icon: '🎨', title: 'Simple customization', description: 'Match your brand\'s look and feel.' }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-on-scroll">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">...and so much more!</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {extraFeatures.map((item, i) => (
                    <div 
                        key={i} 
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-on-scroll cursor-pointer group"
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl group-hover:bg-gray-100 transition-colors shadow-inner">
                            {item.icon}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-md leading-snug">{item.title}</h3>
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium hidden md:block">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MoreFeatures;
