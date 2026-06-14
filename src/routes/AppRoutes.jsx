import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import About from '../pages/About.jsx';
import Admin from '../pages/Admin.jsx';
import Contact from '../pages/Contact.jsx';
import Home from '../pages/Home.jsx';
import ProjectDetails from '../pages/ProjectDetails.jsx';
import Projects from '../pages/Projects.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
