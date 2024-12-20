import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Alert, Snackbar, Box, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import LinearProgressWithLabel from './LinearProgressWithLabel.jsx'; // Adjust the import path

const ProductTable = () => {
    const [data, setData] = useState([]);
    const [brands] = useState(['Nike', 'Adidas', 'Converse']);  // Define brands
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);  // Track if editing a product
    const [editProductId, setEditProductId] = useState(null);  // Track the product ID being edited
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        brand: '',  // This will store the selected brand
        status: 'Available',  // Initialize with a default value
    });
    const [images, setImages] = useState([]);  // State to store selected images

    const [expandedRows, setExpandedRows] = useState([]);  // Store the rows that are expanded
    const [selectedRows, setSelectedRows] = useState([]);  // Store the selected rows for bulk delete
    // [selectableRows, setSelectableRows] = useState([]);

    // State for alert
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // State for loading progress
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/products');
            const products = response.data.products.map((product) => ({
                id: product._id,
                name: product.name,
                price: product.price, // Ensure price is a number
                brand: product.brand,
                description: product.description, // Add description
                images: product.images, // Add images
                action: product.status,
                reviews: product.reviews || []
            }));
            setData(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch products
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image input changes
    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    // Convert images to base64 strings
    const convertImagesToBase64 = (files) => {
        return Promise.all(Array.from(files).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }));
    };

    // Handle Add Product submission
    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('brand', newProduct.brand);
        formData.append('status', newProduct.status);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        console.log("Adding product with data:", formData);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/admin/product/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                fetchProducts();  // Refresh products list
                handleCloseDialog();  // Close the dialog
            }
        } catch (error) {
            console.error('Error adding product:', error.response ? error.response.data : error.message);
        }
    };

    // Handle Edit Product submission
    const handleEditProduct = async () => {
        setLoading(true);
    
        const base64Images = await convertImagesToBase64(images); // Convert images to base64
        const productData = {
            ...newProduct,
            images: base64Images,
        };
    
        console.log("Editing product with ID:", editProductId);
        console.log("Updated product data:", productData);
    
        try {
            const response = await axios.put(
                `http://localhost:5000/api/v1/admin/product/update/${editProductId}`, // Correctly use editProductId in the URL
                productData, // Send productData as the body
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure proper content type
                    },
                    onUploadProgress: (progressEvent) => {
                        const totalLength = progressEvent.lengthComputable
                            ? progressEvent.total
                            : progressEvent.target.getResponseHeader('content-length') ||
                              progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength !== null) {
                            setProgress(Math.round((progressEvent.loaded * 100) / totalLength));
                        }
                    },
                }
            );
    
            console.log("Update response:", response.data);
    
            if (response.data.success) {
                await fetchProducts(); // Refresh the product list
                handleCloseDialog(); // Close the dialog
                setAlertMessage('Product updated successfully.');
                setAlertSeverity('success');
                setAlertOpen(true);
            }
        } catch (error) {
            console.error('Error editing product:', error.response || error.message);
            setAlertMessage('Error updating product.');
            setAlertSeverity('error');
            setAlertOpen(true);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };
