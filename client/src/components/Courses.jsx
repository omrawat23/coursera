import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        const token = localStorage.getItem("authToken");
        if (!token) return;
    
        fetch("http://localhost:3000/admin/courses", {
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
        .then((data)=>{
           setCourses(data.courses)
        })
    },[])



    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Available Courses</h1>
            <div className="grid grid-cols-1 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-xl font-semibold">
                            <Link to={`/courses/${course.id}`}>{course.title}</Link>
                        </h2>
                        <p className="mt-2">{course.description}</p>
                        <img className='py-4' src={course.imageLink} alt={course.title} />
                        <p>{course.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Courses;
