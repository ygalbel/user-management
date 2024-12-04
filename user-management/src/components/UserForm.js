import React, { useState, useEffect } from "react";
import { createUser, getUserById, updateUser } from "../api";
import { useNavigate, useParams } from "react-router-dom";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    FirstName: "",
    LastName: "",
    EmailAddress: "",
    Password: "",
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await getUserById(id);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateUser(id, user);
      } else {
        await createUser(user);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{id ? "Add User" : "Add User"}</h1>
      <label>
        First Name:
        <input
          type="text"
          name="FirstName"
          value={user.FirstName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="LastName"
          value={user.LastName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email Address:
        <input
          type="email"
          name="EmailAddress"
          value={user.EmailAddress}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="Password"
          value={user.Password}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default UserForm;
