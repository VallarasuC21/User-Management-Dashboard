import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface FormInputs {
  name: string;
  email: string;
  role: string;
}

const App: React.FC = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormInputs>();
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (editUserId !== null) {
      // Update the existing user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUserId ? { ...user, ...data } : user
        )
      );
      setEditUserId(null);
      reset(); // Reset the form after saving changes
    } else {
      // Add a new user
      setUsers((prevUsers) => [
        ...prevUsers,
        { id: Date.now(), ...data },
      ]);
      reset(); // Clear the form after adding a new user
    }
  };

  const handleEdit = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setEditUserId(id);
      // Populate the form with the user's data for editing
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('role', user.role);
    }
  };

  const handleDelete = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="App">
      <h1>User Management Dashboard</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-group">
          <label>Name</label>
          <input
            {...register('name', { required: 'This field is required' })}
            className="form-input"
            placeholder="Enter full name"
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className="form-input"
            placeholder="Enter email address"
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label>Role</label>
          <select {...register('role', { required: 'This field is required' })} className="form-input">
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Viewer">Viewer</option>
          </select>
          {errors.role && <span className="error-message">{errors.role.message}</span>}
        </div>
        <button type="submit" className="btn btn-submit">{editUserId !== null ? 'Update User' : 'Add User'}</button>
        {editUserId !== null && (
          <button
            type="button"
            onClick={() => {
              reset(); // Clear the form
              setEditUserId(null); // Exit edit mode
            }}
            className="btn btn-cancel"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user.id)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="btn btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="btn btn-pagination"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="btn btn-pagination"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;










