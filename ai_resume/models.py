from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ResumeAnalysis(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    resume_text=models.TextField()
    job_description=models.TextField()
    ats_score=models.IntegerField(null=True, blank=True)
    ats_report = models.TextField(null=True, blank=True)
    missing_keywords = models.TextField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        ordering = ['-created_at']
        
        
    def __str__(self):
        return f"Analysis for {self.user} - Score: {self.ats_score}"