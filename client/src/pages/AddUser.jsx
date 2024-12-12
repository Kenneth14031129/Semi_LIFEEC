import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header.jsx";
import "../styles/AddUser.css";
import { api } from "../api/api";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [users, setUsers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const data = await api.get('/user/users');
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setHasError(true);
      setLoading(false);
      toast.error("Error fetching user list: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, password, userType };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
      }

      const newUser = await response.json();
      console.log("New User added:", newUser);
      toast.success("User added successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setUserType("");
      fetchUsers();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data: " + error.message);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "userType", headerName: "User Type", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/delete/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete user.");
        }
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user: " + error.message);
      }
    }
  };
  
  return (
    <div className="page-container">
      <Header />
      <ToastContainer />
      <Paper elevation={4} className="glass-container">
        <Typography variant="h4" gutterBottom className="title">
          Add New User
        </Typography>
        <Typography variant="body1" gutterBottom align="center" className="subtitle">
          Please enter the details of the new user below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                className="glass-input"
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                type="email"
                className="glass-input"
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                type="password"
                className="glass-input"
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth required variant="outlined" className="glass-input">
                <InputLabel id="user-type-label">User Type</InputLabel>
                <Select
                  labelId="user-type-label"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  label="User Type"
                >
                  <MenuItem value="Nurse">Nurse</MenuItem>
                  <MenuItem value="Nutritionist">Nutritionist</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                type="submit"
                className="submit-button"
              >
                Add User
              </Button>
            </Box>
          </Box>
        </form>

        <Typography variant="h5" gutterBottom className="section-title">
          Registered Users
        </Typography>
        <div className="data-grid-container">
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : hasError ? (
            <Typography variant="body1" color="error">
              Error loading users. Please try again.
            </Typography>
          ) : users.length === 0 ? (
            <Typography variant="body1">No users found.</Typography>
          ) : (
            <DataGrid
              rows={users.map(user => ({ ...user, id: user._id }))}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              className="glass-grid"
            />
          )}
        </div>
      </Paper>
    </div>
  );
}

export default AddUser;