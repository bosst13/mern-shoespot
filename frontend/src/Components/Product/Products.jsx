import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Breadcrumbs, Link, Typography } from '@mui/material';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
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

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((category) => category !== value));
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(product.category);
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
          <Typography color="textPrimary">Menu</Typography>
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
            <input type="checkbox" id="Adidas" name="category" value="Adidas" onChange={handleCategoryChange} />
            <label htmlFor="Adidas">Adidas</label>
          </div>
          <div>
            <input type="checkbox" id="Nike" name="category" value="Nike" onChange={handleCategoryChange} />
            <label htmlFor="Nike">Nike</label>
          </div>
          <div>
            <input type="checkbox" id="Converse" name="category" value="Converse" onChange={handleCategoryChange} />
            <label htmlFor="sandwich">Converse</label>
          </div>

          <h5>Rating</h5>
          <div>
            <input type="checkbox" id="rating1" name="rating" />
            <label htmlFor="rating1">*</label>
          </div>
        </div>

        <div className="products-main">
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
                  <p>₱{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
