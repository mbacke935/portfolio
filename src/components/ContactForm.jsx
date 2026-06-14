import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { submitContactMessage } from '../services/contactService.js';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        type: 'error',
        message: 'Nom, email et message sont obligatoires.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactMessage(form);
      setForm(initialForm);
      setStatus({
        type: 'success',
        message: 'Message envoye avec succes.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: isSupabaseConfigured
          ? "L'envoi a echoue. Verifie la configuration Supabase et les regles RLS."
          : 'Mode demonstration : configure Supabase pour envoyer le message.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Nom
        <input
          name="name"
          onChange={updateField}
          placeholder="Votre nom"
          type="text"
          value={form.name}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          onChange={updateField}
          placeholder="votre@email.com"
          type="email"
          value={form.email}
        />
      </label>

      <label>
        Sujet
        <input
          name="subject"
          onChange={updateField}
          placeholder="Sujet du message"
          type="text"
          value={form.subject}
        />
      </label>

      <label>
        Message
        <textarea
          name="message"
          onChange={updateField}
          placeholder="Votre message"
          rows="5"
          value={form.message}
        />
      </label>

      {status.message && (
        <p className={`form-status form-status--${status.type}`}>
          {status.message}
        </p>
      )}

      <button className="button button--primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}
