# Mock Interview Fix TODO

## Issues to Fix:
1. **UserId mismatch**: MockInterviewPrep uses custom userId input, but InterviewFeedbackDashboard uses user._id from Redux
2. **Upload failure**: Need better error handling for the upload endpoint

## Steps:
- [ ] 1. Modify MockInterviewPrep.jsx to use Redux user._id instead of custom userId input
- [ ] 2. Remove the userId input field from the form (keep name, email, domain)
- [ ] 3. Add better error handling for the upload endpoint
- [ ] 4. Test the changes
