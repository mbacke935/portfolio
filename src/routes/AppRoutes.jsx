import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';

const About = lazy(() => import('../pages/About.jsx'));
const Admin = lazy(() => import('../pages/Admin.jsx'));
const Contact = lazy(() => import('../pages/Contact.jsx'));
const Home = lazy(() => import('../pages/Home.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails.jsx'));
const Projects = lazy(() => import('../pages/Projects.jsx'));

function RouteLoader() {
  return (
    <section className="page-section page-section--compact">
      <p className="status-note">Chargement de la page...</p>
    </section>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
