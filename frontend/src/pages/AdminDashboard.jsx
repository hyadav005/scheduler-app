import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiService } from '../api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    slug: '',
    timezone: 'Asia/Kolkata'
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const formRef = useRef(null);

  // Date Override State
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideData, setOverrideData] = useState({
    date: '',
    isBlocked: false,
    startTime: '09:00',
    endTime: '17:00'
  });

  // Booking Questions State
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionData, setQuestionData] = useState({
    label: '',
    type: 'text',
    placeholder: '',
    required: true
  });
  
  // Custom Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'danger', 'success'
    confirmText: 'OK',
    onConfirm: null,
    onCancel: null
  });

  const showModal = (config) => {
    setModal({
      isOpen: true,
      title: config.title || 'Notification',
      message: config.message || '',
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
      onConfirm: config.onConfirm || (() => setModal(prev => ({ ...prev, isOpen: false }))),
      onCancel: config.onCancel || (() => setModal(prev => ({ ...prev, isOpen: false })))
    });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const eventsData = await apiService.getEvents();
        const bookingsData = await apiService.getBookings();
        setEvents(eventsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreating(true);

    const payload = {
      ...formData,
      slug: formData.slug.trim(), // Trim leading/trailing spaces
      duration: parseInt(formData.duration) // Ensure duration is a number
    };

    try {
       const newEvent = await apiService.createEvent(payload);
      setEvents(prev => [...prev, newEvent]);
      setFormData({ title: '', description: '', duration: 60, slug: '', timezone: 'Asia/Kolkata' });
      setShowCreateForm(false);
      showModal({ 
        title: 'Event Created', 
        message: 'Your new event type has been successfully created.',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create event. Please ensure the slug is unique.';
      showModal({ 
        title: 'Error', 
        message: errorMsg,
        type: 'danger'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      await apiService.createAvailability({
        eventId: selectedEvent.id,
        day: availabilityData.day,
        startTime: availabilityData.startTime,
        endTime: availabilityData.endTime
      });
      
      // Refresh events data
      const eventsData = await apiService.getEvents();
       setEvents(eventsData);
      setSelectedEvent(eventsData.find(e => e.id === selectedEvent.id));
      
      setAvailabilityData({ day: 'Monday', startTime: '09:00', endTime: '17:00' });
      setShowAvailabilityForm(false);
      showModal({ 
        title: 'Availability Added', 
        message: 'Your availability has been updated for this event.',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to add availability:', error);
      showModal({ title: 'Error', message: 'Failed to add availability', type: 'danger' });
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      duration: event.duration,
      slug: event.slug,
      timezone: event.timezone || 'Asia/Kolkata'
    });
    setShowCreateForm(true);
    
    // Enhanced Smooth Scroll with Offset (Account for Fixed Navbar)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteAvailability = async (id) => {
    try {
      await apiService.deleteAvailability(id);
      const updatedEvents = await apiService.getEvents();
      setEvents(updatedEvents);
      const updatedSelected = updatedEvents.find(e => e.id === selectedEvent.id);
      setSelectedEvent(updatedSelected);
    } catch (error) {
      console.error("Failed to delete availability:", error);
    }
  };

  // --- DATE OVERRIDE HANDLERS ---
  const handleAddOverride = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !overrideData.date) return;

    try {
      await apiService.createDateOverride({
        eventId: selectedEvent.id,
        date: overrideData.date,
        isBlocked: overrideData.isBlocked,
        startTime: overrideData.isBlocked ? null : overrideData.startTime,
        endTime: overrideData.isBlocked ? null : overrideData.endTime,
      });

      const updatedEvents = await apiService.getEvents();
      setEvents(updatedEvents);
      setSelectedEvent(updatedEvents.find(ev => ev.id === selectedEvent.id));
      setOverrideData({ date: '', isBlocked: false, startTime: '09:00', endTime: '17:00' });
      setShowOverrideForm(false);
      showModal({ title: 'Override Added', message: 'Date override has been saved successfully.', type: 'success' });
    } catch (error) {
      console.error('Failed to add override:', error);
      showModal({ title: 'Error', message: 'Failed to add date override.', type: 'danger' });
    }
  };

  const handleDeleteOverride = async (id) => {
    try {
      await apiService.deleteDateOverride(id);
      const updatedEvents = await apiService.getEvents();
      setEvents(updatedEvents);
      setSelectedEvent(updatedEvents.find(ev => ev.id === selectedEvent.id));
    } catch (error) {
      console.error('Failed to delete override:', error);
    }
  };

  // --- BOOKING QUESTIONS HANDLERS ---
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !questionData.label) return;

    try {
      await apiService.createQuestion(selectedEvent.id, questionData);
      
      const updatedEvents = await apiService.getEvents();
      setEvents(updatedEvents);
      setSelectedEvent(updatedEvents.find(ev => ev.id === selectedEvent.id));
      
      setQuestionData({ label: '', type: 'text', placeholder: '', required: true });
      setShowQuestionForm(false);
      showModal({ title: 'Success', message: 'Booking question added!', type: 'success' });
    } catch (error) {
      console.error('Failed to add question:', error);
      showModal({ title: 'Error', message: 'Failed to add question.', type: 'danger' });
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await apiService.deleteQuestion(id);
      const updatedEvents = await apiService.getEvents();
      setEvents(updatedEvents);
      setSelectedEvent(updatedEvents.find(ev => ev.id === selectedEvent.id));
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    setCreating(true);
    const payload = {
      ...formData,
      slug: formData.slug.trim(), // Trim leading/trailing spaces
      duration: parseInt(formData.duration) // Ensure duration is a number
    };

    try {
      const updatedEvent = await apiService.updateEvent(editingEvent.id, payload);
       setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updatedEvent : ev));
      setFormData({ title: '', description: '', duration: 60, slug: '', timezone: 'Asia/Kolkata' });
      setShowCreateForm(false);
      setEditingEvent(null);
      showModal({ title: 'Success', message: 'Event updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to update event:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update event';
      showModal({ title: 'Error', message: errorMsg, type: 'danger' });
    } finally {
      setCreating(false);
    }
  };

   const handleDeleteEvent = async (eventId) => {
    showModal({
      title: 'Delete Event?',
      message: 'Are you sure you want to delete this event? This will also delete all associated availabilities and bookings. This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete Event',
      onConfirm: async () => {
        closeModal();
        setDeletingEvent(eventId);
        try {
          await apiService.deleteEvent(eventId);
          setEvents(prev => prev.filter(ev => ev.id !== eventId));
          showModal({ title: 'Deleted', message: 'Event deleted successfully!', type: 'success' });
        } catch (error) {
          console.error('Failed to delete event:', error);
          showModal({ title: 'Error', message: error.response?.data?.error || 'Failed to delete event', type: 'danger' });
        } finally {
          setDeletingEvent(null);
        }
      }
    });
  };

   const handleCancelEdit = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', duration: 60, slug: '', timezone: 'Asia/Kolkata' });
    setShowCreateForm(false);
  };

   const handleCancelBooking = async (bookingId) => {
    showModal({
      title: 'Cancel Booking?',
      message: 'Are you sure you want to cancel this booking?',
      type: 'danger',
      confirmText: 'Cancel Booking',
      onConfirm: async () => {
        closeModal();
        setCancellingBooking(bookingId);
        try {
          await apiService.cancelBooking(bookingId);
          setBookings(prev => prev.filter(b => b.id !== bookingId));
          showModal({ title: 'Cancelled', message: 'Booking has been successfully cancelled.', type: 'success' });
        } catch (error) {
          console.error('Failed to cancel booking:', error);
          showModal({ title: 'Error', message: 'Failed to cancel booking. Please try again.', type: 'danger' });
        } finally {
          setCancellingBooking(null);
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 min-h-screen">
        <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">Welcome to your command center. Manage your events, availability, and bookings all in one place.</p>
        </header>
        
        <div className="flex justify-start mb-12">
           <button 
            onClick={() => {
              setEditingEvent(null);
              setFormData({ title: '', description: '', duration: 60, slug: '', timezone: 'Asia/Kolkata' });
              setShowCreateForm(!showCreateForm);
            }}
            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-sm transition-all flex items-center gap-2 ${showCreateForm ? 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            {showCreateForm ? 'Cancel' : (
                <>
                    <span className="text-xl">+</span> Create New Event
                </>
            )}
          </button>
        </div>

        {showCreateForm && (
          <div ref={formRef} className="bg-white p-8 rounded-3xl border-2 border-gray-900 shadow-xl mb-12 transform animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{editingEvent ? 'Edit Event Type' : 'Create New Event Type'}</h2>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium"
                    placeholder="e.g., 15min Discovery Call"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">URL Slug</label>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium hidden sm:block">cal.com/</span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium"
                        placeholder="my-event-link"
                      />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Default Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium bg-white"
                  >
                    {[
                      { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT+05:30)' },
                      { value: 'Europe/London', label: 'Europe/London (GMT+00:00)' },
                      { value: 'America/New_York', label: 'America/New_York (GMT-05:00)' },
                      { value: 'UTC', label: 'UTC (GMT+00:00)' },
                    ].map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-900 transition-all outline-none text-gray-900 font-medium resize-none"
                    placeholder="Help your guests understand what this meeting is about..."
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="submit"
                  disabled={creating}
                  className="flex-1 sm:flex-none px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-300 transition-all"
                >
                  {creating ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-10 py-4 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {loading ? (
            <div className="flex items-center justify-center p-20 text-gray-400 font-medium animate-pulse">
                Loading your commands...
            </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Column 1: Events List */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  My Events
                  <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">{events.length}</span>
              </h2>
              {events.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center">
                    <p className="text-gray-400 font-medium">No events created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map(ev => (
                    <div key={ev.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{ev.title}</h3>
                          <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                              <span>⏱️ {ev.duration}m</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">🌐 {ev.timezone}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditEvent(ev)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all text-sm">✏️ Edit</button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Booking Link</p>
                          <p className="text-xs font-mono text-gray-500 truncate">{window.location.origin}/event/{ev.slug}</p>
                      </div>

                      <div className="flex gap-3">
                          <Link to={`/event/${ev.slug}`} className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl text-center text-xs font-bold hover:bg-gray-200 transition-all">Preview</Link>
                          <button 
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/event/${ev.slug}`)}
                            className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                          >
                              Copy
                          </button>
                      </div>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="w-full mt-4 py-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors">Delete Event</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Availability & Overrides */}
            <div className="lg:col-span-4 space-y-10">
               {/* Availability Management */}
               <div className="space-y-6">
                  <h2 className="text-xl font-black text-gray-900">Availability</h2>
                  
                  <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Select Event</label>
                      <select
                        value={selectedEvent?.id || ''}
                        onChange={(e) => {
                          const event = events.find(ev => ev.id === parseInt(e.target.value));
                          setSelectedEvent(event);
                        }}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-gray-900 mb-8"
                      >
                        <option value="">Choose an event type...</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                      </select>

                      {selectedEvent ? (
                        <div className="space-y-8">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Rules</p>
                                {selectedEvent.availabilities?.length > 0 ? (
                                    <div className="space-y-4">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                            const rules = selectedEvent.availabilities.filter(av => av.day === day);
                                            if (rules.length === 0) return null;
                                            return (
                                                <div key={day} className="bg-gray-50 rounded-2xl p-5">
                                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{day}</h4>
                                                    <div className="space-y-2">
                                                        {rules.map(av => (
                                                            <div key={av.id} className="flex items-center justify-between bg-white border border-gray-100 px-4 py-3 rounded-xl group transition-all hover:border-blue-200">
                                                                <span className="text-sm font-bold text-gray-700">{av.startTime} - {av.endTime}</span>
                                                                <button 
                                                                    onClick={() => handleDeleteAvailability(av.id)}
                                                                    className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : <p className="text-sm text-gray-400 font-medium italic">No rules defined yet.</p>}
                            </div>

                            <button 
                                onClick={() => setShowAvailabilityForm(!showAvailabilityForm)}
                                className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-all"
                            >
                                {showAvailabilityForm ? 'Close Form' : '+ Add New Rule'}
                            </button>

                            {showAvailabilityForm && (
                              <form onSubmit={handleAddAvailability} className="p-6 bg-gray-900 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
                                    <select
                                        value={availabilityData.day}
                                        onChange={(e) => setAvailabilityData(prev => ({ ...prev, day: e.target.value }))}
                                        className="w-full bg-gray-800 text-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="time"
                                            value={availabilityData.startTime}
                                            onChange={(e) => setAvailabilityData(prev => ({ ...prev, startTime: e.target.value }))}
                                            className="bg-gray-800 text-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            type="time"
                                            value={availabilityData.endTime}
                                            onChange={(e) => setAvailabilityData(prev => ({ ...prev, endTime: e.target.value }))}
                                            className="bg-gray-800 text-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all">Add Rule</button>
                              </form>
                            )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <span className="text-3xl mb-4">📅</span>
                            <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Select an event to<br/>configure its hours</p>
                        </div>
                      )}
                  </div>
               </div>

               {/* Date Overrides Section */}
               <div className="space-y-6">
                  <h2 className="text-xl font-black text-gray-900">Date Overrides</h2>
                  
                  <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                      {selectedEvent ? (
                        <div className="space-y-8">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">For: {selectedEvent.title}</p>
                                <p className="text-xs font-medium text-gray-400 leading-relaxed">Block specific dates or set custom hours that override weekly availability.</p>
                            </div>

                            {/* Existing Overrides */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Active Overrides</p>
                                {selectedEvent.dateOverrides?.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedEvent.dateOverrides
                                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                                          .map(ov => (
                                            <div key={ov.id} className={`flex items-center justify-between p-4 rounded-2xl group ${
                                              ov.isBlocked ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'
                                            }`}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {new Date(ov.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    {ov.isBlocked ? (
                                                        <span className="text-xs font-bold text-red-500">🚫 Blocked — No bookings</span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-amber-600">⏰ {ov.startTime} – {ov.endTime}</span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteOverride(ov.id)}
                                                    className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400 font-medium italic">No overrides defined.</p>}
                            </div>

                            {/* Add Override Button */}
                            <button 
                                onClick={() => setShowOverrideForm(!showOverrideForm)}
                                className="w-full py-4 bg-amber-50 text-amber-600 rounded-2xl font-bold hover:bg-amber-100 transition-all"
                            >
                                {showOverrideForm ? 'Close Form' : '+ Add Date Override'}
                            </button>

                            {/* Override Form */}
                            {showOverrideForm && (
                              <form onSubmit={handleAddOverride} className="p-6 bg-gray-900 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Date</label>
                                        <input
                                            type="date"
                                            value={overrideData.date}
                                            onChange={(e) => setOverrideData(prev => ({ ...prev, date: e.target.value }))}
                                            required
                                            className="w-full bg-gray-800 text-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                    <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-700 transition-all">
                                        <input
                                            type="checkbox"
                                            checked={overrideData.isBlocked}
                                            onChange={(e) => setOverrideData(prev => ({ ...prev, isBlocked: e.target.checked }))}
                                            className="w-5 h-5 rounded-lg accent-red-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">Block entire day</span>
                                            <span className="text-[10px] text-gray-400">No bookings will be possible</span>
                                        </div>
                                    </label>
                                    {!overrideData.isBlocked && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Start</label>
                                                <input
                                                    type="time"
                                                    value={overrideData.startTime}
                                                    onChange={(e) => setOverrideData(prev => ({ ...prev, startTime: e.target.value }))}
                                                    className="w-full bg-gray-800 text-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">End</label>
                                                <input
                                                    type="time"
                                                    value={overrideData.endTime}
                                                    onChange={(e) => setOverrideData(prev => ({ ...prev, endTime: e.target.value }))}
                                                    className="w-full bg-gray-800 text-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <button type="submit" className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all">
                                        {overrideData.isBlocked ? '🚫 Block This Date' : '⏰ Save Custom Hours'}
                                    </button>
                              </form>
                            )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <span className="text-3xl mb-4">📆</span>
                            <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Select an event to<br/>manage date overrides</p>
                        </div>
                      )}
                  </div>
               </div>

               {/* Custom Booking Questions */}
               <div className="space-y-6">
                   <h2 className="text-xl font-black text-gray-900 leading-none">Booking Questions</h2>
                   <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                       {selectedEvent ? (
                           <div className="space-y-8">
                               <div>
                                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Form Customization</p>
                                   <p className="text-xs font-medium text-gray-400 leading-relaxed">Gather extra information from your guests before the meeting starts.</p>
                               </div>

                               {/* Active Questions */}
                               {selectedEvent.questions?.length > 0 ? (
                                   <div className="space-y-3">
                                       {selectedEvent.questions.map(q => (
                                           <div key={q.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                               <div className="flex flex-col text-left">
                                                   <span className="text-sm font-bold text-gray-900">{q.label}</span>
                                                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{q.type} • {q.required ? 'Required' : 'Optional'}</span>
                                               </div>
                                               <button onClick={() => handleDeleteQuestion(q.id)} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest opacity-0 group-hover:opacity-100">Remove</button>
                                           </div>
                                       ))}
                                   </div>
                               ) : (
                                   <p className="text-xs text-gray-400 font-medium bg-gray-50 p-6 rounded-2xl text-center border-2 border-dashed border-gray-100 italic">Only Name & Email are collected by default.</p>
                               )}

                                <button onClick={() => setShowQuestionForm(!showQuestionForm)} className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all">
                                    {showQuestionForm ? 'Close Form' : '+ Add Custom Question'}
                                </button>

                                {showQuestionForm && (
                                    <form onSubmit={handleAddQuestion} className="p-6 bg-gray-900 rounded-3xl space-y-4 animate-in zoom-in-95 duration-200">
                                        <div className="space-y-1 text-left">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Question Label</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Website URL"
                                                value={questionData.label}
                                                onChange={(e) => setQuestionData(p => ({ ...p, label: e.target.value }))}
                                                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-left">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Input Type</label>
                                                <select
                                                    value={questionData.type}
                                                    onChange={(e) => setQuestionData(p => ({ ...p, type: e.target.value }))}
                                                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                >
                                                    <option value="text">Text Input</option>
                                                    <option value="textarea">Long Text</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Placeholder</label>
                                                <input
                                                  type="text"
                                                  placeholder="Hint..."
                                                  value={questionData.placeholder || ''}
                                                  onChange={(e) => setQuestionData(p => ({ ...p, placeholder: e.target.value }))}
                                                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl cursor-pointer" onClick={() => setQuestionData(p => ({ ...p, required: !p.required }))}>
                                            <input type="checkbox" checked={questionData.required} onChange={() => {}} className="w-5 h-5 rounded accent-indigo-500" />
                                            <span className="text-sm font-bold text-white">Required?</span>
                                        </label>
                                        <button type="submit" className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all">Add Question</button>
                                    </form>
                                )}
                           </div>
                       ) : (
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                             <span className="text-3xl mb-4">💬</span>
                             <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Select an event to<br/>customize the form</p>
                        </div>
                       )}
                   </div>
               </div>
            </div>

            {/* Column 3: Bookings Section */}
            <div className="lg:col-span-4 space-y-8">
               <div className="space-y-6">
                    <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">Upcoming Bookings</h2>
                    <div className="space-y-4">
                        {bookings.filter(b => new Date(b.date) >= new Date().setHours(0,0,0,0)).length === 0 ? (
                            <p className="text-gray-400 text-sm font-medium italic">All clear! No upcoming sessions.</p>
                        ) : 
                        bookings
                            .filter(b => new Date(b.date) >= new Date().setHours(0,0,0,0))
                            .sort((a,b) => new Date(a.date) - new Date(b.date))
                            .map(b => (
                            <div key={b.id} className="bg-gray-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs font-black text-blue-400 tracking-widest uppercase mb-1">{b.event?.title}</p>
                                            <h4 className="text-lg font-bold">{b.name}</h4>
                                        </div>
                                        <button 
                                            onClick={() => handleCancelBooking(b.id)}
                                            className="bg-red-500/10 text-red-500 p-2 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                            <span>📅 {new Date(b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span>at</span>
                                            <span className="text-white font-bold px-2 py-0.5 bg-gray-800 rounded">{b.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 italic truncate max-w-[200px]">✉️ {b.email}</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            </div>
                        ))}
                    </div>
               </div>

               <div className="space-y-6 bg-gray-50 rounded-[2rem] p-8">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Past History</h2>
                    <div className="space-y-4">
                        {bookings.filter(b => new Date(b.date) < new Date().setHours(0,0,0,0)).length === 0 ? (
                            <p className="text-gray-300 text-xs font-medium italic text-center">No history yet.</p>
                        ) : 
                        bookings
                            .filter(b => new Date(b.date) < new Date().setHours(0,0,0,0))
                            .sort((a,b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 5)
                            .map(b => (
                            <div key={b.id} className="flex items-center justify-between border-b border-gray-100 pb-4 opacity-70">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-900">{b.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(b.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-[10px] font-black text-gray-300">COMPLETED</span>
                            </div>
                        ))}
                    </div>
               </div>
            </div>

          </div>
        )}
      </main>
       <Footer />

      {/* Modern Tailwind Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto ${
                modal.type === 'danger' ? 'bg-red-50 text-red-500' : 
                modal.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                'bg-blue-50 text-blue-500'
            }`}>
              {modal.type === 'danger' ? '!' : (modal.type === 'success' ? '✓' : 'ℹ')}
            </div>
            
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2">{modal.title}</h3>
            <p className="text-gray-500 text-center mb-8 leading-relaxed font-medium">{modal.message}</p>
            
            <div className="flex gap-3">
              {modal.confirmText !== 'OK' && (
                <button onClick={closeModal} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all font-sans">Cancel</button>
              )}
              <button 
                onClick={() => {
                   if (modal.onConfirm) modal.onConfirm();
                   else closeModal();
                }} 
                className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg transition-all font-sans ${
                    modal.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 
                    modal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 
                    'bg-gray-900 hover:bg-gray-800 shadow-gray-200'
                }`}
              >
                {modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
