import { Button, Card, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [updatedCourse, setUpdatedCourse] = useState({
         title: '', description: '', imageLink: '', price: '' });

    useEffect(() => {
        const fetchCourse = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:3000/admin/courses/${courseId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch course data');
                }

                const data = await response.json();
                setCourse(data);
                setUpdatedCourse(data); // Initialize updatedCourse with the fetched course data
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourse();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setUpdatedCourse({
            ...updatedCourse,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/courses/${courseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(updatedCourse),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update course');
            }

            const data = await response.json();
            setCourse(data.course); 
            handleClose(); 

            window.location.href = `http://localhost:5173/courses/${courseId}`;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); 
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <Card className='p-6 sm:w-96'>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <img src={course.imageLink} alt={course.title} className="py-4" />
                <p>{course.description}</p>
                <p className="mt-2">Price: {course.price}</p>

                <div className='mt-4 flex flex-row gap-4'>
                    <Button variant='contained' className='p-4' onClick={handleOpen}>
                        Update Course
                    </Button>
                    <Button variant='contained' className='p-4'>
                        View Course
                    </Button>
                </div>
            </Card>

            {/* Update Course Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Course</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus 
                        margin="dense" 
                        name="title" 
                        label="Title" 
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        value={updatedCourse.title} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        margin="dense" 
                        name="description" 
                        label="Description" 
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        value={updatedCourse.description} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        margin="dense" 
                        name="imageLink" 
                        label="Image Link" 
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        value={updatedCourse.imageLink} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        margin="dense" 
                        name="price" 
                        label="Price" 
                        type="number" 
                        fullWidth 
                        variant="outlined" 
                        value={updatedCourse.price} 
                        onChange={handleChange} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
