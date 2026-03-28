import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../api';

const BookingPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Date object
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [is24Hour, setIs24Hour] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', email: '' });
  const [booking, setBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [answers, setAnswers] = useState({});

  // Helper: check if a date has an override
  const getOverrideForDate = (date) => {
    if (!event?.dateOverrides) return null;
    const dateStr = date.toISOString().split('T')[0];
    return event.dateOverrides.find(ov => {
      const ovDate = new Date(ov.date).toISOString().split('T')[0];
      return ovDate === dateStr;
    });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const events = await apiService.getEvents();
        const eventData = events.find(e => e.slug === slug);
        setEvent(eventData);
        
        // Initialize answers state with empty strings for all custom questions
        if (eventData?.questions) {
          const initialAnswers = {};
          eventData.questions.forEach(q => {
            initialAnswers[q.id] = '';
          });
          setAnswers(initialAnswers);
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const handleDateSelect = async (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(date);
    setSelectedTime('');

    if (event) {
      try {
        const slots = await apiService.getSlots(event.id, dateStr);
        setAvailableSlots(Array.isArray(slots) ? slots : []);
      } catch (error) {
        setAvailableSlots([]);
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !event) return;
    setBooking(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await apiService.createBooking({
        eventId: event.id,
        name: bookingData.name,
        email: bookingData.email,
        date: dateStr,
        time: selectedTime,
        timezone: event.timezone,
        answers: event.questions.reduce((acc, q) => {
          acc[q.label] = answers[q.id];
          return acc;
        }, {})
      });
      setConfirmedBooking(res);
      setShowBookingForm(false);
    } catch (error) {
      alert('Failed to create booking.');
    } finally {
      setBooking(false);
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });

    return (
      <div className="flex-[1.5] p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-lg font-bold text-gray-900">{monthName} {year}</h3>
          <div className="flex gap-2">
             <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">‹</button>
             <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-4">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            if (!date) return <div key={idx} />;
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isPast = date < new Date(new Date().setHours(0,0,0,0));
            const override = getOverrideForDate(date);
            const isBlocked = override?.isBlocked === true;
            const hasCustomHours = override && !override.isBlocked;
            
            return (
              <button
                key={idx}
                disabled={isPast || isBlocked}
                onClick={() => handleDateSelect(date)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all group
                  ${isSelected ? 'bg-gray-900 text-white shadow-xl scale-105 z-10' : (isToday ? 'bg-gray-50 text-gray-900 font-black' : 'hover:bg-gray-50 text-gray-600')}
                  ${isPast ? 'opacity-20 cursor-default grayscale' : ''}
                  ${isBlocked ? 'opacity-30 cursor-not-allowed line-through' : 'cursor-pointer'}
                  ${hasCustomHours && !isSelected ? 'ring-2 ring-amber-300 ring-inset' : ''}
                `}
              >
                <span className="text-sm font-bold">{date.getDate()}</span>
                {isToday && !isSelected && (
                    <div className="absolute bottom-2 w-1 h-1 bg-gray-900 rounded-full animate-pulse"></div>
                )}
                {isBlocked && !isSelected && (
                    <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                )}
                {hasCustomHours && !isSelected && (
                    <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
        <span className="text-6xl">🗓️⁈</span>
        <h1 className="text-2xl font-black text-gray-900">Event not found</h1>
        <Link to="/" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:scale-105 transition-transform">Return Home</Link>
    </div>
  );

  if (confirmedBooking) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans selection:bg-gray-900 selection:text-white pb-20">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white p-10 lg:p-16 rounded-[3rem] border border-gray-100 shadow-2xl text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-3xl animate-bounce">✓</div>
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">This meeting is scheduled</h1>
            <p className="text-gray-500 mb-12 font-medium">A calendar invitation has been sent to your email with the link.</p>
            
            <div className="bg-gray-50 rounded-[2rem] p-8 text-left space-y-6 mb-12 border border-gray-100/50">
              <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl border border-gray-100">📅</span>
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</p>
                      <p className="font-bold text-gray-900">{selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })} at {selectedTime}</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl border border-gray-100">🌍</span>
                  <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timezone</p>
                      <p className="font-bold text-gray-900">{event.timezone}</p>
                  </div>
              </div>
            </div>
            
            <button onClick={() => window.location.href = '/'} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 cursor-pointer">Done</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-gray-900 selection:text-white pb-32">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-24">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-[700px]">
          
          {/* Sidebar */}
          <div className="lg:w-[360px] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-50 bg-white relative">
            <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all mb-12">‹</Link>
            
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=Admin&background=000&color=fff`} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="Host" />
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Host</p>
                        <p className="font-bold text-gray-900">Admin User</p>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-[1.1] mb-4">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">🕒 {event.duration}m</div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg">📹 Zoom</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                        <span className="text-lg">🌐</span>
                        {event.timezone}
                    </div>
                    {event.description && (
                         <div className="text-sm font-medium text-gray-400 leading-relaxed border-t border-gray-50 pt-4">
                            {event.description}
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Calendar */}
          {renderCalendar()}

          {/* Time Slots */}
          <div className="lg:w-[320px] p-8 lg:p-10 flex flex-col bg-white">
            <div className="mb-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Slots</p>
                <h3 className="text-lg font-bold text-gray-900">
                    {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Select a date'}
                </h3>
            </div>

            <div className="flex-1 pr-2 overflow-y-auto max-h-[480px] custom-scrollbar">
              {!selectedDate ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 min-h-[300px]">
                    <span className="text-3xl mb-4">🗓️</span>
                    <p className="text-xs font-bold uppercase tracking-wider">Choose a date<br/>to see availability</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 min-h-[300px]">
                    <span className="text-3xl mb-4">💤</span>
                    <p className="text-xs font-bold uppercase tracking-wider">No sessions<br/>available today</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`
                        w-full py-4 rounded-2xl font-bold text-sm transition-all border-2
                        ${selectedTime === slot ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-600 hover:border-gray-900 hover:text-gray-900'}
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedTime && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-300">
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:scale-[1.02]"
                >
                  Schedule Next
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Built with Cal.com</p>
        </div>
      </main>

      {/* Booking Form Overlay */}
      {showBookingForm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowBookingForm(false)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 lg:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your details</h2>
                <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 flex items-center gap-4">
                    <span className="text-2xl">⚡</span>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking at</p>
                        <p className="font-bold text-gray-900 text-sm">
                            {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} — {selectedTime}
                        </p>
                    </div>
                </div>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input type="text" required value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-gray-100 outline-none font-bold text-gray-900" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input type="email" required value={bookingData.email} onChange={e => setBookingData({...bookingData, email: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-gray-100 outline-none font-bold text-gray-900" placeholder="john@example.com" />
                    </div>

                    {/* DYNAMIC CUSTOM QUESTIONS */}
                    {event.questions?.map(q => (
                        <div key={q.id} className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                {q.label}
                                {q.required && <span className="text-red-500">*</span>}
                            </label>
                            {q.type === 'textarea' ? (
                                <textarea
                                    required={q.required}
                                    value={answers[q.id] || ''}
                                    onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                                    placeholder={q.placeholder || ""}
                                    rows="3"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-gray-100 outline-none font-bold text-gray-900 resize-none"
                                />
                            ) : (
                                <input 
                                    type="text" 
                                    required={q.required} 
                                    value={answers[q.id] || ''} 
                                    onChange={e => setAnswers({...answers, [q.id]: e.target.value})} 
                                    placeholder={q.placeholder || ""}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-gray-100 outline-none font-bold text-gray-900" 
                                />
                            )}
                        </div>
                    ))}
                    
                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={booking} className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-xl shadow-gray-200">
                            {booking ? 'Scheduling...' : 'Confirm'}
                        </button>
                        <button type="button" onClick={() => setShowBookingForm(false)} className="px-8 py-5 border border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookingPage;
