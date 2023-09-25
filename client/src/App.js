import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Notice the change here
import './App.css';
import MyCourses from './components/MyCourses';
import CourseWeights from './components/CourseWeights';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GradePal</h1>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<MyCourses />} />  // Change in the Route component usage
          <Route path="/course/:courseId" element={<CourseWeights />} />  // Change here as well
        </Routes>
      </Router>
    </div>
  );
}

export default App;
