import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="landing-page">
      <div className="shoespot-cover" style={{ textAlign: 'center' }}>
        <h1>Step Into Style</h1>
        <p>Find Your Perfect Pair</p>
        <img 
          src="/images/shows.jpg" 
          alt="Stylish Shoes" 
          width="100%" 
          style={{ marginTop: '10px', objectFit: 'cover', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        />
      </div>
      
      {/* New section below the image */}
      <div className="store-info" style={{ backgroundColor: 'blue', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h2>About Our Store</h2>
        <p>Welcome to ShoeSpot, where fashion meets comfort! Our collection of shoes is carefully curated to ensure you find the perfect pair for any occasion. Whether you're looking for something casual, elegant, or sporty, we've got you covered.</p>
        <p>Visit us today and step into your new favorite shoes!</p>

        {/* New image below the text */}
        <img 
          src="/images/logy.png" 
          alt="Our Store" 
          width="5%" 
          style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }} 
        />

      </div>

      
    </div>
  );
};

export default Home;