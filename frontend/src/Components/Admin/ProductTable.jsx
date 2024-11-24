import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductTable = () => {
    const [data, setData] = useState([]);
    const [brands, setBrands] = useState([]);  // State to store brands fetched from backend
    const [openDialog, setOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
    

        name: '',
        description: '',
        price: '',
        brand: '',
        status: '',
        images: []  // To store selected images
    });

    const [expandedRows, setExpandedRows] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API;

    // Fetch products and brands from the backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            const products = response.data.products.map((product) => ({
                id: product._id,
                name: product.name,
                price: `₱${product.price}`,
                category: product.brand,
                description: product.description,
                images: product.images,
                action: product.status,
                reviews: product.reviews || [],  // Ensure reviews array is available
            }));
            setData(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDeleteReview = async (productId, reviewId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/v1/product/${productId}/review/${reviewId}`);
            if (response.data.success) {
                Swal.fire("Success", "Review deleted successfully.", "success");
                setAlertMessage('Review deleted successfully.');
                setAlertSeverity('success');
                setAlertOpen(true);
                fetchProducts(); // Refresh product data
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            Swal.fire("Error", "Error deleting review.", "error");
            setAlertMessage('Error deleting review.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/brands`);
            setBrands(response.data.brands);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input change (multiple images)
    const handleImageChange = (e) => {
        const files = e.target.files;
        setNewProduct((prev) => ({ ...prev, images: files }));
    };

    // Handle Add Product submission
    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('brand', newProduct.brand);
        formData.append('status', newProduct.status);

        // Append each selected image to FormData
        for (let i = 0; i < newProduct.images.length; i++) {
            formData.append('images', newProduct.images[i]);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/products`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                fetchProducts();  // Refresh product list
                handleCloseDialog();  // Close dialog
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProduct({
            name: '',
            description: '',
            price: '',
            brand: '',
            status: '',
            images: []  // Reset images array
        });
    };

    const columns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Product Name' },
        { name: 'price', label: 'Price' },
        { name: 'category', label: 'Brand' },
        { name: 'action', label: 'Action', options: { customBodyRender: (value, tableMeta) => {
            const productId = data[tableMeta.rowIndex].id;
            return (
                <div>
                    <Button
                        onClick={() => handleEditProduct(productId)} // Implement edit functionality
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: '10px' }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDeleteProduct(productId)} // Implement delete functionality
                        variant="outlined"
                        color="secondary"
                    >
                        Delete
                    </Button>
                </div>
            );
        }}}
    ];

    const options = {
        selectableRows: 'none',
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const product = data[rowMeta.dataIndex];
            return (
                <tr>
                    <td colSpan={6}>
                        <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
                            <h4>Description:</h4>
                            <p>{product.description}</p>
                            <h4>Images:</h4>
                            {product.images && product.images.length > 0 ? (
                                product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}  // Assuming image URL from backend
                                        alt={`Product ${index}`}
                                        style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                    />
                                ))
                            ) : (
                                <p>No images available</p>
                            )}

                        <h4>Reviews:</h4>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review) => (
                                <Box
                                    key={review._id}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={2}
                                    p={2}
                                    bgcolor="#fff"
                                    border="1px solid #ddd"
                                    borderRadius="4px"
                                    marginTop="10px"
                                >
                                    <Box>
                                        <Typography variant="body1">
                                            <strong>User:</strong> {review.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Comment:</strong> {review.comment}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Rating:</strong> {review.rating}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteReview(product.id, review._id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <p>No reviews available</p>
                        )}

                        </div>
                    </td>
                </tr>
            );
        },
    };

    const customTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Products</h3>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Add Product
            </Button>
        </div>
    );

    return (
        <div>
            <MUIDataTable 
                title={customTitle} 
                data={data} 
                columns={columns} 
                options={options} 
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />

                    {/* <FormControl fullWidth margin="normal">
                        <InputLabel>Brand</InputLabel>
                        <Select
                            name="brand"
                            value={newProduct.brand}
                            onChange={handleInputChange}
                        >
                            {brands.map((brand, index) => (
                                <MenuItem key={index} value={brand._id}>
                                    {brand.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

<FormControl fullWidth margin="normal">
                            <InputLabel>Brand</InputLabel>
                            <Select
                                name="brand"
                                value={newProduct.brand}  // Ensure this is controlled by the state
                                onChange={handleInputChange}
                            >
                                {/* If you have predefined brands */}
                                {['Adidas', 'Nike', 'Converse'].map((brand, index) => (
                                    <MenuItem key={index} value={brand}>
                                        {brand}  {/* Display the brand name in the dropdown */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={newProduct.status}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Available">Available</MenuItem>
                            <MenuItem value="Unavailable">Unavailable</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Image Upload */}
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ marginTop: '20px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddProduct} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductTable;