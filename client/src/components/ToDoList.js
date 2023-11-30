import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function ToDoList() {
    const { courseId } = useParams();
    const [courses, setCourses] = useState([]);

    const [upcomingAssignments, setUpcomingAssignments] = useState([]);
    const [newAssignmentName, setNewAssignmentName] = useState('');
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

    // Load assignments from local storage when the component mounts
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

    useEffect(() => {
        async function fetchUpcoming(){
            try{
                let listOfAssignmentLists = [];
                let allAssignments = [];
                const courseIDs = courses.map(course => course.id);

                for(const courseId of courseIDs) {
                    const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/upcomingAssignments`)
                    
                    const assignments = response.data.map(({ name, due_at }) => ({ assignment_name: name, due_date: due_at }))
                    allAssignments = [...allAssignments, ...assignments];
                }
                
                setUpcomingAssignments(allAssignments);
                
            } catch (error){
                console.error("Error fetching upcoming assignments", error);
            }
        }

        if (courses.length > 0) {
            fetchUpcoming();
        }
    }, [courses])

    // Save assignments to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('assignments', JSON.stringify(upcomingAssignments));
    }, [upcomingAssignments]);

    const handleComplete = (index) => {
        const newAssignments = upcomingAssignments.filter((_, i) => i !== index);
        setUpcomingAssignments(newAssignments);
    };

    const handleAdd = (event) => {
        event.preventDefault();
        const newAssignment = {
            assignment_name: newAssignmentName,
            due_date: newAssignmentDueDate
        };
        setUpcomingAssignments([...upcomingAssignments, newAssignment]);
        setNewAssignmentName('');
        setNewAssignmentDueDate('');
    };

    return (
        <div>
            <h1>Upcoming Assignments</h1>
            <ul>
                {upcomingAssignments.map((assignment, index) => (
                    <li key={index}>
                        {assignment.assignment_name} - Due: {new Date(assignment.due_date).toLocaleDateString()}
                        <button onClick={() => handleComplete(index)}>Mark as Completed</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    value={newAssignmentName}
                    onChange={(e) => setNewAssignmentName(e.target.value)}
                    placeholder="Assignment Name"
                    required
                />
                <input
                    type="date"
                    value={newAssignmentDueDate}
                    onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                    required
                />
                <button type="submit">Add Assignment</button>
            </form>
        </div>
    );
}

export default ToDoList;
