import React from 'react';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

const BookingTable = ({ bookings, onCancelBooking, showUser = false }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="empty-state-box">
        <Calendar size={48} className="text-muted mb-2" />
        <p>No reservations found.</p>
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-success"><CheckCircle size={12} /> Confirmed</span>;
      case 'completed':
        return <span className="badge badge-info">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-danger"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-warning"><AlertCircle size={12} /> {status}</span>;
    }
  };

  return (
    <div className="table-responsive-container">
      <table className="custom-data-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            {showUser && <th>Customer</th>}
            <th>Station & Location</th>
            <th>Port Info</th>
            <th>Vehicle</th>
            <th>Scheduled Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.booking_id}>
              <td className="font-mono font-bold">#BK-{b.booking_id}</td>
              {showUser && <td>{b.customer_name || `User #${b.user_id}`}</td>}
              <td>
                <div className="font-semibold text-primary">{b.station_name}</div>
                <div className="text-muted text-xs flex-center gap-1">
                  <MapPin size={12} /> {b.station_location}
                </div>
              </td>
              <td>
                <span className="port-badge">{b.port_number || `Port #${b.port_id}`}</span>
                <div className="text-xs text-muted">{b.port_type}</div>
              </td>
              <td>
                <div className="text-primary font-medium">{b.vehicle_model || 'Unassigned EV'}</div>
                {b.license_plate && <div className="text-xs font-mono text-cyan">{b.license_plate}</div>}
              </td>
              <td>
                <div className="text-xs text-primary font-medium">
                  {formatDateTime(b.start_time)}
                </div>
                <div className="text-xs text-muted">to {formatDateTime(b.end_time)}</div>
              </td>
              <td>{getStatusBadge(b.status)}</td>
              <td>
                {b.status === 'confirmed' ? (
                  <button
                    onClick={() => onCancelBooking && onCancelBooking(b.booking_id)}
                    className="btn-cancel-action"
                    title="Cancel Reservation"
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
  );
};

export default BookingTable;
