import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Discussions() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({}); // New state for holding chat history

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:5000/api/courses/my-courses');
                setCourses(response.data);
                // Initialize chat history for each course
                let initialChat = {};
                response.data.forEach(course => {
                    initialChat[course.id] = [];
                });
                setChatHistory(initialChat);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        
        fetchCourses();
    }, []);

    const selectCourse = (course) => {
        setSelectedCourse(course);
        // Here you would fetch the discussion messages for the selected course
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() && selectedCourse) {
            // Append new message to the current chat history of the selected course
            const updatedChat = { ...chatHistory };
            updatedChat[selectedCourse.id] = [...(chatHistory[selectedCourse.id] || []), message];
            setChatHistory(updatedChat);
            // Clear the input after sending a message
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        // When user presses Enter, send the message
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="discussions-container" style={{ display: 'flex' }}>
            <div className="courses-list" style={{ width: '30%', borderRight: '1px solid #ccc' }}>
                <h2>Courses</h2>
                <ul>
                    {courses.map(course => (
                        <li
                          key={course.id}
                          onClick={() => selectCourse(course)}
                          style={{ cursor: 'pointer', fontSize: '0.9em', marginBottom: '15px', textDecoration: 'underline' }}
                        >
                            {course.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chatbox" style={{ width: '70%', paddingLeft: '20px' }}>
                {selectedCourse && (
                    <>
                        <h2>{selectedCourse.name} - Discussions</h2>
                        <div className="chat-history" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {/* Map through the chat history for the selected course */}
                            {chatHistory[selectedCourse.id] && chatHistory[selectedCourse.id].map((msg, index) => (
                                <div key={index} style={{ background: '#f1f1f1', margin: '10px 0', padding: '5px' }}>
                                    {msg}
                                </div>
                            ))}
                        </div>
                        <div className="message-input" style={{ display: 'flex' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={handleMessageChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                style={{ flexGrow: 1, padding: '10px' }}
                            />
                            <button onClick={handleSendMessage} style={{ padding: '10px' }}>Send</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Discussions;
