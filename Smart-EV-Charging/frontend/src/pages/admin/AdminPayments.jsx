import React, { useState } from 'react';
import { initialPayments } from '../../services/mockData';
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  Receipt,
  Download
} from 'lucide-react';

const AdminPayments = () => {
  const [payments] = useState(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');

  // Total Revenue Calculation & Summary Metrics
  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0)
    .toFixed(2);

  const totalTransactions = payments.length;
  const completedTransactions = payments.filter(p => p.status === 'Completed').length;
  const pendingTransactions = payments.filter(p => p.status === 'Pending').length;

  const filteredPayments = payments.filter(p => {
    const matchSearch =
      p.payment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.session_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchMethod = methodFilter === 'All' || p.method === methodFilter;
    return matchSearch && matchMethod;
  });

  return (
    <div className="admin-payments-page">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Payment & Billing Management</h1>
          <p className="welcome-sub">Track real-time network revenues, customer invoices, settlement methods, and outstanding tabs</p>
        </div>
      </div>

      {/* Required: Total Revenue Card (+ complementary metrics) */}
      <div className="stats-cards-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-green)' }}>
          <div className="stat-content">
            <span className="stat-title">Total Network Revenue</span>
            <span className="stat-number font-mono text-green">₹{Number(totalRevenue).toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted flex items-center gap-1">
              <TrendingUp size={13} className="text-green" /> Gross settled charging revenue
            </span>
          </div>
          <div className="stat-icon-container">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Invoices</span>
            <span className="stat-number font-mono">{totalTransactions}</span>
            <span className="text-xs text-muted">All-time transactions</span>
          </div>
          <div className="stat-icon-container">
            <Receipt size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Successful Payments</span>
            <span className="stat-number font-mono text-green">{completedTransactions}</span>
            <span className="text-xs text-muted">Cleared via payment channels</span>
          </div>
          <div className="stat-icon-container">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Pending Settlements</span>
            <span className="stat-number font-mono" style={{ color: 'var(--status-pending)' }}>
              {pendingTransactions}
            </span>
            <span className="text-xs text-muted">Awaiting session completion</span>
          </div>
          <div className="stat-icon-container" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--status-pending)' }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-table-wrapper" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="navbar-search-box" style={{ width: '100%', maxWidth: '340px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by Payment ID, driver, or session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={methodFilter === m ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
                style={{ padding: '0.45rem 0.9rem' }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Table Requested:
          - Payment ID
          - User
          - Session ID
          - Amount
          - Payment method
          - Date
          - Status
      */}
      <div className="card-table-wrapper">
        <div className="responsive-table-scroll">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>User</th>
                <th>Session ID</th>
                <th>Amount (₹)</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(p => (
                  <tr key={p.payment_id}>
                    <td className="font-mono font-bold text-white">{p.payment_id}</td>
                    <td className="font-semibold text-white">{p.user}</td>
                    <td className="font-mono text-xs">{p.session_id}</td>
                    <td className="font-mono font-bold text-green">₹{parseFloat(p.amount).toFixed(2)}</td>
                    <td>
                      <span className="payment-method-pill">
                        {p.method}
                      </span>
                    </td>
                    <td>{p.date}</td>
                    <td>
                      <span className={`badge-pill ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-8">
                    No transactions matching search criteria.
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

export default AdminPayments;
