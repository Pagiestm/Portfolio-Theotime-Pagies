import React from 'react';
import ProfilePhoto from '../components/ProfilePhoto';
import InfoCard from '../components/InfoCard';
import PortfolioSection from '../components/PortfolioSection';
import ContactForm from '../components/ContactForm';
import TheotimePhoto from '../assets/Theotime.png';

const Home = () => {
  return (
    <main className="home">
      <section className="home__profile" id="about">
        <ProfilePhoto src={TheotimePhoto} alt="Théotime Pagies" />
        <div className="home__content">
          <p className="home__intro">Bienvenue, je suis Théotime Pagies</p>
          <InfoCard />
        </div>
      </section>
      <PortfolioSection />
      <ContactForm />
    </main>
  );
};

export default Home;
