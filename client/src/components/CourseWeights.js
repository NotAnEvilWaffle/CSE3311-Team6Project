import React from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook

function CourseWeights() {
    const { courseId } = useParams();  // Use the hook to get the courseId

    return (
        <div>
            <h2>Set Weights for Course ID: {courseId}</h2>
            {/* Your form or interface for setting weights goes here */}
        </div>
    );
}

export default CourseWeights;
