const Product = require('../models/Product')
const cloudinary = require('cloudinary')
const APIFeatures = require('../utils/apiFeatures.js')

//CREATE
exports.createProduct = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please upload product images.'
        });
    }

    let imagesLinks = [];

    for (let i = 0; i < req.files.length; i++) {
        try {
            // Ensure the path is valid and log it
            console.log(`Uploading image from path: ${req.files[i].path}`);

            const result = await cloudinary.v2.uploader.upload(req.files[i].path, {
                folder: 'products',
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({
                success: false,
                message: 'Error uploading images.',
                error: error.message // Include error message for debugging
            });
        }
    }

    req.body.images = imagesLinks;
    const product = await Product.create(req.body);

    if (!product) {
        return res.status(400).json({
            success: false,
            message: 'Product not created.'
        });
    }

    return res.status(201).json({
        success: true,
        product
    });
};

//READ ALL PRODUCTS

exports.getProducts = async (req, res, next) => {
	try {
        const resPerPage = req.query.limit;
        const currentPage = req.query.page;
        const productsCount = await Product.countDocuments();

        const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
        apiFeatures.pagination(resPerPage, currentPage);

        const products = await apiFeatures.query;
        const filteredProductsCount = products.length;

        if (!products) return res.status(400).json({ message: 'Error loading products' });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
            resPerPage,
            filteredProductsCount,
            productsCount
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//FETCH BRANDS
const fetchBrands = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/brands`);
        // Assuming the response contains an array of brands
        setBrands(response.data.brands);  // Set brands from response
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
};

//READ SPECIFIC PRODUCT
exports.getSingleProduct = async (req, res, next) => {
	const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    return res.status(200).json({
        success: true,
        product
    });
};


// UPDATE PRODUCT
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let images = [];

        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
            images = req.body.images;
        }

        if (images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'products',
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesLinks;
        } else {
            req.body.images = product.images;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    if (product.images && product.images.length > 0) {
        const deleteImageResult = await cloudinary.uploader.destroy(product.images[0].public_id);
        if (deleteImageResult.result !== 'ok') {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete image from Cloudinary'
            });
        }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        success: true,
        message: `Product "${product.name}" deleted successfully.`
    });
};