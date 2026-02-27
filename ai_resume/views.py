from django.shortcuts import render
from .utils import gemini_feedback,pdf_extract
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import ResumeAnalysisSerializer
from .models import ResumeAnalysis
# Create your views here.

class ResumeAnalysisView(ListCreateAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=ResumeAnalysisSerializer
    
    def get_queryset(self):
        return ResumeAnalysis.objects.filter(user=self.request.user)
    
    
    def perform_create(self, serializer):
        
        pdf_file=self.request.FILES.get('resume_file')
        job_desc=self.request.data.get('job_description')
        extracted_text=pdf_extract(pdf_file)
        result=gemini_feedback(extracted_text,job_desc)
        
        serializer.save(
            user=self.request.user,
            resume_text=extracted_text,
            ats_score=result.get('score'),
            ats_report=result.get('ats_report'),
            missing_keywords=result.get('missing_keywords'),
            feedback=result.get('feedback')
            )        
