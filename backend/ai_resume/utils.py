from pypdf import PdfReader
from google import genai 
import os
import json

def pdf_extract(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        content = page.extract_text()
        if content:
            text += content + "\n"
    return text


def gemini_feedback(resume_text, job_description):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    prompt = f"""
    You are a Senior Career Coach and ATS Auditor. Provide a high-level, detailed analysis.
    
    RESUME: {resume_text}
    JOB DESCRIPTION: {job_description}

    TASK:
    Analyze the resume for score, ATS compliance, missing keywords, and detailed insights.

    RETURN ONLY A JSON OBJECT:
    {{
        "score": 85,
        "ats_report": "Single-column detected. Standard headers used. No tables found.",
        "missing_keywords": ["Django REST Framework", "Docker", "Unit Testing"],
        "feedback": "Detailed Markdown mentor insights..."
    }}
    """
    
    
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite", 
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
        }
    )
    
    try:
        return json.loads(response.text)
    except Exception as e:
        return {
            "score": 0, 
            "ats_report": "Error",
            "missing_keywords": "None",
            "feedback": f"AI was unable to process the request: {str(e)}"
        }