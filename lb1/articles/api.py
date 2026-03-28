from rest_framework import serializers, generics
from .models import Article


# Рівень 4: Серіалізатор для моделі Article
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'text', 'published_date', 'author']


# Рівень 4: API-вид — список всіх статей (GET) та створення (POST)
class ArticleListAPIView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer


# Рівень 4: API-вид — деталі однієї статті (GET, PUT, DELETE)
class ArticleDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
