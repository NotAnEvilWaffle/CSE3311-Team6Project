const express = require('express')
const router = express.Router()
const axios = require('axios')
const Course = require('../models/Course')


// Endpoint to fetch assignments due within a week for all courses
router.get('/upcoming-assignments', async (req, res) => {
  try {
      const canvasToken = process.env.CANVAS_ACCESS_TOKEN;
      const userId = req.query.userId; // Assuming you pass the user ID as a query parameter

      // First, fetch the courses the user is enrolled in
      const coursesResponse = await axios.get(`https://canvas.instructure.com/api/v1/users/${userId}/courses`, {
          headers: { 'Authorization': `Bearer ${canvasToken}` }
      });

      // Extract course IDs from the response
      const courseIds = coursesResponse.data.map(course => course.id);

      // Now, fetch assignments for each course and filter by due date
      let allAssignments = [];
      for (const courseId of courseIds) {
          const assignmentsResponse = await axios.get(`https://canvas.instructure.com/api/v1/courses/${courseId}/assignments`, {
              headers: { 'Authorization': `Bearer ${canvasToken}` }
          });

          // Filter assignments due within the next 7 days
          const upcomingAssignments = assignmentsResponse.data.filter(assignment => {
              const dueDate = new Date(assignment.due_at);
              const today = new Date();
              const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
              return dueDate >= today && dueDate <= nextWeek;
          });

          allAssignments.push(...upcomingAssignments);
      }

      // Sort the assignments by due date
      allAssignments.sort((a, b) => new Date(a.due_at) - new Date(b.due_at));

      res.json(allAssignments);
  } catch (error) {
      console.error('Error fetching upcoming assignments:', error.message);
      res.status(500).json({ error: 'Failed to fetch upcoming assignments', details: error.message });
  }
});


// Endpoint to fetch grades for a specific course from Canvas
router.get('/:courseId/grades', async (req, res) => {
  try {
    const { courseId } = req.params
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = `https://canvas.instructure.com/api/v1/courses/${courseId}/enrollments`

    // Make an API call to Canvas to get the enrollments for the specific course
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      },
      params: {
        // Assuming you're interested in student enrollments; otherwise, adjust as needed.
        'enrollment_type[]': 'student',
        // This parameter is necessary to retrieve grades.
        'include[]': 'current_grades'
      }
    })

    // Process the response to extract the grades information
    const grades = response.data.map(enrollment => ({
      userId: enrollment.user_id,
      userName: `${enrollment.user.name}`,
      // Extracting more data if necessary, like email, etc.
      // The structure of current_grades may vary based on the grading scheme.
      // Make sure to handle various cases (like no grades assigned yet).
      grades: enrollment.grades.current_score // or enrollment.grades.current_grade for letter grade
      // ... any other relevant information you want to include
    }))

    res.json(grades)
  } catch (error) {
    console.error('Error fetching grades:', error.message)
    res.status(500).json({ error: 'Failed to fetch grades for the course', details: error.message })
  }
})

// ... (other requires and router setup)

// ... (other requires and router setup)

// Endpoint to fetch the current user's profile from Canvas
router.get('/my-profile', async (req, res) => {
  try {
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = 'https://uta.instructure.com/api/v1/users/self'

    // Make an API call to Canvas using the token.
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    // The response should contain the user's profile information, including their ID
    const userProfile = response.data

    res.json(userProfile)
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message })
  }
})

router.get('/:courseId/assignments', async (req, res) => {
  try {
    const { courseId } = req.params
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = `https://canvas.instructure.com/api/v1/user/courses/${courseId}/assignments`

    // Make an API call to Canvas to get the assignments for the specified course
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    const assignments = response.data

    res.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error.message)
    res.status(500).json({ error: 'Failed to fetch assignments', details: error.message })
  }
})

// Endpoint to fetch a specific submission for a student in a course from Canvas
router.get('/:courseId/assignments/:assignmentId/submissions/:userId', async (req, res) => {
  try {
    const { courseId, assignmentId, userId } = req.params
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = `https://canvas.instructure.com/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`

    // Make an API call to Canvas to get the submission for the specified assignment and student
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    const submission = response.data

    res.json(submission)
  } catch (error) {
    console.error('Error fetching submission:', error.message)
    res.status(500).json({ error: 'Failed to fetch submission', details: error.message })
  }
})

