import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // import Link
import './App.css';
import MyCourses from './components/MyCourses';
import CourseWeights from './components/CourseWeights';
import GradesCoursesList from './components/GradesCoursesList'; // Re-import the component
import ViewGrades from './components/ViewGrades'

function App() {
  return (
    <Router> {/* Router should be the outermost component */}
      <div className="App">
        <header className="App-header">
          <h1>GradePal</h1>
          {/* Navigation links */}
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/grades">Grades</Link></li> {/* Re-add Grades link */}
            </ul>
          </nav>
        </header>
        
        <Routes>
          <Route path="/" element={<MyCourses />} />
          <Route path="/course/:courseId" element={<CourseWeights />} />
          <Route path="/grades" element={<GradesCoursesList />} /> {/* Re-add this route */}
          <Route path="/grades/:courseId" element={<ViewGrades />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
