import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function AddCourse() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [imageLink, setImageLink] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('authToken');
        console.log("Token:", token); 
    
        try {
            const response = await fetch("http://localhost:3000/admin/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    price: Number(price), 
                    imageLink: imageLink,
                    published: true
                }),
            });
    
            if (response.ok) {
                navigate("/courses"); // Redirect on success
            } else {
                const errorText = await response.text(); // Get the raw response text
                console.error('Error adding course:', errorText);
                // Handle error response (e.g., show a message to the user)
            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network error
        }
    };
    

    return (
        <div className='flex justify-center'>
            <Card variant={'outlined'} style={{ width: 600, padding: 10, margin:20}}>
                <CardContent>
                    <Typography variant="h5" component="h2" className="mb-4">
                        Add Course
                    </Typography>
                    <form className='p-4' onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-4'>
                        <TextField 
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            fullWidth={true}
                            label="Title"
                            variant='outlined'
                            required
                        />
                        <TextField 
                            onChange={(e) => setDesc(e.target.value)}
                            value={description}
                            fullWidth={true}
                            label="Description"
                            variant='outlined'
                            multiline
                            rows={4}
                            required
                        />
                        <TextField 
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            fullWidth={true}
                            label="Price"
                            variant='outlined'
                            type="number" // Make sure this is a number input
                            required
                        />
                        <TextField 
                            onChange={(e) => setImageLink(e.target.value)}
                            value={imageLink}
                            fullWidth={true}
                            label="Image Link"
                            variant='outlined'
                            required
                        />
                        <div className='mt-4'>
                            <Button variant="contained" type="submit">Add Course</Button>
                        </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
