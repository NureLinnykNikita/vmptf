#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'articles_project.settings')
django.setup()

from articles.models import Article
from datetime import date

Article.objects.all().delete()

# Тестові статті
articles_data = [
    {'title': 'Вступ до Python',
     'text': 'Python — проста та потужна мова програмування. Вона широко використовується у веб-розробці, науці про дані та автоматизації.',
     'published_date': date(2024, 1, 15), 'author': 'Іван Петренко'},
    {'title': 'Django для початківців',
     'text': 'Django — це веб-фреймворк на Python, який дотримується принципу "батарейки включені". Він надає ORM, адмін-панель та шаблонізатор.',
     'published_date': date(2024, 2, 10), 'author': 'Іван Петренко'},
    {'title': 'REST API з DRF',
     'text': 'Django REST Framework спрощує створення API. Серіалізатори конвертують моделі у JSON, а ViewSets скорочують код.',
     'published_date': date(2024, 3, 5), 'author': 'Іван Петренко'},
    {'title': 'Основи JavaScript',
     'text': 'JavaScript є мовою веб-браузерів. З появою Node.js вона поширилась і на серверну сторону.',
     'published_date': date(2024, 1, 20), 'author': 'Марія Коваль'},
    {'title': 'React vs Vue',
     'text': 'React та Vue — два популярні JavaScript-фреймворки. React від Meta, Vue — незалежний проект. Обидва мають компонентну архітектуру.',
     'published_date': date(2024, 3, 18), 'author': 'Марія Коваль'},
]

for data in articles_data:
    Article.objects.create(**data)

print(f"Створено {Article.objects.count()} статей.\n")

# Рівень 2: ORM — вивід статей конкретного автора
author_name = 'Іван Петренко'
articles_by_author = Article.objects.filter(author=author_name)

print(f"=== Статті автора '{author_name}' (Рівень 2 — ORM) ===")
for article in articles_by_author:
    print(f"  [{article.pk}] {article.title} | {article.published_date}")

print(f"\nВсього статей автора: {articles_by_author.count()}")
print("\nГотово! Тепер запустіть сервер: python manage.py runserver")
