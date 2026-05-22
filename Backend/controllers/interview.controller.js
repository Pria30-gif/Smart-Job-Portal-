import Interview from '../models/interview.model.js';

export const scheduleInterview = async (req, res) => {
    try {
        const { applicant, job, date, time, notes } = req.body;
        const recruiter = req.id; // from auth middleware

        const interview = new Interview({
            applicant,
            job,
            recruiter,
            date,
            time,
            notes
        });

        await interview.save();

        res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully',
            interview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to schedule interview',
            error: error.message
        });
    }
};

export const getInterviews = async (req, res) => {
    try {
        const recruiter = req.id;
        const interviews = await Interview.find({ recruiter }).populate('applicant job');

        res.status(200).json({
            success: true,
            interviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interviews',
            error: error.message
        });
    }
<<<<<<< HEAD
};

export const updateInterview = async (req, res) => {
    try {
        const interviewId = req.params.id;
        const { date, time, notes, status } = req.body;
        const recruiter = req.id;

        const interview = await Interview.findOne({ _id: interviewId, recruiter });
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        if (date) interview.date = date;
        if (time) interview.time = time;
        if (notes !== undefined) interview.notes = notes;
        if (status) interview.status = status;

        await interview.save();

        res.status(200).json({
            success: true,
            message: 'Interview updated successfully',
            interview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update interview',
            error: error.message
        });
    }
};
=======
};
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
