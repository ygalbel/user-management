import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={() => navigate("/add")}>Add User</button>
      <ul>
        {users.map((user) => (
          <li key={user.ID}>
            {user.FirstName} {user.LastName} ({user.EmailAddress})
            <button onClick={() => handleDelete(user.ID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
