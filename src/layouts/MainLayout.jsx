import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <Navbar />
      <main className="main-content" id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
