import { useMemo, useState } from 'react';

const eventTypes = [
  {
    name: 'Wedding',
    description: 'Romantic ceremonies with full venue styling and guest hospitality.',
    baseBudget: 26000
  },
  {
    name: 'Corporate',
    description: 'Professional launches and meetings with AV support and catering.',
    baseBudget: 18000
  },
  {
    name: 'Birthday',
    description: 'Fun celebrations with themed decor and entertainment packages.',
    baseBudget: 9500
  }
];

function Home() {
  const [selectedType, setSelectedType] = useState(eventTypes[0].name);
  const [guestCount, setGuestCount] = useState(100);

  const eventPackage = eventTypes.find(item => item.name === selectedType);
  const estimatedBudget = useMemo(
    () => Math.round((eventPackage.baseBudget * guestCount) / 120),
    [eventPackage, guestCount]
  );

  return (
    <section className="page-section">
      <div className="hero-panel home-hero">
        <div className="hero-copy">
          <span className="eyebrow">Event planning made simple</span>
          <h1>Design unforgettable events with confidence.</h1>
          <p>Choose your event type, refine guest count, and preview the estimate instantly in a modern React planner.</p>
          <div className="hero-actions">
            <a href="/dashboard" className="button button-primary">Launch Planner</a>
            <a href="/vendors" className="button button-secondary">Browse Vendors</a>
            <a href="/moodboard" className="button button-secondary">Create a Mood Board</a>
          </div>
          <div className="hero-preview-cards">
            <div className="preview-card">
              <span>Type</span>
              <strong>{selectedType}</strong>
            </div>
            <div className="preview-card">
              <span>Guests</span>
              <strong>{guestCount}</strong>
            </div>
            <div className="preview-card">
              <span>Estimated budget</span>
              <strong>${estimatedBudget.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="hero-widget">
          <div className="hero-widget-title">Quick event preview</div>
          <div className="event-type-pill">{selectedType}</div>
          <p>{eventPackage.description}</p>
          <div className="guest-slider">
            <label>Guest count: {guestCount}</label>
            <input
              type="range"
              min="30"
              max="250"
              value={guestCount}
              onChange={e => setGuestCount(Number(e.target.value))}
            />
          </div>
          <div className="budget-preview">
            Estimated budget: <strong>${estimatedBudget.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="home-interactive-grid">
        <div className="interactive-panel">
          <h2>Choose your event type</h2>
          <div className="event-type-buttons">
            {eventTypes.map(type => (
              <button
                key={type.name}
                className={type.name === selectedType ? 'button button-primary active' : 'button button-secondary'}
                onClick={() => setSelectedType(type.name)}
                type="button"
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div className="interactive-panel stats-panel">
          <h2>Why choose Event Planner?</h2>
          <ul>
            <li><strong>Fast setup</strong> for venue, vendors, and guests.</li>
            <li><strong>Smart budgeting</strong> with intuitive cost estimates.</li>
            <li><strong>Interactive dashboard</strong> for scheduling and RSVPs.</li>
          </ul>
        </div>
      </div>

      <div className="feature-grid feature-highlight-grid">
        <article className="feature-card highlight-card">
          <h2>Live vendor lookup</h2>
          <p>Search vendors by category, compare pricing, and book directly from the portal.</p>
        </article>
        <article className="feature-card highlight-card">
          <h2>Real-time attendance</h2>
          <p>Monitor guest responses, manage seating, and keep your RSVP status updated automatically.</p>
        </article>
        <article className="feature-card highlight-card">
          <h2>Secure payments</h2>
          <p>Take deposits, accept guest contributions, and track all payments with clarity.</p>
        </article>
        <article className="feature-card highlight-card">
          <h2>Mood Board Builder</h2>
          <p>Collect images, captions, and ideas in a visual board for your event inspiration.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
