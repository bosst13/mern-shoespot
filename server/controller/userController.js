// import user from "../models/userModel.js";
// // const bcrypt = require("bcryptjs");
// export const registerUser = async (req, res) => {
//     try {
//         console.log('Received registration request');
//         console.log('Request Body:', req.body);
//         console.log('Uploaded File:', req.file);

//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "Please fill all fields." });
//         }

//         // Hash password and save user logic here

//         res.status(201).json({ message: "User registered successfully!", user: { name, email } });
//     } catch (error) {
//         console.error('Error during user registration:', error);
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

// export const toggleUserStatus = async(req, res) => {
//     try {
//         const id = req.params.id;
//         const userExist = await user.findById(id);
//         if (!userExist) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         const updatedStatus = await user.findByIdAndUpdate(
//             id, 
//             { active: !userExist.active }, // Toggle the active status
//             { new: true }
//         );
//         res.status(200).json(updatedStatus);
//     } catch (error) {
//         res.status(500).json({ errorMessage: error.message });
//     }
// };

// export const deleteUser = async(req, res) => {
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