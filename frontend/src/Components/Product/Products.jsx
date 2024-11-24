import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Breadcrumbs, Link, Typography, Slider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0); // Slider filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(10);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/products`);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleBrandChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedBrands((prev) => [...prev, value]);
    } else {
      setSelectedBrands((prev) => prev.filter((brand) => brand !== value));
    }
  };

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value); // Update slider value
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products
    .filter((product) => {
      // Filter by brand
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      // Filter by rating
      const ratingMatch = ratingFilter === 0 || product.ratings >= ratingFilter;
      // Filter by search query
      const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return brandMatch && ratingMatch && searchMatch;
    })
    .slice(0, visibleProducts); // Apply pagination

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + itemsPerPage);
      setLoadingMore(false);
    }, 1000);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="products-page">
      <div className="breadcrumbs-container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/" onClick={() => navigate('/')}>
            Home
          </Link>
          <Typography color="textPrimary">Shoes</Typography>
        </Breadcrumbs>
      </div>

      <div className="products-content">
        <div className="products-sidebar">
          <h5>Search</h5>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <h5>Sort by</h5>
          <select onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>

          <h5>Brand</h5>
          <div>
            <input type="checkbox" id="Adidas" name="brand" value="Adidas" onChange={handleBrandChange} />
            <label htmlFor="Adidas">Adidas</label>
          </div>
          <div>
            <input type="checkbox" id="Nike" name="brand" value="Nike" onChange={handleBrandChange} />
            <label htmlFor="Nike">Nike</label>
          </div>
          <div>
            <input type="checkbox" id="Converse" name="brand" value="Converse" onChange={handleBrandChange} />
            <label htmlFor="Converse">Converse</label>
          </div>

          <h5>Ratings</h5>
          <div className="ratings-slider">
            <label htmlFor="rating-slider">Minimum Rating: {ratingFilter} stars</label>
            <input
              type="range"
              id="rating-slider"
              min="0"
              max="5"
              step="1"
              value={ratingFilter}
              onChange={handleRatingFilterChange}
            />
          </div>
        </div>

        <div className="products-container">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.images[0].url} alt={product.name} />
              <div className="product-card-content">
                <h3>{product.name}</h3>
                <p className="product-price">₱{product.price}</p>
                <div className="product-rating">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < product.ratings ? (
                      <StarIcon key={index} className="product-stars" style={{ color: 'blue' }} />
                    ) : (
                      <StarBorderIcon key={index} className="product-stars" style={{ color: 'blue' }} />
                    )
                  )}
                  <span className="product-numOfReviews">({product.numOfReviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div id="load-more-trigger" style={{ height: '20px', marginTop: '20px' }}></div>
      </div>
    </div>
  );
};

export default Products;
