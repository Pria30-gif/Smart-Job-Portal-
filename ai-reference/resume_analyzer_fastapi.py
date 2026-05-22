from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile
import json
from typing import Optional
from resume_analyzer import ResumeAnalyzer

app = FastAPI(title="Resume Analyzer API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzer with Groq API key
groq_key = os.getenv('GROQ_API_KEY')
analyzer = ResumeAnalyzer(groq_key)

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None)
):
    """
    Analyze a resume file (PDF/TXT) and return comprehensive evaluation.

    - **file**: Resume file (PDF or TXT)
    - **job_description**: Optional job description for targeted analysis
    """
    try:
        # Validate file type
        allowed_types = ["application/pdf", "text/plain"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and TXT files are allowed"
            )

        # Save uploaded file temporarily
        file_extension = os.path.splitext(file.filename or "file.pdf")[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Extract text from file
            resume_text = analyzer.extract_text_from_file(temp_file_path)

            # Analyze resume
            result = analyzer.analyze_resume(resume_text, job_description)

            return result

        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "resume-analyzer"}

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Resume Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "POST /analyze-resume": "Analyze resume file",
            "GET /health": "Health check"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
