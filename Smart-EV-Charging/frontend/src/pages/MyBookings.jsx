import React, { useState } from 'react';
import { initialBookings } from '../services/mockData';
import { Link } from 'react-router-dom';
import { Bookmark, Filter, Plus, Calendar, Clock, XCircle, CheckCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState('All');
  const [notice, setNotice] = useState('');

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setBookings(bookings.map(b => b.booking_id === id ? { ...b, status: 'Cancelled' } : b));
      setNotice('Booking cancelled successfully.');
      setTimeout(() => setNotice(''), 3000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Upcoming') return b.status === 'Confirmed';
    if (statusFilter === 'Completed') return b.status === 'Completed';
    if (statusFilter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="my-bookings-container">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">My Bookings</h1>
          <p className="welcome-sub">View and manage your scheduled electric charging reservations</p>
        </div>

        <Link to="/booking" className="btn-primary">
          <Plus size={18} />
          <span>New Reservation</span>
        </Link>
      </div>

      {notice && (
        <div className="badge-pill cancelled w-full p-3 mb-4 text-xs">
          <CheckCircle size={15} />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card-table-wrapper" style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={statusFilter === tab ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
              style={{ padding: '0.45rem 1rem' }}
            >
              {tab === 'All' ? `All Bookings (${bookings.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Station</th>
                <th>Port</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.booking_id}>
                  <td className="font-mono font-bold text-white">#BK-{b.booking_id}</td>
                  <td className="text-white font-medium">{b.vehicle}</td>
                  <td>{b.station}</td>
                  <td className="font-mono text-xs">{b.port}</td>
                  <td>{b.date}</td>
                  <td className="font-mono text-xs">{b.start_time}</td>
                  <td className="font-mono text-xs">{b.end_time}</td>
                  <td>
                    <span className={`badge-pill ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'Confirmed' ? (
                      <button
                        onClick={() => handleCancelBooking(b.booking_id)}
                        className="btn-danger text-xs"
                        style={{ padding: '0.3rem 0.65rem' }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
