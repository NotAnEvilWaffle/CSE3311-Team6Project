import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Discussions() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [userName, setUserName] = useState('');

    useEffect(() => {
        async function fetchCourses() {
            try {
                const coursesResponse = await axios.get('http://localhost:5000/api/courses/my-courses');
                setCourses(coursesResponse.data);
                let initialChat = {};
                coursesResponse.data.forEach(course => {
                    initialChat[course.id] = [];
                });
                setChatHistory(initialChat);

                // Fetch the user's profile to get their name
                const profileResponse = await axios.get('http://localhost:5000/api/courses/my-profile');
                setUserName(profileResponse.data.name);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        
        fetchCourses();
    }, []);

    const selectCourse = (course) => {
        setSelectedCourse(course);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() && selectedCourse && userName) {
            const updatedChat = { ...chatHistory };
            const newMessage = { text: message, user: userName };
            updatedChat[selectedCourse.id] = [...(chatHistory[selectedCourse.id] || []), newMessage];
            setChatHistory(updatedChat);
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
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
                            {chatHistory[selectedCourse.id] && chatHistory[selectedCourse.id].map((message, index) => (
                                <div key={index} style={{ background: '#f1f1f1', margin: '10px 0', padding: '5px' }}>
                                    <strong>{message.user}: </strong>{message.text}
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
