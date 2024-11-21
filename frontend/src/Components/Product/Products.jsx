import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Breadcrumbs, Link, Typography, Slider } from '@mui/material';
import Toast from "../Layout/Toast";
import Swal from 'sweetalert2';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
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


  // const filteredProducts = products.filter((product) => {
  //   if (selectedBrands.length === 0) return true;
  //   return selectedBrands.includes(product.brand);
  // });

  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const ratingMatch = ratingFilter === null || product.ratings === ratingFilter;
    return brandMatch && ratingMatch;
  });


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
            min={-1} // -1 represents "All Ratings"
            max={5}
            step={1}
            value={ratingFilter === null ? -1 : ratingFilter} // Map null to -1 for the slider
            onChange={(event, newValue) => setRatingFilter(newValue === -1 ? null : newValue)} // Map -1 back to null
            aria-label="Rating Filter"
            valueLabelDisplay="off" // Hide the value label
          />
          <Typography variant="caption">
            {ratingFilter === null
              ? 'All Products'
              : ratingFilter === 0
              ? 'Rating: 0'
              : `Rating: ${ratingFilter}`}
          </Typography>
        </Box>
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
                        <StarIcon key={index} className="product-stars" style={{ color: '#FFD700' }} />
                      ) : (
                        <StarBorderIcon key={index} className="product-stars" style={{ color: '#FFD700' }} />
                      )
                    )}
                    <span className="product-numOfReviews">({product.numOfReviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
  );
};

export default Products;