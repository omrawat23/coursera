import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import Courses from './components/Courses';
import Course from './components/Course';
import AddCourse from './components/AddCourse';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Homepage />} />
                <Route path="/addcourse" element={<AddCourse />} />
                <Route path="/courses" element={<Courses/>} />
                <Route path="/courses/:courseId" element={<Course/>} />
            </Routes>
        </Router>
    );
};

export default App;