const express = require('express');
const router = express.Router();
const axios = require('axios');
const Course = require('../models/Course');  // Import the Course model

router.get('/my-courses', async (req, res) => {
    try {
        const canvasToken = process.env.CANVAS_ACCESS_TOKEN;
        const apiUrl = 'https://canvas.instructure.com/api/v1/courses?enrollment_state=active';

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${canvasToken}`
            }
        });

        // Loop through each course and save/update in the database
        const coursePromises = response.data.map(async course => {
            // Look for the course in the database
            const existingCourse = await Course.findOne({ courseId: course.id });

            if (!existingCourse) {
                // Create new course record if not found
                const newCourse = new Course({
                    courseId: course.id,
                    name: course.name,
                    weights: {}  // Initially, weights will be empty; you can update this later
                });

                return newCourse.save();
            }

            // Optionally, you can update the existing course if needed
            // For instance, if you believe course names might change and you want to keep them updated:
            // existingCourse.name = course.name;
            // return existingCourse.save();

            return existingCourse;  // If no new creation or update, return the existing course
        });

        // Wait for all courses to be processed (either created, updated, or skipped)
        const courses = await Promise.all(coursePromises);

        res.json(courses.map(course => ({ id: course.courseId, name: course.name })));

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch and save courses', details: error.message });
    }
});



router.post('/:courseId/weights', async (req, res) => {
    try {
        const { courseId } = req.params;
        const weights = req.body;

        // Parse the courseId to Number as it's saved as a number in the DB.
        const parsedCourseId = Number(courseId);

        const course = await Course.findOne({ courseId: parsedCourseId });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        course.weights = weights;
        await course.save();

        res.json({ message: 'Weights updated successfully', course });

    } catch (error) {
        console.error('Error updating weights:', error.message);
        res.status(500).json({ error: 'Failed to update weights', details: error.message });
    }
});


module.exports = router;
