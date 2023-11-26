import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ToDoList() {
    const [upcomingAssignments, setUpcomingAssignments] = useState([]);

    useEffect(() => {
        const fetchUpcomingAssignments = async () => {
            try {
                // Replace with the correct userID and adjust the endpoint if necessary
                const response = await axios.get('http://localhost:5000/api/courses/upcoming-assignments?userId=YOUR_USER_ID');
                setUpcomingAssignments(response.data);
            } catch (error) {
                console.error('Error fetching upcoming assignments:', error);
            }
        };

        fetchUpcomingAssignments();
    }, []);

    return (
        <div>
            <h1>Upcoming Assignments</h1>
            <ul>
                {upcomingAssignments.map((assignment, index) => (
                    <li key={index}>
                        {assignment.name} - Due: {new Date(assignment.due_at).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDoList;
