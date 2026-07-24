import { useEffect, useMemo, useState } from 'react';

const vendors = [
  { name: 'Elegant Events', category: 'Venue', rate: '$3,200', description: 'Spacious halls and premium catering packages.' },
  { name: 'Floral Aura', category: 'Decor', rate: '$1,100', description: 'Custom floral installations and ambient styling.' },
  { name: 'Candlelight Catering', category: 'Catering', rate: '$2,500', description: 'Seasonal menus crafted for weddings and galas.' },
  { name: 'Frame & Focus', category: 'Photography', rate: '$1,300', description: 'Creative coverage for ceremony and reception.' },
  { name: 'Stage & Sound', category: 'Entertainment', rate: '$1,900', description: 'Live music, DJ services, and lighting design.' },
  { name: 'Sweet Treats', category: 'Catering', rate: '$1,400', description: 'Dessert stations and custom cake design.' }
];

function Vendors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [bookedVendors, setBookedVendors] = useState(() => {
    const saved = window.localStorage.getItem('eventPlannerBookedVendors');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeVendor, setActiveVendor] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('eventPlannerBookedVendors', JSON.stringify(bookedVendors));
  }, [bookedVendors]);

  const categories = useMemo(
    () => ['All', ...new Set(vendors.map(vendor => vendor.category))],
    []
  );

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = category === 'All' || vendor.category === category;
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="page-section">
      <div className="section-heading-row">
        <div>
          <h1>Vendor Directory</h1>
          <p>Filter vendors by category, search by name, and compare availability.</p>
        </div>
        <div className="vendor-controls">
          <input
            type="search"
            placeholder="Search vendors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="filter-input"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="vendor-list">
        {filteredVendors.map(vendor => {
          const isBooked = bookedVendors.includes(vendor.name);
          return (
            <article key={vendor.name} className="vendor-card">
              <div className="vendor-card-header">
                <h2>{vendor.name}</h2>
                <span className={`status-pill ${isBooked ? 'booked' : 'available'}`}>
                  {isBooked ? 'Booked' : 'Available'}
                </span>
              </div>
              <p className="vendor-category">{vendor.category}</p>
              <p className="vendor-description">{vendor.description}</p>
              <p className="vendor-rate">{vendor.rate}</p>
              <button
                className="button"
                onClick={() => setActiveVendor(vendor)}
                disabled={isBooked}
              >
                {isBooked ? 'Already Booked' : 'Request Booking'}
              </button>
            </article>
          );
        })}
        {filteredVendors.length === 0 && (
          <div className="empty-state">No vendors match your filters.</div>
        )}
      </div>

      <section className="booking-confirmation">
        <h2>Confirmed Bookings</h2>
        {bookedVendors.length > 0 ? (
          <ul>
            {bookedVendors.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No confirmed bookings yet.</p>
        )}
      </section>

      {activeVendor && (
        <div className="modal-overlay" onClick={() => setActiveVendor(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {activeVendor.name}</h2>
              <button className="modal-close" onClick={() => setActiveVendor(null)}>&times;</button>
            </div>
            <p>{activeVendor.description}</p>
            <p><strong>Category:</strong> {activeVendor.category}</p>
            <p><strong>Rate:</strong> {activeVendor.rate}</p>
            <button className="button" onClick={() => {
              if (!bookedVendors.includes(activeVendor.name)) {
                setBookedVendors(prev => [...prev, activeVendor.name]);
              }
              setActiveVendor(null);
            }}>
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Vendors;
