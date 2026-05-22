#!/usr/bin/env python3

import requests
import os

def test_resume_api():
    """Test the resume analyzer API with a sample PDF."""
    api_url = "http://localhost:8000/analyze-resume"

    # Find a PDF file in uploads
    uploads_dir = "uploads"
    pdf_files = [f for f in os.listdir(uploads_dir) if f.endswith('.pdf')]

    if not pdf_files:
        print("No PDF files found in uploads directory")
        return

    pdf_path = os.path.join(uploads_dir, pdf_files[0])
    print(f"Testing with PDF: {pdf_path}")

    try:
        # Test without job description (dynamic analysis)
        with open(pdf_path, 'rb') as f:
            files = {'file': (os.path.basename(pdf_path), f, 'application/pdf')}
            response = requests.post(api_url, files=files)

        print(f"Response status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"Match Percentage: {result.get('matchPercentage', 'N/A')}")
            print(f"Recommendation: {result.get('recommendation', 'N/A')}")
            print(f"Risk Level: {result.get('riskLevel', 'N/A')}")
            print(f"Skills Found: {len(result.get('extractedInfo', {}).get('skills', []))}")
            print(f"Summary: {result.get('summary', '')[:100]}...")
        else:
            print(f"❌ API call failed: {response.text}")

    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_resume_api()
