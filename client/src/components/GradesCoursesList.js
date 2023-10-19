import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Make sure to import Link

function GradesCoursesList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:5000/api/courses/my-courses');
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        
        fetchCourses();
    }, []);

    return (
        <div>
            <h1>View Grades For:</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <Link to={`/grades/${course.id}`}>{course.name}</Link> {/* Use Link to make it clickable */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GradesCoursesList;
