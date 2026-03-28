from django.shortcuts import render, get_object_or_404
from .models import Article


# Рівень 3: Вид для списку статей
def article_list(request):
    author_filter = request.GET.get('author', '')
    if author_filter:
        # Рівень 2: Вивід статей конкретного автора через ORM
        articles = Article.objects.filter(author=author_filter)
    else:
        articles = Article.objects.all()

    authors = Article.objects.values_list('author', flat=True).distinct()
    return render(request, 'articles/article_list.html', {
        'articles': articles,
        'authors': authors,
        'author_filter': author_filter,
    })


# Рівень 3: Вид для окремої статті
def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, 'articles/article_detail.html', {'article': article})
