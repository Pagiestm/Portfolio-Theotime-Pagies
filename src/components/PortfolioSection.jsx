import React from 'react';

const PortfolioSection = () => {
  return (
    <section className="portfolio" id="portfolio">
      <h2 className="portfolio__title">Mes Projets</h2>
      <div className="portfolio__grid">
        {/* Exemple de projet */}
        <div className="portfolio__item">
          <h3 className="portfolio__item-title">Projet 1</h3>
          <p className="portfolio__item-description">Description du projet 1.</p>
        </div>
        {/* Ajouter d'autres projets ici */}
      </div>
    </section>
  );
};

export default PortfolioSection;
