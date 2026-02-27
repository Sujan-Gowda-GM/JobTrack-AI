from pypdf import PdfReader
import google.generativeai as genai
import os
import json

def pdf_extract(file):
    reader=PdfReader(file)
    text=""
    
    for page in reader.pages:
        content=page.extract_text()
        if content:
            text+=content+"\n"
            
    return text

def gemini_feedback(resume_text,job_description):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model=genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    You are a Senior Career Coach and ATS Auditor. Provide a high-level, detailed analysis.
    
    RESUME: {resume_text}
    JOB DESCRIPTION: {job_description}

    TASK:
    Analyze the resume for:
    1. MATCH SCORE: (0-100) based on hard skills and experience.
    2. ATS COMPLIANCE: Is it single-column? Are there jumbled characters (indicating tables/graphics)? 
    3. MISSING KEYWORDS: Specific technical terms from the JD not found in the resume.
    4. DETAILED INSIGHTS:
       - **Impact Check**: Did the user use numbers (e.g., "Increased sales by 20%")? If not, suggest where to add them.
       - **Action Verbs**: Suggest better verbs (e.g., use "Spearheaded" instead of "Led").
       - **Formatting Warning**: Flag if the layout will likely break in an older ATS.

    RETURN ONLY A JSON OBJECT:
    {{
        "score": 85,
        "ats_report": "Single-column detected. Standard headers used. No tables found.",
        "missing_keywords": ["Django REST Framework", "Docker", "Unit Testing"],
        "feedback": "### Mentor Insights\\n\\n**Impact Analysis**\\nYour project section is good, but lacks metrics. Instead of saying 'built a fitness tracker,' say 'built a tracker used by 50+ users with 99% uptime.'\\n\\n**ATS Formatting**\\nYour resume is safe for most systems because it avoids columns..."
    }}
    """
    
    response=model.generate_content(prompt,generation_config={"response_mime_type": "application/json"})
    
    raw_response=response.text.strip().replace('```json', '').replace('```', '')
    
    try:
        return json.loads(raw_response)
    except Exception as e:
        return {
                    "score": 0, 
                    "ats_report": "Error",
                    "missing_keywords": "None",
                    "feedback": "AI was unable to process the request."
                }
