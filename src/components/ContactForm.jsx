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
    errors.name = 'Le nom doit contenir au moins 2 caractères.';
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "L'adresse email est invalide.";
  }

  if (form.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères.';
  }

  return errors;
}

async function sendViaApi(form, adminEmail) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, adminEmail }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Échec de l'envoi.");
  }
}

export default function ContactForm({ adminEmail }) {
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
      setStatus({ type: 'error', message: 'Corrigez les champs indiqués avant envoi.' });
      return;
    }

    if (!adminEmail) {
      setStatus({
        type: 'error',
        message: "Le formulaire n'est pas encore configuré. Revenez plus tard.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoi email via Vercel API → Resend (canal principal)
      await sendViaApi(form, adminEmail);

      // Sauvegarde en base Supabase (historique, non bloquant)
      if (isSupabaseConfigured) {
        submitContactMessage(form).catch(() => {});
      }

      setForm(initialForm);
      setStatus({
        type: 'success',
        message: 'Message envoyé ! Je vous répondrai dans les meilleurs délais.',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || "L'envoi a échoué. Réessayez ou contactez-moi directement par email.",
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
          autoComplete="on"
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
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  );
}
