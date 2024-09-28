import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



export default function SignIn() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        password:''
    })

    const handleChange = (e)=> {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();

        try {   
        const response = await axios.post("http://localhost:3000/admin/login", formData)
        if(response.status === 200){
          localStorage.setItem('authToken', response.data.token);
          window.location="/";
        }
        } catch (error) {
          console.error('Error signing in:', error);
          // Set error message based on response
          if (error.response && error.response.data) {
              setErrorMessage(error.response.data.message || 'Sign in failed');
          } else {
              setErrorMessage('Network error, please try again later');
          }
      }
    }

  return (
    <div className='flex justify-center items-start mt-44'>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2" className="mb-4">
            Sign In
          </Typography>
          <form className='flex flex-col gap-4 w-96 p-8' onSubmit={handleSubmit}>
            <TextField 
              name="username" 
              label="Username" 
              variant="outlined" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
            <TextField 
              name="password" 
              type="password"
              label="Password" 
              variant="outlined" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <div className='mt-6'>
              <Button variant="contained" type="submit">Sign In</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
