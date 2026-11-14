import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Wrench, Plus, X } from 'lucide-react';
import { adminApi } from '../../services/api';
import '../../styles/AdminPages.css';

const AdminMaintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    port_id: '',
    issue_type: 'port_malfunction',
    description: ''
  });

  useEffect(() => {
    // Simulate fetching maintenance tickets
    setTickets([
      {
        ticket_id: 'MNT001',
        port_id: 'STA001-P02',
        station_name: 'Station A',
        issue_type: 'port_malfunction',
        description: 'Display screen not responding',
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60000),
        status: 'open',
        priority: 'high',
        assigned_to: 'Technician A',
        last_update: new Date(Date.now() - 1 * 60 * 60000)
      },
      {
        ticket_id: 'MNT002',
        port_id: 'STA002-P04',
        station_name: 'Station B',
        issue_type: 'connector_damage',
        description: 'Type 2 connector loose',
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60000),
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 'Technician B',
        last_update: new Date(Date.now() - 6 * 60 * 60000)
      },
      {
        ticket_id: 'MNT003',
        port_id: 'STA003-P01',
        station_name: 'Station C',
        issue_type: 'power_supply',
        description: 'Power supply failure',
        created_date: new Date(Date.now() - 10 * 24 * 60 * 60000),
        status: 'resolved',
        priority: 'critical',
        assigned_to: 'Technician C',
        last_update: new Date(Date.now() - 2 * 24 * 60 * 60000)
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddTicket = (e) => {
    e.preventDefault();
    const newTicket = {
      ticket_id: `MNT${String(tickets.length + 1).padStart(3, '0')}`,
      port_id: formData.port_id,
      station_name: 'Auto-detected Station',
      issue_type: formData.issue_type,
      description: formData.description,
      created_date: new Date(),
      status: 'open',
      priority: 'medium',
      assigned_to: 'Unassigned',
      last_update: new Date()
    };
    setTickets([newTicket, ...tickets]);
    setShowAddForm(false);
    setFormData({ port_id: '', issue_type: 'port_malfunction', description: '' });
  };

  const handleResolveTicket = (ticketId) => {
    setTickets(tickets.map(t =>
      t.ticket_id === ticketId ? { ...t, status: 'resolved', last_update: new Date() } : t
    ));
  };

  const filteredTickets = tickets.filter(t =>
    statusFilter === 'all' || t.status === statusFilter
  );

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  if (loading) return <div className="admin-loading">Loading maintenance...</div>;

  return (
    <div className="admin-maintenance-page">
      <div className="admin-page-header">
        <div>
          <h1>Maintenance & Alerts Management</h1>
          <p className="admin-page-subtitle">Track maintenance tickets and port issues</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} />
          New Ticket
        </button>
      </div>

      {/* Alert Summary */}
      <div className="alert-summary-grid">
        <div className="alert-summary-card alert-critical">
          <AlertCircle size={24} />
          <div>
            <h4>Critical Issues</h4>
            <p>{tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length}</p>
          </div>
        </div>
        <div className="alert-summary-card alert-warning">
          <AlertCircle size={24} />
          <div>
            <h4>Open Tickets</h4>
            <p>{openCount}</p>
          </div>
        </div>
        <div className="alert-summary-card alert-info">
          <Clock size={24} />
          <div>
            <h4>In Progress</h4>
            <p>{inProgressCount}</p>
          </div>
        </div>
        <div className="alert-summary-card alert-success">
          <CheckCircle size={24} />
          <div>
            <h4>Resolved</h4>
            <p>{tickets.filter(t => t.status === 'resolved').length}</p>
          </div>
        </div>
      </div>

      {/* Add Ticket Form */}
      {showAddForm && (
        <div className="admin-form-card">
          <h3>Create New Maintenance Ticket</h3>
          <form onSubmit={handleAddTicket} className="admin-form">
            <div className="form-group">
              <label>Port ID</label>
              <input
                type="text"
                placeholder="e.g., STA001-P02"
                value={formData.port_id}
                onChange={(e) => setFormData({ ...formData, port_id: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Issue Type</label>
              <select
                value={formData.issue_type}
                onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
              >
                <option value="port_malfunction">Port Malfunction</option>
                <option value="connector_damage">Connector Damage</option>
                <option value="power_supply">Power Supply Issue</option>
                <option value="network_error">Network Error</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Ticket</button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="maintenance-filter">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="maintenance-list">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.ticket_id} className="maintenance-card">
              <div className="ticket-header">
                <div>
                  <h4>{ticket.ticket_id}</h4>
                  <p className="ticket-station">{ticket.station_name} - {ticket.port_id}</p>
                </div>
                <span className={`priority-badge priority-${ticket.priority}`}>
                  {ticket.priority.toUpperCase()}
                </span>
              </div>

              <div className="ticket-content">
                <p className="issue-type">{ticket.issue_type.replace(/_/g, ' ')}</p>
                <p className="description">{ticket.description}</p>
              </div>

              <div className="ticket-footer">
                <div className="ticket-meta">
                  <span>Created: {ticket.created_date.toLocaleDateString()}</span>
                  <span>Assigned: {ticket.assigned_to}</span>
                </div>
                <div className="ticket-status">
                  <span className={`status-badge status-${ticket.status}`}>
                    {ticket.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  {ticket.status !== 'resolved' && (
                    <button
                      className="btn-small-primary"
                      onClick={() => handleResolveTicket(ticket.ticket_id)}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Wrench size={40} />
            <p>No maintenance tickets</p>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>Create Ticket</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMaintenance;
