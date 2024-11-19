import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function SupplierList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  // const empCollectionRef = collection(db, 'suppliers');

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers'); // Adjust your backend URL as needed
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ padding: '20px' }}
      >
        Supplier List
      </Typography>
      <Divider />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell
                  align="left"
                  style={{ minWidth: "100px" }}
                >
                  Name
                  {/* {column.label} */}
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell key={row.id} align="left">
                          {row.name}
                        </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}



// const Supplier = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     avatar: '',
//     name: '',
//     contact: '',
//     address: '',
//   });

//   const columns = [
//     { name: 'ID', selector: row => row._id, sortable: true },
//     { 
//       name: 'Avatar', 
//       cell: row => row.avatar ? (
//         <img src={row.avatar.url} alt={row.name} className='avatar' />
//       ) : (
//         <span>No Avatar</span>
//       ) 
//     },
//     { name: 'Name', selector: row => row.name, sortable: true },
//     { name: 'Contact', selector: row => row.contact, sortable: true },
//     { name: 'Address', selector: row => row.address, sortable: true },
//     {
//         name: 'Actions',
//         cell: row => 
//           <div>
//             <button type="button" className="btn btn-info" onClick={() => handleEdit(row)}>
//                 <i className="fa-solid fa-pen-to-square"></i>
//             </button>
//           </div>
//     },
//   ];
  
//   const handleEdit = (supplier) => {
//     setSelectedSupplier(supplier);
//     setFormData({
//       avatar: supplier.avatar,
//       name: supplier.name,
//       contact: supplier.contact,
//       address: supplier.address,
//     });
//     setIsModalOpen(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 

//     const formDataToSend = new FormData();
//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('contact', formData.contact);
//     formDataToSend.append('address', formData.address);
//     if (formData.avatar) formDataToSend.append('avatar', formData.avatar[0]);

//     try {
//       const token = localStorage.getItem('token');
//       console.log("Retrieved token:", token); 
//       if (!token) {
//           throw new Error('Authentication token not found');
//       }

//       const response = await axios.put(`http://localhost:3000/api/update/supplier/${selectedSupplier._id}`, 
//           formDataToSend, {
//               headers: {
//                   'Authorization': `Bearer ${token}`,
//                   'Content-Type': 'multipart/form-data', // Ensure you set the content type
//               },
//           }
//       );

//       const updatedSuppliers = suppliers.map(supplier => 
//         supplier._id === response.data._id ? response.data : supplier
//       );
//       setSuppliers(updatedSuppliers); 
//       setIsModalOpen(false);  
//   } catch (error) {
//       //console.log("Error updating user", error);
//       alert('Failed to update the user. Please try again.');
//   }
//   };

//   return (
//     <div className="supplierTable">
//       <MUIDataTable
//         title="Suppliers"
//         columns={columns}
//         data={suppliers}
//         pagination
//       />
  
//       {isCreateModalOpen && (
//         <div className='modal-container'>
//           <div className='modal-content'>
//             <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
//               &times;
//             </button>
//             <form className='shadow-lg p-4' onSubmit={handleSubmit}>
//               <h3 className='mt-2 mb-5'>Create Supplier</h3>
  
//               <div className='form-group'>
//                 <label htmlFor='name'>Name</label>
//                 <input
//                   type='text'
//                   id='name'
//                   className='form-control'
//                   name='name'
//                   value={setFormData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
  
//               <div className='form-group'>
//                 <label htmlFor='contact'>Contact</label>
//                 <input
//                   type='text'
//                   id='contact'
//                   className='form-control'
//                   name='contact'
//                   value={setFormData.contact}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
  
//               <div className='form-group'>
//                 <label htmlFor='address'>Address</label>
//                 <input
//                   type='text'
//                   id='address'
//                   className='form-control'
//                   name='address'
//                   value={setFormData.address}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
  
//               <div className='form-group'>
//                 <label htmlFor='avatar'>Avatar</label>
//                 <input
//                   type='file'
//                   id='avatar'
//                   className='form-control'
//                   name='avatar'
//                   onChange={handleChange}
//                 />
//               </div>
  
//               <button type='submit' className='btn create-btn btn-block mt-4 mb-3'>
//                 Create
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {isUpdateModalOpen && (
//         <div className='modal-container'>
//           <div className='modal-content'>
//             <button className="close-btn" onClick={() => setIsUpdateModalOpen(false)}>
//               &times;
//             </button>
//             <form className='shadow-lg p-4' onSubmit={handleUpdateSubmit}>
//               <h3 className='mt-2 mb-5'>Update Supplier</h3>
  
//               <div className='form-group'>
//                 <label htmlFor='name'>Name</label>
//                 <input
//                   type='text'
//                   id='name'
//                   className='form-control'
//                   name='name'
//                   value={setFormData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
  
//               <div className='form-group'>
//                 <label htmlFor='contact'>Contact</label>
//                 <input
//                   type='text'
//                   id='contact'
//                   className='form-control'
//                   name='contact'
//                   value={setFormData.contact}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
  
//               <div className='form-group'>
//                 <label htmlFor='address'>Address</label>
//                 <input
//                   type='text'
//                   id='address'
//                   className='form-control'
//                   name='address'
//                   value={setFormData.address}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
  
//               <div className='form-group'>
//                 <label htmlFor='avatar'>Avatar</label>
//                 <input
//                   type='file'
//                   id='avatar'
//                   className='form-control'
//                   name='avatar'
//                   onChange={handleChange}
//                 />
//               </div>
  
//               <button type='submit' className='btn update-btn btn-block mt-4 mb-3'>
//                 Update
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Supplier;

