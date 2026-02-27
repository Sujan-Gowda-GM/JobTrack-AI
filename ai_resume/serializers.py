from rest_framework import serializers
from .models import ResumeAnalysis

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model=ResumeAnalysis
        fields=['job_description','resume_text','ats_score','feedback','created_at','ats_report','missing_keywords']
        
        read_only_fields=['ats_score', 
            'ats_report', 
            'missing_keywords', 
            'feedback', 
            'created_at']