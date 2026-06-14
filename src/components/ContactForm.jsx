import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { submitContactMessage } from '../services/contactService.js';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function validateContactForm(form) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form.name.trim().length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caracteres.';
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "L'adresse email est invalide.";
  }

  if (form.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caracteres.';
  }

  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    const nextErrors = validateContactForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({
        type: 'error',
        message: 'Corrige les champs indiques avant envoi.',
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
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          name="name"
          onChange={updateField}
          placeholder="Votre nom"
          required
          type="text"
          value={form.name}
        />
        {errors.name && (
          <span className="field-error" id="contact-name-error">
            {errors.name}
          </span>
        )}
      </label>

      <label>
        Email
        <input
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          name="email"
          onChange={updateField}
          placeholder="votre@email.com"
          required
          type="email"
          value={form.email}
        />
        {errors.email && (
          <span className="field-error" id="contact-email-error">
            {errors.email}
          </span>
        )}
      </label>

      <label>
        Sujet
        <input
          autoComplete="off"
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
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={Boolean(errors.message)}
          name="message"
          onChange={updateField}
          placeholder="Votre message"
          required
          rows="5"
          value={form.message}
        />
        {errors.message && (
          <span className="field-error" id="contact-message-error">
            {errors.message}
          </span>
        )}
      </label>

      {status.message && (
        <p className={`form-status form-status--${status.type}`} role="status">
          {status.message}
        </p>
      )}

      <button className="button button--primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}
