import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post("http://localhost:3000/admin/signup", formData);
            if (response.status === 200) {
                const token = response.data.token; 
                localStorage.setItem('authToken', token); 
                 
            }navigate('/login'); 
        } catch (error) {
            setError('Error registering user. Please try again.');
            console.error('Error registering user:', error);
        } finally {
            setLoading(false); // Always reset loading state
        }
    };

    return (
        <div className='flex justify-center items-start mt-44'>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="h2" className="mb-4">
                        Sign Up
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
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
                            <Button variant="contained" type="submit" disabled={loading}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
