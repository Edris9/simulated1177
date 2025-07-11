from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])
@csrf_exempt  # LÄGG TILL DENNA RAD
def logout_view(request):
    logout(request)
    return Response({'message': 'Utloggning lyckades'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def register_view(request):
    print("Data received:", request.data)
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Användare skapad framgångsrikt',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    print("Login attempt:", request.data)  # Debug
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Testa direkt
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                login(request, user)
                return Response({
                    'message': 'Inloggning lyckades',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            pass
            
        return Response({
            'error': 'Fel användarnamn eller lösenord'
        }, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Utloggning lyckades'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_profile_view(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    return Response({
        'error': 'Ej inloggad'
    }, status=status.HTTP_401_UNAUTHORIZED)