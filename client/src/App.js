import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MyCourses from './components/MyCourses';
import CourseWeights from './components/CourseWeights';
import GradesCoursesList from './components/GradesCoursesList';
import ViewGrades from './components/ViewGrades';
import Discussions from './components/Discussions'; // Import the Discussions component

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>GradePal</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/grades">Grades</Link></li>
              <li><Link to="/discussions">Discussions</Link></li> {/* Add Discussions link */}
            </ul>
          </nav>
        </header>
        
        <Routes>
          <Route path="/" element={<MyCourses />} />
          <Route path="/course/:courseId" element={<CourseWeights />} />
          <Route path="/grades" element={<GradesCoursesList />} />
          <Route path="/grades/:courseId" element={<ViewGrades />} />
          <Route path="/discussions" element={<Discussions />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
