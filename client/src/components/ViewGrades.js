import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewGrades.css';
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

            // Get the current UserId
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/my-profile`);
                const userId = response.data.id;
                setUserId(userId);
            } catch (error) {
                console.error("Error finding User Profile:", error);
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${userId}/courses/${courseId}/currentScore`);
                setCourseInfo(prevState => ({
                    ...prevState,
                    overallScore: response.data,
                }));
                console.log("Overall Score:",courseInfo.overallScore)
            } catch (error) {
                console.error("Error finding Course Score:", error);
            }

            // Get that user's assignments for the selected courseId
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${userId}/courses/${courseId}/assignments`);
                setCourseInfo(prevState => ({
                    ...prevState,
                    gradedAssignments: response.data}));

            } catch (error) {
                console.error("Error fetching course info:", error);
            }

            // Get the name of the current course
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
        <div className="grades-container">
    <h1>Grades for: {courseInfo.courseName}</h1>
    <p style={{fontSize: "larger"}}>Overall Score: {courseInfo.overallScore}</p>
    <h2 className="assignments-title">Assignments</h2>
    <div className="assignment-list">
        <div className="assignment">
                <p style={{fontWeight:"bold"}}>Name</p>
                <p style={{fontWeight:"bold"}}>Score</p>
            </div>

        {courseInfo.gradedAssignments.map((assignment, index) => (
            <div className="assignment" key={index}>
                <p>{assignment[0]}</p>
                <p>{assignment[1]}</p>
            </div>
        ))}
    </div>
</div>
    );
}

export default ViewGrades;
