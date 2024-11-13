from django.urls import path
from authentication.views import login, register, logout

app_name = 'authentication'

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('create-flutter/', create_mood_flutter, name='create_mood_flutter'),
    path('logout/', logout, name='logout'),
]