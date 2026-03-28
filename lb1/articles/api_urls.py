from django.urls import path
from .api import ArticleListAPIView, ArticleDetailAPIView

urlpatterns = [
    path('articles/', ArticleListAPIView.as_view(), name='api_article_list'),
    path('articles/<int:pk>/', ArticleDetailAPIView.as_view(), name='api_article_detail'),
]
