import { Route, Routes } from 'react-router-dom';

function PlaceholderPage({ title }) {
  return (
    <main className="app-shell">
      <section className="placeholder">
        <p className="eyebrow">Phase 2</p>
        <h1>{title}</h1>
        <p>
          Le projet React + Vite est initialise. Les pages metier seront
          construites apres validation de Supabase et de l'architecture.
        </p>
      </section>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PlaceholderPage title="Portfolio" />} />
      <Route path="*" element={<PlaceholderPage title="Page en preparation" />} />
    </Routes>
  );
}
