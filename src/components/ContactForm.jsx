export default function ContactForm() {
  return (
    <form className="contact-form">
      <label>
        Nom
        <input name="name" placeholder="Votre nom" type="text" />
      </label>

      <label>
        Email
        <input name="email" placeholder="votre@email.com" type="email" />
      </label>

      <label>
        Sujet
        <input name="subject" placeholder="Sujet du message" type="text" />
      </label>

      <label>
        Message
        <textarea name="message" placeholder="Votre message" rows="5" />
      </label>

      <button className="button button--primary" type="button">
        Envoyer bientot
      </button>
    </form>
  );
}
