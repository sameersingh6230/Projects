import { NavLink, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Vendors from './components/Vendors';
import RSVP from './components/RSVP';
import Budget from './components/Budget';
import Dashboard from './components/Dashboard';
import MoodBoard from './components/MoodBoard';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/vendors', label: 'Vendors' },
  { path: '/budget', label: 'Budget' },
  { path: '/rsvp', label: 'RSVP' },
  { path: '/moodboard', label: 'Mood Board' }
];

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Event Planner</div>
        <nav className="nav-links">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/moodboard" element={<MoodBoard />} />
        </Routes>
      </main>

      <footer className="footer">
        Built with React for event planning, vendor management, and RSVP tracking.
      </footer>
    </div>
  );
}

export default App;
