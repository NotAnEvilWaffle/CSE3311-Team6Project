import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import the Link component

function MyCourses() {
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:5000/api/courses/my-courses');
                // console.log("Fetched Courses:", response.data); 
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        
        fetchCourses();
    }, []);

    return (
        <div>
            <h1>My Courses</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <Link to={`/course/${course.id}`}>{course.name}</Link> {/* Make each course clickable */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyCourses;
