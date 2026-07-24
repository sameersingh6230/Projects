import { useEffect, useMemo, useState } from 'react';

const eventTypes = ['Pre-Wedding', 'Wedding', 'Reception'];
const initialAttendeesByEvent = {
  'Pre-Wedding': [
    { id: 1, name: 'Emma Collins', status: 'Accepted' },
    { id: 2, name: 'Noah Patel', status: 'Pending' }
  ],
  Wedding: [
    { id: 3, name: 'Ava Nguyen', status: 'Accepted' },
    { id: 4, name: 'Liam Brooks', status: 'Declined' }
  ],
  Reception: [
    { id: 5, name: 'Mia Turner', status: 'Pending' }
  ]
};

function RSVP() {
  const [selectedEvent, setSelectedEvent] = useState(eventTypes[0]);
  const [attendeesByEvent, setAttendeesByEvent] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerAttendeesByEvent');
    return stored ? JSON.parse(stored) : initialAttendeesByEvent;
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({ name: '', status: 'Pending' });

  useEffect(() => {
    window.localStorage.setItem('eventPlannerAttendeesByEvent', JSON.stringify(attendeesByEvent));
  }, [attendeesByEvent]);

  const selectedAttendees = attendeesByEvent[selectedEvent] || [];
  const totals = selectedAttendees.reduce(
    (acc, guest) => {
      acc[guest.status] = (acc[guest.status] || 0) + 1;
      return acc;
    },
    { Accepted: 0, Pending: 0, Declined: 0 }
  );

  const visibleGuests = useMemo(() => {
    if (filterStatus === 'All') return selectedAttendees;
    return selectedAttendees.filter(guest => guest.status === filterStatus);
  }, [filterStatus, selectedAttendees]);

  const responseRate = selectedAttendees.length
    ? Math.round(((totals.Accepted + totals.Declined) / selectedAttendees.length) * 100)
    : 0;

  const handleSubmit = event => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const newGuest = {
      id: Date.now(),
      name: form.name.trim(),
      status: form.status
    };

    setAttendeesByEvent(prev => ({
      ...prev,
      [selectedEvent]: [newGuest, ...(prev[selectedEvent] || [])]
    }));
    setForm({ name: '', status: 'Pending' });
  };

  const removeGuest = id => {
    setAttendeesByEvent(prev => ({
      ...prev,
      [selectedEvent]: prev[selectedEvent].filter(guest => guest.id !== id)
    }));
  };

  return (
    <section className="page-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">RSVP planning</span>
          <h1>Manage each event separately</h1>
          <p>Switch between pre-wedding, wedding, and reception guest lists for on-the-go planning.</p>
        </div>
        <div className="event-tabs">
          {eventTypes.map(eventType => (
            <button
              key={eventType}
              type="button"
              className={selectedEvent === eventType ? 'event-tab active' : 'event-tab'}
              onClick={() => {
                setSelectedEvent(eventType);
                setFilterStatus('All');
              }}
            >
              {eventType}
            </button>
          ))}
        </div>
      </div>

      <div className="rsvp-panel">
        <form className="rsvp-form" onSubmit={handleSubmit}>
          <label>
            Guest name
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Enter guest name"
              required
            />
          </label>
          <label>
            Response
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </label>
          <button type="submit" className="button">Add RSVP</button>
        </form>

        <div className="event-controls">
          <label>
            Filter status
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </label>
          <div className="response-summary">
            <strong>{responseRate}%</strong>
            <span>Responses recorded</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="status-card accepted">
          <strong>{totals.Accepted}</strong>
          <span>Accepted</span>
        </div>
        <div className="status-card pending">
          <strong>{totals.Pending}</strong>
          <span>Pending</span>
        </div>
        <div className="status-card declined">
          <strong>{totals.Declined}</strong>
          <span>Declined</span>
        </div>
      </div>

      <div className="rsvp-table">
        <div className="rsvp-row header">
          <span>Guest</span>
          <span>Status</span>
        </div>
        {visibleGuests.length === 0 ? (
          <div className="rsvp-row empty-state">
            <span>No guests for this view yet.</span>
          </div>
        ) : (
          visibleGuests.map(guest => (
            <div key={guest.id} className="rsvp-row">
              <span>{guest.name}</span>
              <span className="rsvp-status-row">
                <span className={`status-pill ${guest.status.toLowerCase()}`}>{guest.status}</span>
                <button type="button" className="button button-secondary small" onClick={() => removeGuest(guest.id)}>
                  Remove
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RSVP;
