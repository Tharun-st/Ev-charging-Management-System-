import React, { useState } from 'react';
import { initialPayments } from '../services/mockData';
import Modal from '../components/Modal';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  Plus,
  Receipt,
  Smartphone,
  ShieldCheck,
  Building2,
  CheckCircle
} from 'lucide-react';

const Payment = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState('');

  // Payment form state
  const [sessionId, setSessionId] = useState('#1003');
  const [amount, setAmount] = useState('15.50');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Summary card metrics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0).toFixed(2);
  const successfulPayments = payments.filter(p => p.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const newPayment = {
      payment_id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      session_id: sessionId.startsWith('#') ? sessionId : `#${sessionId}`,
      amount: parseFloat(amount) || 10.0,
      method: paymentMethod,
      date: new Date().toISOString().split('T')[0],
      user: 'Priya Sharma',
      status: 'Completed'
    };

    setPayments([newPayment, ...payments]);
    setShowModal(false);
    setNotice(`Payment of ₹${newPayment.amount.toFixed(2)} recorded successfully via ${paymentMethod}! (ID: ${newPayment.payment_id})`);
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div className="payments-page-container">
      {/* Page Header */}
      <div className="table-header-bar">
        <div>
          <h1 className="welcome-heading">Payments & Billing History</h1>
          <p className="welcome-sub">View settled invoices, instant receipts, and record test charging payments</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          <span>Record Payment</span>
        </button>
      </div>

      {notice && (
        <div className="badge-pill confirmed w-full p-4 mb-4 text-sm flex items-center gap-2">
          <CheckCircle size={18} />
          <span>{notice}</span>
        </div>
      )}

      {/* 4 Summary Cards Requested:
          1. Total Payments
          2. Total Amount
          3. Successful Payments
          4. Pending Payments
      */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Payments</span>
            <span className="stat-number font-mono">{totalPayments}</span>
            <span className="text-xs text-muted">All-time transactions</span>
          </div>
          <div className="stat-icon-container">
            <Receipt size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Total Amount</span>
            <span className="stat-number font-mono text-green">₹{totalAmount}</span>
            <span className="text-xs text-muted">Cumulative billed amount</span>
          </div>
          <div className="stat-icon-container">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Successful Payments</span>
            <span className="stat-number font-mono text-green">{successfulPayments}</span>
            <span className="text-xs text-muted">Settled and verified</span>
          </div>
          <div className="stat-icon-container">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-title">Pending Payments</span>
            <span className="stat-number font-mono text-cyan">{pendingPayments}</span>
            <span className="text-xs text-muted">Awaiting confirmation</span>
          </div>
          <div className="stat-icon-container">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="card-table-wrapper">
        <div className="table-header-bar">
          <div>
            <h3 className="card-title">Recent Invoices</h3>
            <p className="card-subtitle">Verified on-grid digital transaction audit trail</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Session ID</th>
                <th>Amount (₹)</th>
                <th>Payment Method</th>
                <th>Payment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id}>
                  <td className="font-mono font-bold text-white">{p.payment_id}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Payment Form UI Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Record Charging Payment"
      >
        <form onSubmit={handleRecordPayment}>
          <div className="form-group">
            <label className="form-label">Charging Session ID</label>
            <input
              type="text"
              required
              placeholder="#1001"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Amount (₹ INR)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              placeholder="e.g. 450.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              {['UPI (GPay / PhonePe)', 'RuPay Card', 'Net Banking', 'EV Fleet Wallet'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={paymentMethod === method ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
                  style={{ padding: '0.75rem', justifyContent: 'center' }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={18} className="text-green" />
            <span className="text-xs text-muted">
              Demo payment recording form. No live payment gateway charged.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <CreditCard size={16} />
              <span>Confirm & Record Payment</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payment;
