import Supplier from '../models/supplierModel.js';

export const createSupplier = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    const newSupplier = new Supplier({ name, contact, address });
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({
            count: suppliers.length,
            data: suppliers
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

export const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        res.status(200).json({
            success: true,
            supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update supplier
export const updateSupplier = async (req, res) => {
    try {
        const { name, phone_number, address } = req.body;
        if (!name || !phone_number || !address) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Supplier updated successfully',
            supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Supplier deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// import supplier from "../models/supplierModel.js";
// // const bcrypt = require("bcryptjs");
// export const registerSupplier = async (req, res) => {
//     try {
//         console.log('Received registration request');
//         console.log('Request Body:', req.body);
//         console.log('Uploaded File:', req.file);

//         const { name, contact, address } = req.body;

//         if (!name || !phone_number || !address) {
//             return res.status(400).json({ message: "Please fill all fields." });
//         }

//         res.status(201).json({ message: "Supplier created successfully!", supplier: { name, contact, address } });
//     } catch (error) {
//         console.error('Error during creating supplier', error);
//         res.status(500).json({ message: "Server error. Please try again." });
//     }
// };

// export const create = async(req, res) => {
//     console.log("Request Body:", req.body);
//     try {
//         const newUser = new user(req.body);
//         const {email} = newUser;

//         const userExist = await user.findOne({email})
//         if(userExist){
//             return res.status(400).json({message: "User already exists"});
//         }
//         const savedData = await newUser.save();
//         res.status(200).json(savedData);
//     } catch (error) {
//         res.status(500).json({ errorMessage: error.message });
//     }
// };

// export const getAllUsers = async(req, res) => {
//     try {
//         const userData = await user.find();
//         if(!userData || userData.length === 0){
//             return res.status(404).json({message: "No users found"});
//         }
//         res.status(200).json(userData);
//     } catch (error) {
//         res.status(500).json({ errorMessage: error.message });
//     }
// };

// export const getUserById = async(req, res) => {
//     try {
//         const id = req.params.id;
//         const userExist = await user.findById(id);
//         if(!userExist){
//             return res.status(404).json({message: "User not found"});
//         }
//         res.status(200).json(userExist);
//     } catch (error) {
//         res.status(500).json({ errorMessage: error.message });
//     }
// };

// export const updateUser = async(req, res) => {
//     try {
//         const id = req.params.id;
//         console.log(`Updating user with ID: ${id}`);
//         console.log(`Request body: ${JSON.stringify(req.body)}`);

//         const userExist = await user.findById(id);
//             if (!userExist) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const updatedData = await user.findByIdAndUpdate(id, req.body, {
//             new: true,
//             runValidators: true,
//           });
      
//           console.log(`Updated user data: ${JSON.stringify(updatedData)}`);
//           res.status(200).json(updatedData);
//         } catch (error) {
//             console.error(`Error updating user: ${error.message}`);
//             res.status(500).json({ errorMessage: error.message });
//           }
// };

// export const deleteSupplier = async(req, res) => {
//     try {
//         const id = req.params.id;
//         const userExist = await user.findById(id);
//         if(!userExist){
//             return res.status(404).json({message: "User not found"});
//         }
//         await user.findByIdAndDelete(id);
//         res.status(200).json({message: "User deleted successfully"});
//     } catch (error) {
//         res.status(500).json({ errorMessage: error.message });
//     }
// }