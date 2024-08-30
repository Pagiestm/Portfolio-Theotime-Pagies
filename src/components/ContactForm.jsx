import React from 'react';

const ContactForm = () => {
  return (
    <section className="contact" id="contact">
      <h2 className="contact__title">Contactez-moi</h2>
      <form className="contact__form">
        <input type="text" className="contact__input" placeholder="Nom" required />
        <input type="email" className="contact__input" placeholder="Email" required />
        <textarea className="contact__textarea" placeholder="Votre message" required></textarea>
        <button type="submit" className="contact__button">Envoyer</button>
      </form>
    </section>
  );
};

export default ContactForm;
