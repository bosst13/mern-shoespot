import { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } from '../controller/supplierController.js';
const route = express.Router()
import express from 'express';

route.post('/', createSupplier);
route.get('/suppliers', getSuppliers);
route.get('/supplier/:id', getSupplierById);
route.put('/supplier/:id', updateSupplier);
route.delete('/supplier/:id', deleteSupplier);

export default route;