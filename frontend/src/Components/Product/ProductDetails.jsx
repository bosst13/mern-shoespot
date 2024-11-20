import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Breadcrumbs, Link, Typography } from '@mui/material';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/product/${id}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="product-details-container">
      <div className="breadcrumbs-container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/" onClick={() => navigate('/')}>
            Home
          </Link>
          <Link color="inherit" href="/products" onClick={() => navigate('/products')}>
            Menu
          </Link>
          <Typography color="textPrimary">{product.name}</Typography>
        </Breadcrumbs>
      </div>

      <div className="product-details-layout">
        <div className="image-section">
          <img src={product.images[selectedImage].url} alt={product.name} className="main-image" />
          <div className="thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className={selectedImage === index ? 'thumbnail selected' : 'thumbnail'}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="product-price">₱{product.price}</p>
          <button className="order-button">Add to Order List</button>
          <button className="buy-button">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
