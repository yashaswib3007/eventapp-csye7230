import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Ensure react-slick is installed
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import logoImage from './Images/Website logo.png';
import placeholderImage from './Images/maxresdefault.jpg'; // Placeholder image path
import './Homepage.css'; // Ensure you have this CSS file for styling

function Homepage() {
  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={logoImage} alt="Event Central Logo" className="logo-image" />
        </div>
        <nav className="navbar">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/events">Events</Link>
        </nav>
      </header>

      {/* Carousel Section */}
      <section className="carousel-section">
        <Slider {...sliderSettings}>
          <div><img src={placeholderImage} alt="Slide 1" /></div>
          <div><img src={placeholderImage} alt="Slide 2" /></div>
          
        </Slider>
      </section>

      {/* Editor Picks Section */}
      <section className="editor-picks-section">
        <h2>Editor's Picks</h2>
        <div className="cards-container">
          <div className="card"><img src={placeholderImage} alt="Editor Pick 1" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 2" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 3" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 4" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 5" /></div>
          {/* Add more cards as needed */}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="editor-picks-section">
        <h2>Featured Events</h2>
        <div className="cards-container">
        <div className="card"><img src={placeholderImage} alt="Editor Pick 1" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 2" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 3" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 4" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 5" /></div>
        </div>
      </section>

      {/* Handpicked Collections Section */}
      <section className="editor-picks-section">
        <h2>Handpicked Collections</h2>
        <div className="cards-container">
        <div className="card"><img src={placeholderImage} alt="Editor Pick 1" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 2" /></div>
        </div>
      </section>

      {/* Events Near Me Section */}
      <section className="editor-picks-section">
        <h2>Events near me</h2>
        <div className="cards-container">
          <div className="card"><img src={placeholderImage} alt="Editor Pick 1" /></div>
          <div className="card"><img src={placeholderImage} alt="Editor Pick 2" /></div>
          {/* Add more cards as needed */}
        </div>
      </section>

    </div>
  );
}

export default Homepage;
