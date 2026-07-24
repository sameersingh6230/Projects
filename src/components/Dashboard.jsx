import { useEffect, useMemo, useState } from 'react';

const events = [
  { name: 'Summer Gala', guests: 120 },
  { name: 'Wedding Reception', guests: 200 },
  { name: 'Corporate Launch', guests: 80 }
];

const budgetItems = [
  { name: 'Venue', allocated: 7500, spent: 6800 },
  { name: 'Catering', allocated: 6000, spent: 5200 },
  { name: 'Decor', allocated: 2800, spent: 2400 },
  { name: 'Photography', allocated: 1800, spent: 1200 }
];

const initialTasks = [
  { id: 1, title: 'Confirm venue', due: 'May 10', completed: true },
  { id: 2, title: 'Approve menu', due: 'May 18', completed: false },
  { id: 3, title: 'Finalize guest list', due: 'May 24', completed: false },
  { id: 4, title: 'Decor walkthrough', due: 'May 30', completed: false }
];

const galleryItems = [
  { title: 'Ceremony Space', description: 'Elegant seating and floral styling.' },
  { title: 'Reception Set', description: 'Warm lighting and table decor.' },
  { title: 'Photo Booth', description: 'Guest-friendly memory station.' },
  { title: 'Cake Display', description: 'Showcase your sweet centerpieces.' }
];

