import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'A propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navigation principale">
        <NavLink className="brand" to="/">
          Portfolio
        </NavLink>

        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
              key={link.to}
              to={link.to}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