// Handle Delete Product with confirmation
const handleDeleteProduct = (productId) => {
    Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then(async (willDelete) => {
        if (willDelete) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/v1/admin/product/delete/${productId}`);
                if (response.data.success) {
                    fetchProducts();  // Refresh products list
                    Swal.fire("Poof! Your product has been deleted!", {
                        icon: "success",
                    });
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                Swal.fire("Error! Your product could not be deleted!", {
                    icon: "error",
                });
            }
        } else {
            Swal.fire("Your product is safe!");
        }
    });
};

const handleDeleteReview = async (productId, reviewId) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/product/${productId}/review/${reviewId}`);
        if (response.data.success) {
            fetchProducts();  // Refresh products list
            Swal.fire("Poof! Your review has been deleted!", {
                icon: "success",
            });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire("Error! Your product could not be deleted!", {
            icon: "error",
        });
    }
};

// Handle Bulk Delete Products with confirmation
const handleBulkDeleteProducts = async () => {
    if (selectedRows.length === 0) {
        Swal.fire("No products selected for deletion!", {
            icon: "warning",
        });
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover these products!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then(async (willDelete) => {
        if (willDelete) {
            try {
                const response = await axios.post('http://localhost:5000/api/v1/admin/products/deletebulk', { ids: selectedRows });
                if (response.data.success) {
                    fetchProducts();  // Refresh products list
                    setSelectedRows([]);  // Clear selected rows after successful deletion
                    Swal.fire("Poof! Your selected products have been deleted!", {
                        icon: "success",
                    });
                }
            } catch (error) {
                console.error('Error deleting products:', error);
                Swal.fire("Error! Your selected products could not be deleted!", {
                    icon: "error",
                });
            }
        } else {
            Swal.fire("Your selected products are safe!");
        }
    });
};


    // Open Add/Edit Product Dialog
    const handleOpenDialog = (product = null) => {
        if (product) {
            setIsEditing(true);
            setEditProductId(product.id);
            setNewProduct({
                name: product.name,
                description: product.description,
                price: product.price.toString().replace('₱', ''), // Convert to string and remove currency symbol
                brand: product.brand,
                status: product.status || 'Available',  // Ensure status is set
            });
        } else {
            setIsEditing(false);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                brand: '',  // Reset brand field
                status: 'Available',  // Reset status field to default value
            });
            setImages([]);  // Reset images
        }
        setOpenDialog(true);
    };

    // Close Add/Edit Product Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProduct({
            name: '',
            description: '',
            price: '',
            brand: '',  // Reset brand field
            status: 'Available',  // Reset status field to default value
        });
        setImages([]);  // Reset images
    };

    // Handle Alert Close
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    // Table columns definition
    const columns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Product Name' },
        { name: 'price', label: 'Price' },
        { name: 'brand', label: 'Brand' },
        { name: 'action', label: 'Action', options: { customBodyRender: (value, tableMeta) => {
            const product = data[tableMeta.rowIndex];
            return (
                <div>
                    <Button
                        onClick={() => handleOpenDialog(product)} // Open dialog with product data for editing
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: '10px' }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDeleteProduct(product.id)} // Implement your delete functionality
                        variant="outlined"
                        color="secondary"
                    >
                        Delete
                    </Button>
                </div>
            );
        }}}
    ];

    //BAGO LANG TO

    const options = {
        selectableRows: 'multiple',  // Enable row selection for bulk delete
        onRowsDelete: (rowsDeleted) => {
            const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex].id);
            setSelectedRows(idsToDelete);
            handleBulkDeleteProducts();
            return false;  // Prevent default delete action
        },
        expandableRows: true,    // Enable expandable rows
        expandableRowsHeader: false,  // Hide expandable rows header
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
                                        src={image.url}
                                        alt={`Product ${index}`}
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                ))
                            ) : (
                                <p>No images available</p>
                            )}

<h4>Reviews:</h4>
                            {product.reviews?.length > 0 ? (
                                product.reviews.map((review, index) => (
                                    <Box
                                        key={index}
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
                                                <strong>Rating:</strong> {review.rating} / 5
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteReview(product.id, review._id)}
                                        >
                                            Delete Review
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
        onRowExpansionChange: (curExpandedRow, allExpandedRows) => {
            setExpandedRows(allExpandedRows);  // Keep track of expanded rows
        },
    };

    // const options = {
    //     selectableRows: 'multiple',  // Enable row selection for bulk delete
    //     onRowsDelete: (rowsDeleted) => {
    //         const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex].id);
    //         setSelectedRows(idsToDelete);
    //         return false;  // Prevent default delete action
    //     },
    //     expandableRows: true,    // Enable expandable rows
    //     expandableRowsHeader: false,  // Hide expandable rows header
    //     renderExpandableRow: (rowData, rowMeta) => {
    //         const product = data[rowMeta.dataIndex];
    //         return (
    //             <tr>
    //                 <td colSpan={6}>
    //                     <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
    //                         <h4>Description:</h4>
    //                         <p>{product.description}</p>
    //                         <h4>Images:</h4>
    //                         {product.images && product.images.length > 0 ? (
    //                             product.images.map((image, index) => (
    //                                 <img
    //                                     key={index}
    //                                     src={image.url}
    //                                     alt={`Product ${index}`}
    //                                     style={{ width: '50px', height: '50px', marginRight: '10px' }}
    //                                 />
    //                             ))
    //                         ) : (
    //                             <p>No images available</p>
    //                         )}
    //                     </div>
    //                 </td>
    //             </tr>
    //         );
    //     },
    //     onRowExpansionChange: (curExpandedRow, allExpandedRows) => {
    //         setExpandedRows(allExpandedRows);  // Keep track of expanded rows
    //     },
    // };
    // Custom title with 'Add Product' and 'Bulk Delete' buttons
    const customTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Products</h3>
            <div>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    Add Product
                </Button>
                <Button variant="contained" color="secondary" onClick={handleBulkDeleteProducts} style={{ marginLeft: '10px' }}>
                    Bulk Delete
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {/* MUI DataTable */}
            <MUIDataTable 
                title={customTitle} 
                data={data} 
                columns={columns} 
                options={options} 
            />

            {/* Add/Edit Product Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Brand</InputLabel>
                        <Select
                            name="brand"
                            value={newProduct.brand}
                            onChange={handleInputChange}
                        >
                            {brands.map((brand, index) => (
                                <MenuItem key={index} value={brand}>
                                    {brand}
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
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        style={{ marginTop: '16px' }}
                    />
                    {loading && <LinearProgressWithLabel value={progress} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={isEditing ? handleEditProduct : handleAddProduct} color="primary">
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alert Snackbar */}
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductTable;