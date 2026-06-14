import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function LoginIcon() {
  return (
    <svg
      aria-hidden="true"
      className="nav-icon"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 17l5-5-5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M15 12H3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'A propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/credentials', label: 'Diplomes' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin', icon: <LoginIcon /> },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navigation principale">
        <NavLink className="brand" onClick={closeMenu} to="/">
          Portfolio
        </NavLink>

        <button
          aria-controls="site-sidebar"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="menu-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <button
          aria-label="Fermer le menu"
          className={isMenuOpen ? 'menu-backdrop menu-backdrop--visible' : 'menu-backdrop'}
          onClick={closeMenu}
          type="button"
        />

        <aside
          className={isMenuOpen ? 'sidebar-menu sidebar-menu--open' : 'sidebar-menu'}
          id="site-sidebar"
        >
          <div className="sidebar-header">
            <span>Navigation</span>
            <button className="sidebar-close" onClick={closeMenu} type="button">
              Fermer
            </button>
          </div>

          <div className="nav-links">
            {links.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link--active' : 'nav-link'
                }
                key={link.to}
                onClick={closeMenu}
                to={link.to}
                end={link.to === '/'}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
        </aside>
      </nav>
    </header>
  );
}
