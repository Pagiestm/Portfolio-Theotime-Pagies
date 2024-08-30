import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">Théotime Pagies</h1>
        <nav className="header__nav">
          <a href="#about" className="header__link">À propos</a>
          <a href="#portfolio" className="header__link">Portfolio</a>
          <a href="#contact" className="header__link">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
