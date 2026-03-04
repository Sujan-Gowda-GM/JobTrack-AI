from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyObtainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
         token=super().get_token(user)
         token["user"]=user.username
         return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["username","email","password"]
        extra_kwargs={"password":{"write_only":True}}
        
    def create(self,validated_data):
            return User.objects.create_user(**validated_data)
        
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "id",
            "company_name",
            "job_role",
            "status",
            "ats_score",
            "applied_date",
            "created_at",
            "updated_at",
            "job_description",
            "salary",
            "jobtype",
            "location"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        