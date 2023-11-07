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
        <div className="cardGrid">
            <h1>My Courses</h1>
            <div className="cards-container">
                {courses.map(course => (
                    <Link to={`/course/${course.id}`} key={course.id} className="card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/2048px-Square_gray.svg.png" alt="img" style={{width:"100%"}}/>
                        <div className="cardContainer">
                            <h4><b>{course.name}</b></h4>
                            <p>{course.id}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MyCourses;
