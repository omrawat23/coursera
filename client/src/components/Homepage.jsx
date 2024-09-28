// pages/homepage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to CourseBro</h1>
        <p className="text-xl mb-6">
    
        </p>
        <Link to='/courses'>
        <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition">
          Get Started
        </button>
        </Link>
      </main>

      <footer className="w-full py-4 bg-gray-800 text-center">
        <p>&copy; 2024 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
