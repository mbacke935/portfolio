import ContactForm from '../components/ContactForm.jsx';

export default function Contact() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Discutons d'un projet</h1>
        <p>
          Envoie un message professionnel. Il sera transmis a Supabase lorsque
          les variables d'environnement et les regles RLS seront configurees.
        </p>
      </div>

      <ContactForm />
    </section>
  );
}
