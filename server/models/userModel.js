import mongoose from "mongoose";
import validator  from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: [true, 'Please enter your name'], 
      // maxlength: [10, 'Your name cannot exceed 10 characters']
    },
    email: {
      type: String, 
      required: [true, 'Please enter your email'], 
      validate: [validator.isEmail, 'Please enter valid email address'] 
    },
    password: { 
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [4, 'Your password must be longer than 4 characters'],
      select: false // hide password from the response
    },
    avatar: {
      public_id: {
          type: String,
          required: true
      },
      url: {
          type: String,
          required: true
      }
    },
    role: {
      type: Number,
      enum: [0, 1]
    },
    status: {
      type: Boolean,
      default: true, // true = active, false = deactivated
    },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      next()
  }
  this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

  return resetToken

}

export default mongoose.model("User", userSchema)
