import React, { useState, useEffect } from 'react';

function ToDoList() {
    const [upcomingAssignments, setUpcomingAssignments] = useState([]);
    const [newAssignmentName, setNewAssignmentName] = useState('');
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

    // Load assignments from local storage when the component mounts
    useEffect(() => {
        const storedAssignments = localStorage.getItem('assignments');
        if (storedAssignments) {
            setUpcomingAssignments(JSON.parse(storedAssignments));
        } else {
            // Fallback to hardcoded assignments if nothing in local storage
            setUpcomingAssignments([
                { name: 'HW4 for CSE-4345', due_at: '2023-11-29' },
                { name: 'Project 2 for CSE 4309', due_at: '2023-11-30' },
                { name: 'Individual Sprint Report #8 for CSE 4317', due_at: '2023-12-01' },
                { name: 'Project presentation', due_at: '2023-11-30' }
            ]);
        }
    }, []);

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
            name: newAssignmentName,
            due_at: newAssignmentDueDate
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
                        {assignment.name} - Due: {new Date(assignment.due_at).toLocaleDateString()}
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
