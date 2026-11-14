import React, { useState } from 'react';
import { initialBookings } from '../../services/mockData';
import {
  CalendarCheck,
  Search,
  CheckCircle,
  XCircle,
  CheckCircle2,
  Clock,
  Filter,
  Trash2
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [notice, setNotice] = useState('');

  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.booking_id === id ? { ...b, status: newStatus } : b));
    setNotice(`Booking #BK-${id} status marked as "${newStatus}".`);
    setTimeout(() => setNotice(''), 3000);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booking_id.toString().includes(searchQuery);

    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-bookings-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Booking Management</h1>
          <p className="welcome-sub">Oversee driver reservations, slot allocations, and update booking lifecycle statuses</p>
        </div>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-3 mb-4 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card-table-wrapper" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="navbar-search-box" style={{ width: '100%', maxWidth: '340px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by driver, vehicle, or station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={statusFilter === tab ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
                style={{ padding: '0.45rem 0.9rem' }}
              >
                {tab === 'All' ? `All Bookings (${bookings.length})` : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Table Requested:
          - Booking ID
          - User
          - Vehicle
          - Station
          - Port
          - Date
          - Time
          - Status
          - Actions
      */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Vehicle</th>
                <th>Station</th>
                <th>Port</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.booking_id}>
                    <td className="font-mono font-bold text-white">#BK-{b.booking_id}</td>
                    <td className="font-semibold text-white">{b.customer_name}</td>
                    <td>{b.vehicle}</td>
                    <td>{b.station}</td>
                    <td className="font-mono text-xs">{b.port}</td>
                    <td>{b.date}</td>
                    <td className="font-mono text-xs">{b.start_time} - {b.end_time}</td>
                    <td>
                      <span className={`badge-pill ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                        {b.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.booking_id, 'Completed')}
                            className="btn-secondary text-xs"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Mark Completed"
                          >
                            Complete
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.booking_id, 'Cancelled')}
                            className="btn-danger text-xs"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        )}
                        {b.status === 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.booking_id, 'Confirmed')}
                            className="btn-primary text-xs"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Reconfirm"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center text-muted py-8">
                    No bookings found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
