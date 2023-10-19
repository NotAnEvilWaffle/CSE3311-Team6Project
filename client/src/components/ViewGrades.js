import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ViewGrades() {
    const { courseId } = useParams(); // getting courseId from the URL
    const [courseInfo, setCourseInfo] = useState({
        courseName: '',
        overallScore: '',
        gradedAssignments: [] 
    });

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function fetchCourseInfo() {

            try {
                const response = await axios.get(`http://localhost:5000/api/courses/my-profile`);
                const userId = response.data.id;
                setUserId(userId);
            } catch (error) {
                console.error("Error finding User Profile:", error);
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${userId}/courses/${courseId}/assignments`);
                setCourseInfo(prevState => ({
                    ...prevState,
                    gradedAssignments: response.data}));
                console.log('ViewGrades response:', response.data);
            } catch (error) {
                console.error("Error fetching course info:", error);
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/courseName`);
                const courseName = response.data;
                setCourseInfo(prevState => ({
                    ...prevState,
                    courseName: courseName,
                }));
            } catch (error) {
                console.error("Error finding Course Profile:", error);
            }



        };
        fetchCourseInfo();
    }, [courseInfo, userId]);



    return (
        <div>
            <h1>Grades for: {courseInfo.courseName}</h1>
            <p>Overall Score: {courseInfo.overallScore}</p>
            <h2>Assignments</h2>
            <ul>
                {courseInfo.gradedAssignments.map((assignment, index) => (
                    <li key={index}>
                        {assignment[0]}: {assignment[1]}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewGrades;
