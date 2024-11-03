import User from "../models/userModel.js";
import sendToken from '../config/jwtToken.js';
import sendEmail from '../config/sendMail.js';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });
        console.log("Test upload result:", result);
        
        const { name, email, password } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
        });
        const token = user.getJwtToken();

        console.log("Generated JWT Token:", token);
        sendToken(user, 200, res)
        // return  res.status(201).json({
      	//     success:true,
      	//     user,
        //     token,
        // })
    } catch (error) {
        console.error('Registration error:', error); // Log any registration errors
        return res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    console.log('Login attempt with:', { email, password });
    // Checks if email and password are entered by user
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Checks if password is correct or not
        const isPasswordMatched = await User.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Send the token back in the response
        sendToken(user, 200, res);
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Server error' });
    }
    /*sendToken(User, 200, res)*/
};

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    return res.status(200).json({
        success: true,
        user,
        role: user.role,
    })
}

// export const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`);
//     }
// });

export const updateProfile = async (req, res) => {
   console.log(req.body.email)
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        let user = await User.findById(req.params.id)
        // console.log(user)
        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);
        console.log("Res", res)
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        },  (err, res) => {
            console.log(err, res);
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(401).json({ message: 'User Not Updated' })
    }

    return res.status(200).json({
        success: true
    })
}

export const updatePassword = async (req, res) => {
    console.log(req.body.password)
    const user = await User.findById(req.user.id).select('+password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' })
    }
    user.password = req.body.password;
     await user.save();
    // const token = user.getJwtToken();

    //  return res.status(201).json({
    //  	success:true,
    //     user,
    //  	token
    //  });
    sendToken(user, 200, res)

}

export const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
       
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:5173/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        return res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
     
    }
}

export const resetPassword = async (req, res) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
       
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
      
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    // const token = user.getJwtToken();

    //  return res.status(201).json({
    //  	success:true,
    //     user,
    //  	token
    //  });
    sendToken(user, 200, res)
}
//admin
export const allUsers = async(req, res) => {
    try {
        const userData = await User.find();
            if(!userData || userData.length === 0){
                return res.status(404).json({message: "No users found"});
            }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};


export const getUserDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(userExist);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export const updateUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body; // Get the data from the request body

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};