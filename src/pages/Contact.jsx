import ContactForm from '../components/ContactForm.jsx';

export default function Contact() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Discutons d'un projet</h1>
        <p>
          Le formulaire sera connecte a la table `contacts` pendant la phase
          Supabase. Pour l'instant, il valide uniquement la structure visuelle.
        </p>
      </div>

      <ContactForm />
    </section>
  );
}
