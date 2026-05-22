import sys
import json
import re

def preprocess_text(text):
    """
    Preprocess input text by:
    - Lowercasing
    - Removing non-alphanumeric characters
    - Splitting into unique words (set)
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    words = text.split()
    return set(words)

def simple_match_score(job_description, resumes):
    """
    Calculate a simple match score based on keyword overlap
    between the job description and each resume.
    Returns a list of dicts with resume text, score, and matched skills.
    """
    job_words = preprocess_text(job_description)
    matches = []
    for resume in resumes:
        resume_words = preprocess_text(resume)
        common_words = job_words.intersection(resume_words)
        score = len(common_words) / (len(job_words) + 1e-6)  # avoid zero division
        matches.append({
            'resume': resume,
            'score': round(score, 4),
            'matchedSkills': list(common_words)
        })
    return matches

if __name__ == "__main__":
    # Command line usage:
    # python ai_match.py "<job_description>" '["resume text 1", "resume text 2", ...]'
    if len(sys.argv) < 3:
        print("Usage: python ai_match.py \"<job_description>\" '[\"resume1\", \"resume2\", ...]'")
        sys.exit(1)

    job_desc = sys.argv[1]
    resumes_json = sys.argv[2]

    try:
        resumes = json.loads(resumes_json)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON for resumes"}))
        sys.exit(1)

    results = simple_match_score(job_desc, resumes)

    # Output results as JSON
    print(json.dumps(results))
