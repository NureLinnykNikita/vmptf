from django.db import models


# Рівень 1: Модель "Стаття" з полями Заголовок, Текст, Дата публікації
# Рівень 2: Розширено полем "Автор"
class Article(models.Model):
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    text = models.TextField(verbose_name='Текст')
    published_date = models.DateField(verbose_name='Дата публікації')
    author = models.CharField(max_length=100, verbose_name='Автор')  # Рівень 2

    class Meta:
        verbose_name = 'Стаття'
        verbose_name_plural = 'Статті'
        ordering = ['-published_date']

    def __str__(self):
        return f"{self.title} ({self.author})"
