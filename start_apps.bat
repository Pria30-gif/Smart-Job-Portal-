@echo off
echo Starting Smart Job Portal Apps...

REM Change to the directory of the batch file
cd /d %~dp0

REM Activate virtual environment and install requirements if needed
echo Installing Python dependencies...
myenv\Scripts\pip.exe install -r requirements.txt

REM Start the Streamlit Salary Prediction App in the background
start "Streamlit Salary Prediction" cmd /c "myenv\Scripts\python.exe -m streamlit run WebApp-ML-salaryprediction/app.py --server.port 8506 --server.address localhost"

REM Start the Interview Feedback Dashboard
start "Interview Feedback Dashboard" cmd /c "myenv\Scripts\python.exe -m streamlit run InterviewFeedbackDashboard/app.py --server.port 8502 --server.address localhost"

REM Change to Frontend directory, install dependencies, and start the React app
cd Frontend
echo Installing Frontend dependencies...
npm install
start "React Frontend" cmd /c "npm run dev"

REM Change to Backend directory, install dependencies, and start the Node app
cd ../Backend
echo Installing Backend dependencies...
npm install
<<<<<<< HEAD
start "Node Backend" cmd /c "node index.js"
=======
start "Node Backend" cmd /c "npm start"
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

echo Apps are starting...
pause
