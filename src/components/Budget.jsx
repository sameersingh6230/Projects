import { useEffect, useMemo, useState } from 'react';

const eventTypes = ['Pre-Wedding', 'Wedding', 'Reception'];
const defaultBudgetByEvent = {
  'Pre-Wedding': [
    { id: 1, name: 'Venue deposit', allocated: 3400, spent: 2800 },
    { id: 2, name: 'Bridal styling', allocated: 1600, spent: 1200 }
  ],
  Wedding: [
    { id: 3, name: 'Venue', allocated: 7500, spent: 6800 },
    { id: 4, name: 'Catering', allocated: 6000, spent: 5200 }
  ],
  Reception: [
    { id: 5, name: 'Decor', allocated: 2800, spent: 2400 },
    { id: 6, name: 'Photography', allocated: 1800, spent: 1200 }
  ]
};

function Budget() {
  const [selectedEvent, setSelectedEvent] = useState(eventTypes[0]);
  const [budgetByEvent, setBudgetByEvent] = useState(() => {
    const stored = window.localStorage.getItem('eventPlannerBudgetByEvent');
    return stored ? JSON.parse(stored) : defaultBudgetByEvent;
  });
  const [newItem, setNewItem] = useState({ name: '', allocated: '', spent: '' });

  useEffect(() => {
    window.localStorage.setItem('eventPlannerBudgetByEvent', JSON.stringify(budgetByEvent));
  }, [budgetByEvent]);

  const selectedBudget = budgetByEvent[selectedEvent] || [];
  const totalAllocated = useMemo(
    () => selectedBudget.reduce((sum, item) => sum + item.allocated, 0),
    [selectedBudget]
  );
  const totalSpent = useMemo(
    () => selectedBudget.reduce((sum, item) => sum + item.spent, 0),
    [selectedBudget]
  );
  const remaining = totalAllocated - totalSpent;
  const spendRatio = totalAllocated ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const updateBudgetItem = (id, field, value) => {
    setBudgetByEvent(prev => ({
      ...prev,
      [selectedEvent]: prev[selectedEvent].map(item =>
        item.id === id ? { ...item, [field]: Number(value) || 0 } : item
      )
    }));
  };

  const addBudgetItem = event => {
    event.preventDefault();
    if (!newItem.name.trim()) return;

    const nextItem = {
      id: Date.now(),
      name: newItem.name.trim(),
      allocated: Number(newItem.allocated) || 0,
      spent: Number(newItem.spent) || 0
    };

    setBudgetByEvent(prev => ({
      ...prev,
      [selectedEvent]: [nextItem, ...(prev[selectedEvent] || [])]
    }));
    setNewItem({ name: '', allocated: '', spent: '' });
  };

  const removeBudgetItem = id => {
    setBudgetByEvent(prev => ({
      ...prev,
      [selectedEvent]: prev[selectedEvent].filter(item => item.id !== id)
    }));
  };

  return (
    <section className="page-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Budget planning</span>
          <h1>Track spend for each event separately</h1>
          <p>Manage pre-wedding, wedding, and reception budgets with editable categories and live totals.</p>
        </div>
        <div className="event-tabs">
          {eventTypes.map(eventType => (
            <button
              key={eventType}
              type="button"
              className={selectedEvent === eventType ? 'event-tab active' : 'event-tab'}
              onClick={() => setSelectedEvent(eventType)}
            >
              {eventType}
            </button>
          ))}
        </div>
      </div>

      <div className="budget-summary">
        <div>
          <strong>Total Allocated</strong>
          <p>${totalAllocated.toLocaleString()}</p>
        </div>
        <div>
          <strong>Total Spent</strong>
          <p>${totalSpent.toLocaleString()}</p>
        </div>
        <div>
          <strong>Remaining</strong>
          <p>${remaining.toLocaleString()}</p>
        </div>
        <div className="budget-progress">
          <strong>{spendRatio}% spent</strong>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${spendRatio}%` }} />
          </div>
        </div>
      </div>

      <div className="budget-table">
        <div className="budget-row header">
          <span>Category</span>
          <span>Allocated</span>
          <span>Spent</span>
        </div>
        {selectedBudget.map(item => (
          <div key={item.id} className="budget-row">
            <span>{item.name}</span>
            <input
              type="number"
              className="budget-input"
              value={item.allocated}
              min="0"
              onChange={e => updateBudgetItem(item.id, 'allocated', e.target.value)}
            />
            <span className="budget-spend-group">
              <input
                type="number"
                className="budget-input"
                value={item.spent}
                min="0"
                onChange={e => updateBudgetItem(item.id, 'spent', e.target.value)}
              />
              <button type="button" className="button button-secondary small" onClick={() => removeBudgetItem(item.id)}>
                Remove
              </button>
            </span>
          </div>
        ))}
      </div>

      <form className="budget-add-form" onSubmit={addBudgetItem}>
        <h2>Add category</h2>
        <div className="budget-add-grid">
          <input
            type="text"
            placeholder="Category name"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Allocated"
            value={newItem.allocated}
            onChange={e => setNewItem({ ...newItem, allocated: e.target.value })}
            min="0"
          />
          <input
            type="number"
            placeholder="Spent"
            value={newItem.spent}
            onChange={e => setNewItem({ ...newItem, spent: e.target.value })}
            min="0"
          />
          <button type="submit" className="button button-primary">Add budget item</button>
        </div>
      </form>
    </section>
  );
}

export default Budget;
