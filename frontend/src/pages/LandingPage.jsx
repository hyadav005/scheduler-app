import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedSection from '../components/TrustedSection';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import MoreFeatures from '../components/MoreFeatures';
import BottomCTA from '../components/BottomCTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  useEffect(() => {
    const observerOptions = {
        root: null,
        rootMargin: '150px 0px', // Trigger 150px before entering viewport
        threshold: 0.01
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => animateOnScroll.observe(el));

    const handleAddClick = (e) => {
        if (!e.target.matches('.add')) return;
        const originalSlot = e.target.previousElementSibling;
        if(!originalSlot) return;
        const newSlot = originalSlot.cloneNode(true);
        newSlot.textContent = "12:00 PM - 1:00 PM";
        newSlot.style.opacity = "0";
        newSlot.style.transform = "scale(0.9)";
        
        e.target.parentNode.insertBefore(newSlot, e.target);
        
        void newSlot.offsetWidth;
        
        newSlot.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        newSlot.style.opacity = "1";
        newSlot.style.transform = "scale(1)";
    };
    
    document.addEventListener('click', handleAddClick);

    return () => {
        animateOnScroll.disconnect();
        document.removeEventListener('click', handleAddClick);
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <TrustedSection />
      <HowItWorks />
      <Features />
      <MoreFeatures />
      <BottomCTA />
      <Footer />
    </>
  );
};

export default LandingPage;
