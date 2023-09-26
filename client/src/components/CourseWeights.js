import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Importing Link along with useParams
import axios from 'axios';

function CourseWeights() {
    const { courseId } = useParams();

    const [weights, setWeights] = useState({
        homeworks: '',
        tests: '',
        quizzes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWeights(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addNewField = () => {
        setWeights(prevState => ({
            ...prevState,
            ['']: '' // Adds a new empty key-value pair
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/courses/${courseId}/weights`, weights);
            console.log(response.data);
        } catch (error) {
            console.error("Error updating weights:", error);
        }
    };

    return (
        <div>
            <h2>Set Weights for Course ID: {courseId}</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(weights).map(key => (
                    <div key={key}>
                        <label>{key}</label>
                        <input 
                            type="number"
                            name={key}
                            value={weights[key]}
                            onChange={handleChange}
                            placeholder="Weight Name"
                        />
                    </div>
                ))}
                <button type="button" onClick={addNewField}>Add New Weight</button>
                <button type="submit">Submit</button>
            </form>
            <Link to="/">Go Back to Home</Link> {/* Added this line to create a navigation link back to the homepage */}
        </div>
    );
}

export default CourseWeights;
