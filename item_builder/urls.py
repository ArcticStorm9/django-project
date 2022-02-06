from django.contrib.auth.decorators import login_required
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home-page"),
    path('auth/user/', views.get_authenticated_user, name="get-authenticated-user"),
    path('auth/login/', views.discord_login, name="auth-login"),
    path('auth/logout/', views.discord_logout, name="auth-logout"),
    path('auth/login/redirect/', views.discord_login_redirect, name="auth-login-redirect"),
    path('admin/', views.admin, name="admin"),
    path('make/', views.builder, name="item-builder"),
    path('builds/', login_required(views.BuildListView.as_view(), login_url='/auth/login'), name="build-list"),
    path('builds/<int:pk>/', login_required(views.BuildDetailView.as_view(), login_url='/auth/login'), name='build-detail'),
    path('user/builds/', views.user_builds, name="user-builds"),
    path('calculator/', views.user_builds, name="skill-calc"),
    path('heroes/', views.heroes, name="heroes"),
    path('items/', views.items, name="items"),
]
