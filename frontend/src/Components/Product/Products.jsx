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
  const [loadingMore, setLoadingMore] = useState(false); // State to track if more products are loading
  const [sortOrder, setSortOrder] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(10); // Show first 10 products initially
  const itemsPerPage = 10;
  const itemsPerRowInitial = 4; // Show 4 products per row initially
  const itemsPerRowScroll = 5; // Show 5 products per row after scrolling
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

  useEffect(() => {
    if (sortOrder) {
      sortProducts(sortOrder);
    }
  }, [sortOrder, products]);

  const sortProducts = (order) => {
    let sortedProducts = [...products];
    switch (order) {
      case 'low-to-high':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'a-z':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

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

  const handleRatingChange = (event, newValue) => {
    setRatingFilter(newValue);
  };

  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const ratingMatch = ratingFilter === null || product.ratings === ratingFilter;
    return brandMatch && ratingMatch;
  });

  const paginatedProducts = filteredProducts.slice(0, visibleProducts);

  const handleLoadMore = () => {
    if (loadingMore) return; // Prevent loading again if it's already loading
    setLoadingMore(true); // Set loading state when new products are being loaded
    setTimeout(() => {
      setVisibleProducts((prev) => prev + itemsPerPage); // Load more products after a delay (simulating an API call)
      setLoadingMore(false); // Reset loading state once products are loaded
    }, 1000); // Simulate a loading delay of 1 second
  };

  // Infinite Scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !loadingMore) {
          handleLoadMore();
        }
      },
      { rootMargin: '100px' } // Load more products when near the bottom
    );

    const loadMoreElement = document.getElementById('load-more-trigger');
    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [loading, loadingMore, visibleProducts]);

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
            <label htmlFor="sandwich">Converse</label>
          </div>

          <h5>Ratings</h5>
          <Box sx={{ width: 200 }}>
            <Slider
              className="custom-slider"
              size="small"
              min={-1}
              max={5}
              step={1}
              value={ratingFilter === null ? -1 : ratingFilter}
              onChange={(event, newValue) => setRatingFilter(newValue === -1 ? null : newValue)}
              aria-label="Rating Filter"
              valueLabelDisplay="off"
            />
            <Typography variant="caption">
              {ratingFilter === null ? 'All Products' : ratingFilter === 0 ? 'Rating: 0' : `Rating: ${ratingFilter}`}
            </Typography>
          </Box>
        </div>

        <div className="products-container">
          {paginatedProducts.map((product) => (
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