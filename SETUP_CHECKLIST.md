# ✅ Real Analysis Setup Checklist

Use this checklist to ensure everything is ready for real analysis.

## 🔧 Installation Phase

- [ ] **Install dependencies**
  ```bash
  cd c:\Projectspriya\SMART-JOB-PORTAL
  pip install -r requirements.txt
  ```

- [ ] **Verify Flask is installed**
  ```bash
  pip list | findstr flask
  # Should show: Flask, Flask-CORS
  ```

- [ ] **Verify Whisper is installed** (for speech analysis)
  ```bash
  pip list | findstr whisper
  # Should show: openai-whisper
  ```

- [ ] **(Optional) Video analysis dependencies**
  ```bash
  pip install opencv-python mediapipe
  ```

- [ ] **(Optional) AI feedback engine** - Install Ollama from https://ollama.ai
  - Then run: `ollama pull gemma`
  - Keep Ollama running in separate terminal

## 🎯 Backend Verification

- [ ] **Start backend API**
  ```bash
  cd c:\Projectspriya\SMART-JOB-PORTAL
  python interview_feedback_backend.py
  ```
  Should show: `* Running on http://127.0.0.1:5011`

- [ ] **Test backend health**
  ```bash
  # In new terminal
  curl http://localhost:5011/health
  # Should return: {"status":"healthy"}
  ```

- [ ] **(Optional) Run full backend test**
  ```bash
  python test_backend_api.py
  # Should pass health check and upload test
  ```

## 🎬 Frontend Verification

- [ ] **Start frontend development server**
  ```bash
  cd Frontend
  npm run dev
  ```
  Should show Vite dev server URL (usually http://localhost:5173)

- [ ] **Check frontend loads**
  - Open browser to frontend URL
  - Should see app without errors
  - Open DevTools (F12) - no connection errors

## 🧪 Integration Test

- [ ] **Navigate to Mock Interview Prep**
  - Click "Mock Interview Prep" in navigation menu
  - See interview setup form

- [ ] **Fill in user details**
  - Name: Your name (or test name)
  - Email: test@example.com
  - User ID: test_user_001
  - Domain: Frontend (or your choice)

- [ ] **Start interview**
  - Click "Start Mock Interview"
  - See camera feed activating
  - Hear microphone status

- [ ] **Answer questions**
  - Answer 2-3 questions fully
  - See transcripts appearing
  - Check camera is recording

- [ ] **End interview**
  - Click "End Interview"
  - See "Analyzing..." message
  - Wait for backend to process (takes 10-30 seconds on first run)

- [ ] **Check results**
  - [ ] Score shows something other than 0/100
  - [ ] Body language metrics visible
  - [ ] Eye contact percentage shown
  - [ ] Emotion detection shown
  - [ ] AI feedback text present
  - [ ] Your answers displayed with scores

## 🐛 Troubleshooting

If any step fails, check:

### Backend won't start
- [ ] Python is installed: `python --version`
- [ ] Dependencies installed: `pip list | findstr flask`
- [ ] No other process using port 5011: `netstat -ano | findstr :5011`

### Backend won't respond to health check
- [ ] Backend terminal shows `Running on http://127.0.0.1:5011`
- [ ] Try accessing http://localhost:5011/health in browser
- [ ] Check firewall isn't blocking port 5011

### Frontend won't start
- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Dependencies installed: `npm list` (in Frontend folder)
- [ ] Try: `npm install` then `npm run dev`

### Interview won't record
- [ ] Browser asking for camera/mic permission - allow it
- [ ] Check other apps not using camera
- [ ] Refresh browser and try again

### Can't submit interview to backend
- [ ] Check browser console (F12) for errors
- [ ] Verify backend is running and healthy
- [ ] Check CORS isn't blocked (should be enabled)
- [ ] Try backend test: `python test_backend_api.py`

### Feedback shows N/A or missing metrics
- [ ] Verify optional dependencies installed
- [ ] Check backend console for error messages
- [ ] Try simpler interview (fewer questions) first

### First analysis takes 30+ seconds
- [ ] This is normal! (Whisper downloading 3GB model)
- [ ] Subsequent analyses will be faster
- [ ] Check backend terminal for progress

## 📊 Expected Results

After completing setup and running one interview, you should have:

✅ Mock interview component recording video  
✅ Real-time transcription showing in UI  
✅ Backend successfully analyzing submission  
✅ Feedback page showing actual metrics (not 0/100)  
✅ No errors in browser console  
✅ No errors in backend terminal  

## 🎉 Success Criteria

You know everything is working when:

- [ ] Score is not 0/100
- [ ] Eye contact percentage shown (0-100%)
- [ ] Posture rating shown (1-10)
- [ ] Emotions detected (neutral, confident, etc.)
- [ ] AI feedback text is meaningful
- [ ] Your answers shown with expected keywords

## 📝 Next Steps

After verification:

1. **Try another interview** with different domain
2. **Check browser console** (F12) for any warnings
3. **Review backend logs** for any errors
4. **Iterate** - run multiple interviews to track improvement

## 💬 Common Questions

**Q: What if something still doesn't work?**  
A: Check the troubleshooting section above. Most issues are port conflicts or missing dependencies.

**Q: Can I change the port?**  
A: Yes - edit `interview_feedback_backend.py` (line with `app.run(port=5011)`)  
   Then update `MockInterviewPrep.jsx` to use new port in fetch URL

**Q: Do I need to keep backend running?**  
A: Yes! Keep backend terminal open while testing frontend

**Q: Can I test without video/audio?**  
A: Yes - backend accepts dummy video files for testing

**Q: How do I reset everything?**  
A: Kill backend (Ctrl+C), kill frontend (Ctrl+C), run again

---

**When everything is checked, you're ready to start using Real Analysis!** 🚀

For more details, see:
- QUICK_START_REAL_ANALYSIS.md - 3-step setup
- IMPLEMENTATION_SUMMARY.md - What changed and why
- BEFORE_AND_AFTER.md - Visual comparison
- REAL_ANALYSIS_SETUP.md - Detailed configuration
