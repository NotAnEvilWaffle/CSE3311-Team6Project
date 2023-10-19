import React from 'react';

function ViewGrades() {
    // Hardcoded data
    const courseInfo = {
        name: "CSE-4345-COMPUTATIONAL METHODS",
        overallScore: "92.53%",
        assignments: [
            { name: "HW1", score: "100/100" },
            { name: "Quiz1", score: "50/60" },
            { name: "Quiz2", score: "50/60" }
        ]
    };

    return (
        <div>
            <h1>Grades for: {courseInfo.name}</h1>
            <p>Overall Score: {courseInfo.overallScore}</p>
            <h2>Assignments</h2>
            <ul>
                {courseInfo.assignments.map((assignment, index) => (
                    <li key={index}>
                        {assignment.name}: {assignment.score}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewGrades;
