import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MyCourses from './components/MyCourses';
import CourseWeights from './components/CourseWeights';
import GradesCoursesList from './components/GradesCoursesList';
import ViewGrades from './components/ViewGrades';
import Discussions from './components/Discussions'; // Import the Discussions component

function App() {

  const openNav = () => {
    document.getElementById("sideNav").style.display = "block";
  }

  const closeNav = () => {
    document.getElementById("sideNav").style.display = "none";
  }


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div class="logo">
            <img src="/images/GardePal_Transparent.png" alt=''/>
          </div>
          <h1>GradePal</h1>
          <span onClick={openNav}>&#9776;</span>
        </header>
        
      <div id="sideNav" class="sidenav">
        <a href="javascript:void(0)" class="closebtn" onClick={closeNav}>&times;</a>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/grades">Grades</Link></li>
        <li><Link to="/discussions">Discussions</Link></li> {/* Add Discussions link */}
      </div>


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
