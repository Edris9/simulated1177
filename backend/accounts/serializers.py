from rest_framework import serializers
from .models import User
from .validators import validate_password_complexity

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        validators=[validate_password_complexity]
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'password', 'first_name', 'last_name', 
            'address', 'age', 'description'
        ]
    
    def validate_age(self, value):
        if value < 18:
            raise serializers.ValidationError('Du måste vara minst 18 år gammal')
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'address', 'age', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']