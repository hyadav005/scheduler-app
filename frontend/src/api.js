import axios from "axios";

const api = axios.create({
  baseURL: "https://scheduler-app-2-oqpw.onrender.com",
});

export const apiService = {
  // Event Hub
  getEvents: () => api.get('/events').then(res => res.data),
  createEvent: (eventData) => api.post('/events', eventData).then(res => res.data),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData).then(res => res.data),
  deleteEvent: (id) => api.delete(`/events/${id}`).then(res => res.data),

  // Availability
  createAvailability: (availability) => api.post('/availability', availability).then(res => res.data),
  deleteAvailability: (id) => api.delete(`/availability/${id}`).then(res => res.data),
  getSlots: (eventId, date) => api.get(`/slots/${eventId}`, { params: { date } }).then(res => res.data),

  // Date Overrides
  createDateOverride: (data) => api.post('/date-overrides', data).then(res => res.data),
  deleteDateOverride: (id) => api.delete(`/date-overrides/${id}`).then(res => res.data),
  getDateOverrides: (eventId) => api.get(`/date-overrides/event/${eventId}`).then(res => res.data),

  // Bookings
  createBooking: (bookingData) => api.post('/book', bookingData).then(res => res.data),
  getBookings: () => api.get('/bookings').then(res => res.data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`).then(res => res.data),

  // Questions
  createQuestion: (eventId, question) => api.post(`/events/${eventId}/questions`, question).then(res => res.data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`).then(res => res.data),
};
