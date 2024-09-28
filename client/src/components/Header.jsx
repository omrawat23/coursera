import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function Header() {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://localhost:3000/admin/username", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => {
        console.log("hi")
        setUsername(data.username);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUsername(null);
  };

  return (
    <div className='flex flex-row justify-between items-start p-4'>
      <div>
      <Link to="/">
        <Typography variant="h6" component="h2">
          Coursera
        </Typography>
      </Link>
      </div>

      <div className='flex gap-4'>
        {username ? (
          <>
            <Button variant="contained">Welcome, {username}</Button>
            <Link to="/addcourse">
              <Button variant="contained">Add Course</Button>
            </Link>
            <Button variant="contained" onClick={handleLogout}>Logout</Button>
            
          </>
           
        ) : (
          <>
            <Link to="/login">
              <Button variant="contained">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="contained">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