function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerTasks');
    return stored ? JSON.parse(stored) : initialTasks;
  });
  const [timeline, setTimeline] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerTimeline');
    return stored
      ? JSON.parse(stored)
      : [
          { step: 'Book venue', date: 'May 01', done: true },
          { step: 'Finalize vendors', date: 'May 15', done: true },
          { step: 'Launch invitations', date: 'May 22', done: false },
          { step: 'Confirm final details', date: 'June 02', done: false }
        ];
  });
  const [bookedVendors, setBookedVendors] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerBookedVendors');
    return stored ? JSON.parse(stored) : [];
  });
  const [giftContributions, setGiftContributions] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerGiftContributions');
    return stored ? JSON.parse(stored) : [];
  });
  const [paymentRecords, setPaymentRecords] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerPayments');
    return stored ? JSON.parse(stored) : [];
  });
  const [newTask, setNewTask] = useState({ title: '', due: '' });
  const [giftForm, setGiftForm] = useState({ guest: '', amount: '', fund: 'Honeymoon', message: '' });
  const [paymentForm, setPaymentForm] = useState({ client: '', amount: '', type: 'Deposit', email: '' });
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('eventPlannerTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    window.localStorage.setItem('eventPlannerTimeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    window.localStorage.setItem('eventPlannerGiftContributions', JSON.stringify(giftContributions));
  }, [giftContributions]);

  useEffect(() => {
    window.localStorage.setItem('eventPlannerPayments', JSON.stringify(paymentRecords));
  }, [paymentRecords]);

  const totalGuests = 605;
  const acceptedCount = 385;
  const pendingCount = 75;
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const completedTasks = tasks.filter(task => task.completed).length;
  const taskProgress = Math.round((completedTasks / tasks.length) * 100);
  const bookedCount = bookedVendors.length;
  const giftTotal = giftContributions.reduce((sum, gift) => sum + gift.amount, 0);

  const toggleTask = id => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const addTask = event => {
    event.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks(prev => [
      { id: Date.now(), title: newTask.title.trim(), due: newTask.due || 'Soon', completed: false },
      ...prev
    ]);
    setNewTask({ title: '', due: '' });
  };

  const addGiftContribution = event => {
    event.preventDefault();
    const amountValue = Number(giftForm.amount);
    if (!giftForm.guest.trim() || !amountValue || amountValue <= 0) return;

    setGiftContributions(prev => [
      {
        id: Date.now(),
        guest: giftForm.guest.trim(),
        amount: amountValue,
        fund: giftForm.fund,
        message: giftForm.message.trim(),
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);
    setGiftForm({ guest: '', amount: '', fund: 'Honeymoon', message: '' });
  };

  const submitPayment = event => {
    event.preventDefault();
    const amountValue = Number(paymentForm.amount);
    if (!paymentForm.client.trim() || !paymentForm.email.trim() || !amountValue || amountValue <= 0) return;

    setPaymentRecords(prev => [
      {
        id: Date.now(),
        client: paymentForm.client.trim(),
        amount: amountValue,
        type: paymentForm.type,
        email: paymentForm.email.trim(),
        date: new Date().toLocaleDateString(),
        status: 'Completed'
      },
      ...prev
    ]);
    setPaymentForm({ client: '', amount: '', type: 'Deposit', email: '' });
  };

  const handleDragStart = index => {
    setDragIndex(index);
  };

  const handleDrop = index => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...timeline];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setTimeline(updated);
    setDragIndex(null);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  return (
    <section className="page-section">
      <div className="section-heading-row">
        <div>
          <h1>Planner Dashboard</h1>
          <p>View event totals, budget health, RSVP status, task progress, and inspiration images.</p>
        </div>
      </div>

      <div className="dashboard-grid dashboard-top-grid">
        <div className="dashboard-card overview-card">
          <h2>Upcoming Events</h2>
          <ul className="overview-list">
            {events.map(event => (
              <li key={event.name}>
                <span>{event.name}</span>
                <strong>{event.guests} guests</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-card overview-card">
          <h2>Budget Health</h2>
          <div className="metric-summary">
            <div>
              <span>Allocated</span>
              <strong>${totalBudget.toLocaleString()}</strong>
            </div>
            <div>
              <span>Spent</span>
              <strong>${totalSpent.toLocaleString()}</strong>
            </div>
            <div>
              <span>Remaining</span>
              <strong>${(totalBudget - totalSpent).toLocaleString()}</strong>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round((totalSpent / totalBudget) * 100)}%` }} />
          </div>
        </div>

        <div className="dashboard-card overview-card">
          <h2>RSVP Snapshot</h2>
          <div className="metric-summary">
            <div>
              <span>Accepted</span>
              <strong>{acceptedCount}</strong>
            </div>
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div>
              <span>Invited</span>
              <strong>{totalGuests}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card overview-card">
          <h2>Vendor Confirmations</h2>
          <div className="confirmation-badge">{bookedCount} confirmed bookings</div>
          {bookedCount > 0 ? (
            <ul className="overview-list">
              {bookedVendors.map(vendor => (
                <li key={vendor}>{vendor}</li>
              ))}
            </ul>
          ) : (
            <p>No vendors booked yet.</p>
          )}
        </div>

        <div className="dashboard-card invoice-card">
          <h2>Booking Invoice</h2>
          <p><strong>Invoice #</strong> EP-2026-0042</p>
          <p><strong>Due date:</strong> June 10</p>
          <div className="invoice-row">
            <span>Vendor deposits</span>
            <strong>$8,400</strong>
          </div>
          <div className="invoice-row">
            <span>Event services</span>
            <strong>$12,760</strong>
          </div>
          <div className="invoice-row total-row">
            <span>Total balance</span>
            <strong>$21,160</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-secondary dashboard-main-grid">
        <div className="dashboard-card timeline-card">
          <h2>Schedule & Tasks</h2>
          <div className="timeline-grid">
            {timeline.map((item, index) => (
              <div
                key={item.step}
                className={`timeline-step ${item.done ? 'done' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <span className="timeline-step-name">{item.step}</span>
                <span className="timeline-step-date">{item.date}</span>
              </div>
            ))}
          </div>

          <form className="task-form" onSubmit={addTask}>
            <div className="task-form-row">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Due date"
                value={newTask.due}
                onChange={e => setNewTask({ ...newTask, due: e.target.value })}
              />
            </div>
            <button type="submit" className="button">Add Task</button>
          </form>

          <div className="task-summary">
            <span>{completedTasks} / {tasks.length} completed</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${taskProgress}%` }} />
            </div>
          </div>
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className="task-item">
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
                <span className="task-due">Due {task.due}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-card gallery-card-block">
          <h2>Inspiration Gallery</h2>
          <div className="gallery-grid">
            {galleryItems.map(item => (
              <article key={item.title} className="gallery-card">
                <div className="gallery-image" />
                <div className="gallery-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section className="dashboard-secondary payment-section">
        <div className="dashboard-card payment-card">
          <h2>Guest Gift Contribution</h2>
          <form className="gift-form" onSubmit={addGiftContribution}>
            <input
              type="text"
              placeholder="Guest name"
              value={giftForm.guest}
              onChange={e => setGiftForm({ ...giftForm, guest: e.target.value })}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Amount"
              value={giftForm.amount}
              onChange={e => setGiftForm({ ...giftForm, amount: e.target.value })}
              required
            />
            <select
              value={giftForm.fund}
              onChange={e => setGiftForm({ ...giftForm, fund: e.target.value })}
            >
              <option value="Honeymoon">Honeymoon Fund</option>
              <option value="Gift">Gift Fund</option>
            </select>
            <textarea
              placeholder="Leave a message"
              value={giftForm.message}
              onChange={e => setGiftForm({ ...giftForm, message: e.target.value })}
            />
            <button type="submit" className="button">Contribute</button>
          </form>

          <div className="gift-summary">
            <p>Total contributed: <strong>${giftTotal.toLocaleString()}</strong></p>
            <ul className="gift-list">
              {giftContributions.map(gift => (
                <li key={gift.id}>
                  <span>{gift.guest} → {gift.fund}</span>
                  <strong>${gift.amount.toLocaleString()}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-card payment-card">
          <div className="stripe-tile">
            <span>Stripe</span>
            <strong>Secure booking payments</strong>
          </div>
          <h2>Client Payment Gateway</h2>
          <form className="payment-form" onSubmit={submitPayment}>
            <input
              type="text"
              placeholder="Client name"
              value={paymentForm.client}
              onChange={e => setPaymentForm({ ...paymentForm, client: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Client email"
              value={paymentForm.email}
              onChange={e => setPaymentForm({ ...paymentForm, email: e.target.value })}
              required
            />
            <select
              value={paymentForm.type}
              onChange={e => setPaymentForm({ ...paymentForm, type: e.target.value })}
            >
              <option value="Deposit">Vendor Booking Deposit</option>
              <option value="Full">Full Payment</option>
            </select>
            <input
              type="number"
              min="1"
              placeholder="Amount"
              value={paymentForm.amount}
              onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              required
            />
            <button type="submit" className="button">Pay with Stripe</button>
          </form>

          <div className="payment-records">
            <h3>Recent Payments</h3>
            {paymentRecords.length > 0 ? (
              <ul>
                {paymentRecords.slice(0, 4).map(record => (
                  <li key={record.id}>
                    {record.client} — {record.type} — ${record.amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No payments recorded yet.</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