router.get('/:userId/courses/:courseId/assignments', async (req, res) => {
  try {
    const { userId, courseId } = req.params
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = `https://uta.instructure.com/api/v1/users/${userId}/courses/${courseId}/assignments?include[]=submission`

    // Make an API call to Canvas to get the submission for the specified assignment and student
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    const assignments = response.data
    const gradedAssignments = []

    for (const assignment of assignments) {
      // If not graded use N/A
      const grade = assignment.submission ? assignment.submission.score : 'N/A'
      const assignmentInfo = [assignment.name, grade]
      gradedAssignments.push(assignmentInfo)
    }

    res.json(gradedAssignments)
  } catch (error) {
    console.error('Error fetching assignments:', error.message)
    res.status(500).json({ error: 'Failed to fetch assignments', details: error.message })
  }
})

router.get('/:courseId/courseName', async (req, res) => {
  try {
    const { courseId } = req.params
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = `https://uta.instructure.com/api/v1/courses/${courseId}`

    // Make an API call to Canvas to get the enrollments for the logged-in user
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    // Process the response to extract the grades information
    const courseName = response.data.name

    res.json(courseName)
  } catch (error) {
    console.error('Error fetching course:', error.message)
    res.status(500).json({ error: 'Failed to fetch course', details: error.message })
  }
})

router.get('/:userId/courses/:courseId/currentScore', async (req, res) => {
  try {
    const { userId, courseId } = req.params
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = `https://uta.instructure.com/api/v1/users/${userId}/enrollments?enrollment_state=active`

    // Make an API call to Canvas to get the enrollments for the logged-in user
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    const enrollments = response.data
    console.log(enrollments)

    const filteredEnrollments = enrollments.filter(
      (enrollment) => enrollment.course_id === parseInt(courseId, 10)
    )

    if (filteredEnrollments.length > 0) {
      const currentScore = filteredEnrollments[0].grades.current_score

      res.json(currentScore)
    }
  } catch (error) {
    console.error('Error fetching course:', error.message)
    res.status(500).json({ error: 'Failed to fetch course', details: error.message })
  }
})

// Endpoint to fetch grades for a specific student in all courses from Canvas
router.get('/my-grades', async (req, res) => {
  try {
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = 'https://canvas.instructure.com/api/v1/users/self/enrollments'

    // Make an API call to Canvas to get the enrollments for the logged-in user
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    // Process the response to extract the grades information
    const grades = response.data.map(enrollment => {
      return {
        courseId: enrollment.course_id,
        grades: enrollment.grades
        // ... any other relevant information you want to include
      }
    })

    res.json(grades)
  } catch (error) {
    console.error('Error fetching grades:', error.message)
    res.status(500).json({ error: 'Failed to fetch grades', details: error.message })
  }
})

// ... (rest of your router code)

// Endpoint to fetch courses the user is enrolled in from Canvas.
router.get('/my-courses', async (req, res) => {
  try {
    const canvasToken = process.env.CANVAS_ACCESS_TOKEN
    const apiUrl = 'https://uta.instructure.com/api/v1/courses?enrollment_state=active'

    // Make an API call to Canvas using the token.
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${canvasToken}`
      }
    })

    // Process each course fetched from Canvas.
    const coursePromises = response.data.map(async course => {
      const existingCourse = await Course.findOne({ courseId: course.id })

      // If the course doesn't exist in our DB, create it.
      if (!existingCourse) {
        const newCourse = new Course({
          courseId: course.id,
          name: course.name,
          weights: {}
        })
        return newCourse.save()
      }

      // If it exists and there's no update, simply return it.
      return existingCourse
    })

    const courses = await Promise.all(coursePromises)

    res.json(courses.map(course => ({ id: course.courseId, name: course.name })))
  } catch (error) {
    console.error('Error:', error.message)
    return res.status(500).json({ error: 'Failed to fetch and save courses', details: error.message })
  }
})

// Endpoint to set the weights for a specific course.
router.post('/:courseId/weights', async (req, res) => {
  try {
    const { courseId } = req.params
    const weights = req.body

    const parsedCourseId = Number(courseId)
    const course = await Course.findOne({ courseId: parsedCourseId })

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    course.weights = weights
    await course.save()

    res.json({ message: 'Weights updated successfully', course })
  } catch (error) {
    console.error('Error updating weights:', error.message)
    res.status(500).json({ error: 'Failed to update weights', details: error.message })
  }
})

module.exports = router
