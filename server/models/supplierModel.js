import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true,
    maxlength: [10, 'Contact number cannot exceed']
  },
  address: {
    type: String,
    required: true,
    maxlength: [20, 'Address cannot exceed 20 characters']
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
});

export default mongoose.model('Supplier', SupplierSchema);