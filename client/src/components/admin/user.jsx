import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import "../../App.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    email: '',
    password: '',
    role: '',
    status: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { name: 'ID', selector: row => row._id, sortable: true },
    { 
      name: 'Avatar', 
      cell: row => row.avatar ? (
        <img src={row.avatar.url} alt={row.name} className='avatar' />
      ) : (
        <span>No Avatar</span>
      ) 
    },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Password', selector: row => row.password, sortable: true },
    { name: 'Role', selector: row => row.role === 0 ? 'Admin' : 'User', sortable: true },
    { name: 'Status', selector: row => row.status ? 'Active' : 'Inactive', sortable: true },
    {
        name: 'Actions',
        cell: row => 
          <div>
            <button type="button" className="btn btn-info" onClick={() => handleEdit(row)}>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
    },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status ? '1' : '0',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.put(`http://localhost:3000/api/update/user/${selectedUser._id}`, formData);

      const updatedUsers = users.map(user => 
        user._id === response.data._id ? response.data : user
      );
      setUsers(updatedUsers); 
      setIsModalOpen(false);  
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  return (
    <div className="userTable">
      <DataTable
        title="Users"
        columns={columns}
        data={users}
        pagination
      />

      {isModalOpen && (
        <div className='modal-container'>
          <div className='modal-content'>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <form className='shadow-lg p-4' onSubmit={handleSubmit}>
              <h3 className='mt-2 mb-5'>Update User</h3>

              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                  type='text'
                  id='name'
                  className='form-control'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  className='form-control'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  id='password'
                  className='form-control'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Leave blank if not changing'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='role'>Role</label>
                <select
                  id='role'
                  className='form-control'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value='1'>User</option>
                  <option value='0'>Admin</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='status'>Status</label>
                <select
                  id='status'
                  className='form-control'
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value='1'>Active</option>
                  <option value='0'>Inactive</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='avatar'>Avatar</label>
                <input
                  type='file'
                  id='avatar'
                  className='form-control'
                  name='avatar'
                  onChange={handleChange}
                />
              </div>

              <button type='submit' className='btn update-btn btn-block mt-4 mb-3'>
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
